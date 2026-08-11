'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import DonationModal from './DonationModal';

// Mostra o convite de doação pra quem chega numa página de filme sem estar
// logado (ex: vindo de uma busca no Google) — a página em si funciona sem
// login, então esse é o único lugar em que esse público vê o pedido de
// apoio. Ao contrário do modal pós-login da Home (que só aparece uma vez
// por sessão), esse aparece em toda página de filme acessada deslogado —
// pedido explícito do usuário.
export default function MovieDonationPrompt() {
  const { user, loading } = useUser();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!loading && !user) setShow(true);
  }, [loading, user]);

  if (!show) return null;
  return <DonationModal onClose={() => setShow(false)} />;
}
