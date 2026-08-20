// Páginas onde a barra lateral/menu inferior/busca do app NÃO aparecem —
// independente de estar logado ou não. É a landing page (marketing, não faz
// sentido com sidebar de app por cima) e as telas de autenticação/legais,
// que não são "navegação" de catálogo. Usado por Navbar.jsx e AppShell.jsx
// pra decidir o mesmo em ambos (senão a barra lateral aparece mas o
// <main> não abre espaço pra ela, ou vice-versa).
const NO_CHROME_PATHS = [
  '/',
  '/entrar',
  '/cadastro',
  '/verificar-email',
  '/esqueci-senha',
  '/redefinir-senha',
  '/privacidade',
  '/doacao',
];

export default function isChromeLessPath(pathname) {
  return NO_CHROME_PATHS.includes(pathname) || pathname.startsWith('/admin');
}
