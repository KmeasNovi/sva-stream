import Image from 'next/image';

export default function LoadingScreen({ label = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-7 py-24 min-h-[50vh]">
      <Image src="/logo-icon.png" alt="" width={120} height={120} className="animate-pulse" />
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-[6px] border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-[6px] border-t-secondary border-r-primary border-b-transparent border-l-transparent animate-spin shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          style={{ animationDuration: '0.8s' }}
        />
      </div>
      <p className="font-body text-body-lg text-on-surface-variant animate-pulse">{label}</p>
    </div>
  );
}
