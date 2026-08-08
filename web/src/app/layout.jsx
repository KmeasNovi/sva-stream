import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'CulStream',
  description: 'Clássicos do cinema e curtas de animação, de graça, para todo mundo.',
};

export default function RootLayout({ children }) {
  return (
    <html className="dark" lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background min-h-screen overflow-x-hidden selection:bg-primary/30 selection:text-primary">
        <Navbar />
        <main className="pt-[72px] md:pl-[280px] min-h-screen pb-20 md:pb-0">{children}</main>
      </body>
    </html>
  );
}
