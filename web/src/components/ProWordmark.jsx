// Marca visual "Pro" (gradiente + coroa) usada tanto no Navbar (via
// ProBadge.jsx, só quando o host é pro.sepiastream.com) quanto em botões que
// convidam pro Pro a partir do site normal, onde não faz sentido esconder
// atrás da checagem de host — por isso fica num componente puro separado,
// sem lógica de detecção.
export default function ProWordmark() {
  return (
    <span className="relative inline-flex align-baseline">
      <span className="bg-gradient-to-r from-[rgb(var(--color-primary))] to-[#ffd54f] bg-clip-text text-transparent font-display font-extrabold italic">
        Pro
      </span>
      <span className="absolute -top-2.5 -right-3 text-xs rotate-12 select-none" aria-hidden="true">
        👑
      </span>
    </span>
  );
}
