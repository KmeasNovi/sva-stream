"""
app.py — serviço web (Flask) que expõe finder.py pro botão "Buscar filmes" do
/admin. Roda como um serviço Render separado do backend Node (ver
DEPLOY.md nesta pasta) — não tem acesso direto ao MongoDB, só à API pública/
autenticada do backend já existente.

Fluxo:
  1. POST /scrape/start   (Authorization: Bearer <token de admin>) -> job_id
  2. GET  /scrape/status/<job_id>  (mesmo token) -> progresso, log, resumo
  3. GET  /scrape/download/<job_id> (mesmo token) -> CSV pronto pra baixar

Autenticação: não decodifica o JWT aqui nem fala com o Mongo — cada request
é validado chamando de volta uma rota admin-only do backend Node
(GET /api/movies?limit=1). Se o backend aceitar o token, é admin de verdade;
se rejeitar, 401 aqui também. Mantém esse serviço sem nenhuma credencial de
banco de dados.
"""

import os
import threading
import uuid
from datetime import datetime, timezone

import requests
from flask import Flask, Response, jsonify, request
from flask_cors import CORS

import finder

BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:4000").rstrip("/")
# Caminho do CSV já versionado no repo, se este checkout tiver acesso a ele
# (dedupe extra contra decisões de rodadas anteriores). Opcional — se não
# existir, essa camada de dedupe é só pulada, sem quebrar nada.
CATALOG_CSV_PATH = os.environ.get("CATALOG_CSV_PATH", "../novos-filmes-encontrados.csv")
CORS_ORIGIN = os.environ.get("CORS_ORIGIN", "*")

app = Flask(__name__)
CORS(app, origins=CORS_ORIGIN.split(",") if CORS_ORIGIN != "*" else "*")

_jobs = {}
_jobs_lock = threading.Lock()
_MAX_LOG_LINES = 200


class JobProgress:
    """Ponte entre finder.run() (thread de background) e o dict de jobs."""

    def __init__(self, job_id):
        self.job_id = job_id

    def update(self, **kwargs):
        with _jobs_lock:
            _jobs[self.job_id].update(kwargs)

    def push_log(self, message):
        with _jobs_lock:
            job = _jobs[self.job_id]
            job["log"].append(message)
            if len(job["log"]) > _MAX_LOG_LINES:
                job["log"] = job["log"][-_MAX_LOG_LINES:]


def get_bearer_token():
    header = request.headers.get("Authorization", "")
    if header.startswith("Bearer "):
        return header[len("Bearer "):]
    return None


def require_admin():
    """Devolve o token se for de admin válido, ou uma Response de erro."""
    token = get_bearer_token()
    if not token:
        return None, (jsonify(success=False, message="Não autenticado"), 401)
    try:
        res = requests.get(
            f"{BACKEND_URL}/api/movies",
            params={"limit": 1},
            headers={"Authorization": f"Bearer {token}"},
            timeout=15,
        )
    except requests.RequestException as e:
        return None, (jsonify(success=False, message=f"Backend indisponível: {e}"), 502)

    if res.status_code == 401:
        return None, (jsonify(success=False, message="Token inválido ou expirado"), 401)
    if res.status_code >= 400:
        return None, (jsonify(success=False, message="Falha ao validar admin"), res.status_code)
    return token, None


@app.get("/health")
def health():
    return jsonify(success=True, status="ok")


@app.post("/scrape/start")
def scrape_start():
    token, err = require_admin()
    if err:
        return err

    # Só um job por vez — evita duas buscas simultâneas martelando os
    # mesmos sites e disputando o mesmo CSV de saída.
    with _jobs_lock:
        running = [j for j in _jobs.values() if j["status"] == "running"]
        if running:
            return jsonify(success=False, message="Já existe uma busca em andamento"), 409

        job_id = uuid.uuid4().hex
        _jobs[job_id] = {
            "status": "running",
            "phase": "iniciando",
            "started_at": datetime.now(timezone.utc).isoformat(),
            "finished_at": None,
            "candidates_found": 0,
            "total_to_verify": 0,
            "verified_count": 0,
            "added": 0,
            "discarded": 0,
            "log": [],
            "csv": None,
            "error": None,
        }

    def worker():
        progress = JobProgress(job_id)
        try:
            csv_text = finder.run(progress, BACKEND_URL, token, CATALOG_CSV_PATH)
            with _jobs_lock:
                _jobs[job_id]["csv"] = csv_text
                _jobs[job_id]["status"] = "done"
                _jobs[job_id]["finished_at"] = datetime.now(timezone.utc).isoformat()
        except Exception as e:  # noqa: BLE001 — job de background, precisa capturar tudo
            with _jobs_lock:
                _jobs[job_id]["status"] = "error"
                _jobs[job_id]["error"] = str(e)
                _jobs[job_id]["finished_at"] = datetime.now(timezone.utc).isoformat()
            progress.push_log(f"ERRO FATAL: {e}")

    threading.Thread(target=worker, daemon=True).start()
    return jsonify(success=True, data={"jobId": job_id}), 202


@app.get("/scrape/status/<job_id>")
def scrape_status(job_id):
    _, err = require_admin()
    if err:
        return err

    with _jobs_lock:
        job = _jobs.get(job_id)
        if not job:
            return jsonify(success=False, message="Job não encontrado"), 404
        data = {k: v for k, v in job.items() if k != "csv"}
        data["hasCsv"] = job["csv"] is not None
    return jsonify(success=True, data=data)


@app.get("/scrape/download/<job_id>")
def scrape_download(job_id):
    _, err = require_admin()
    if err:
        return err

    with _jobs_lock:
        job = _jobs.get(job_id)
        if not job:
            return jsonify(success=False, message="Job não encontrado"), 404
        if job["status"] != "done" or job["csv"] is None:
            return jsonify(success=False, message="Busca ainda não terminou"), 409
        csv_text = job["csv"]

    filename = f"novos-filmes-encontrados-{job_id[:8]}.csv"
    return Response(
        csv_text,
        mimetype="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)
