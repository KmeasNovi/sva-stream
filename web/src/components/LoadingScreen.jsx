import Image from 'next/image';

export default function LoadingScreen({ label = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 min-h-[50vh]">
      <Image src="/logo-icon.png" alt="" width={56} height={56} className="animate-pulse" />
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-4 border-t-secondary border-r-primary border-b-transparent border-l-transparent animate-spin shadow-[0_0_20px_rgba(168,85,247,0.35)]"
          style={{ animationDuration: '0.8s' }}
        />
      </div>
      <p className="font-body text-body-md text-on-surface-variant animate-pulse">{label}</p>
    </div>
  );
}
