import { api } from '../lib/api';

const SITE_URL = 'https://sepiastream.com';

export default async function sitemap() {
  const staticEntries = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/cadastro`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/entrar`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/doacao`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  let movieEntries = [];
  try {
    const { data: movies } = await api.listMovieSlugs();
    movieEntries = movies.map((m) => ({
      url: `${SITE_URL}/movie/${m.slug}`,
      lastModified: m.updatedAt ? new Date(m.updatedAt) : new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    }));
  } catch {
    // backend fora do ar não pode derrubar o sitemap inteiro — só sai sem
    // as URLs de filme dessa vez, o Google tenta de novo na próxima visita
  }

  return [...staticEntries, ...movieEntries];
}
