import { Lock, ShieldCheck } from "lucide-react";

export function PaymentTrustBadges() {
  return (
    <div className="mt-4 flex flex-col items-center gap-2.5 text-center">
      {/* Selos dos meios de pagamento */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {/* Mastercard */}
        <div
          className="flex h-6 w-10 items-center justify-center rounded bg-white px-1 shadow-xs ring-1 ring-black/5"
          title="Mastercard"
        >
          <svg viewBox="0 0 32 20" className="h-3.5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="10" r="6.5" fill="#EB001B" />
            <circle cx="21" cy="10" r="6.5" fill="#F79E1B" fillOpacity="0.92" />
            <path
              d="M16 5.8a6.47 6.47 0 0 1 2.5 4.2A6.47 6.47 0 0 1 16 14.2a6.47 6.47 0 0 1-2.5-4.2A6.47 6.47 0 0 1 16 5.8z"
              fill="#FF5F00"
            />
          </svg>
        </div>

        {/* Visa */}
        <div
          className="flex h-6 w-10 items-center justify-center rounded bg-white px-1 shadow-xs ring-1 ring-black/5"
          title="Visa"
        >
          <span className="font-sans text-[11px] font-black italic tracking-tighter text-[#1A1F71] select-none">
            VISA
          </span>
        </div>

        {/* Hipercard */}
        <div
          className="flex h-6 w-11 items-center justify-center rounded bg-[#B3141A] px-1 shadow-xs ring-1 ring-black/10"
          title="Hipercard"
        >
          <span className="font-sans text-[9px] font-extrabold italic tracking-tight text-white select-none">
            Hiper
          </span>
        </div>

        {/* American Express */}
        <div
          className="flex h-6 w-10 items-center justify-center rounded bg-[#006FCF] px-1 shadow-xs ring-1 ring-black/10"
          title="American Express"
        >
          <span className="font-sans text-[8px] font-black tracking-tighter text-white select-none">
            AMEX
          </span>
        </div>

        {/* PIX */}
        <div
          className="flex h-6 items-center gap-1 rounded bg-white px-1.5 shadow-xs ring-1 ring-black/5"
          title="PIX"
        >
          <svg viewBox="0 0 512 512" className="size-3.5 shrink-0" fill="#32BCAD" xmlns="http://www.w3.org/2000/svg">
            <path d="M374.3 430.4c-13.8 0-27.1-5.5-36.9-15.3l-72.8-72.8c-4.7-4.7-12.4-4.7-17.1 0l-72.8 72.8c-9.8 9.8-23.1 15.3-36.9 15.3-13.8 0-27.1-5.5-36.9-15.3l-28.7-28.7c-9.8-9.8-15.3-23.1-15.3-36.9s5.5-27.1 15.3-36.9l72.8-72.8c4.7-4.7 4.7-12.4 0-17.1l-72.8-72.8c-9.8-9.8-15.3-23.1-15.3-36.9s5.5-27.1 15.3-36.9l28.7-28.7c9.8-9.8 23.1-15.3 36.9-15.3 13.8 0 27.1 5.5 36.9 15.3l72.8 72.8c4.7 4.7 12.4 4.7 17.1 0l72.8-72.8c9.8-9.8 23.1-15.3 36.9-15.3 13.8 0 27.1 5.5 36.9 15.3l28.7 28.7c9.8 9.8 15.3 23.1 15.3 36.9s-5.5 27.1-15.3 36.9l-72.8 72.8c-4.7 4.7-4.7 12.4 0 17.1l72.8 72.8c9.8 9.8 15.3 23.1 15.3 36.9s-5.5 27.1-15.3 36.9l-28.7 28.7c-9.8 9.8-23.1 15.3-36.9 15.3zm-192.4-58.4c4.3 0 8.5-1.7 11.5-4.7l82.7-82.7c11.5-11.5 30.1-11.5 41.6 0l82.7 82.7c3.1 3.1 7.2 4.7 11.5 4.7 4.3 0 8.5-1.7 11.5-4.7l28.7-28.7c6.4-6.4 6.4-16.7 0-23.1l-82.7-82.7c-11.5-11.5-11.5-30.1 0-41.6l82.7-82.7c6.4-6.4 6.4-16.7 0-23.1l-28.7-28.7c-3.1-3.1-7.2-4.7-11.5-4.7-4.3 0-8.5 1.7-11.5 4.7l-82.7 82.7c-11.5 11.5-30.1 11.5-41.6 0l-82.7-82.7c-3.1-3.1-7.2-4.7-11.5-4.7-4.3 0-8.5 1.7-11.5 4.7l-28.7 28.7c-6.4 6.4-6.4 16.7 0 23.1l82.7 82.7c11.5 11.5 11.5 30.1 0 41.6l-82.7 82.7c-6.4 6.4-6.4 16.7 0 23.1l28.7 28.7c3.1 3.1 7.2 4.7 11.5 4.7z" />
          </svg>
          <span className="font-mono text-[10px] font-bold tracking-tight text-[#32BCAD] select-none">
            pix
          </span>
        </div>
      </div>

      {/* Selo Hotmart e Garantia / Segurança */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-primary-foreground/80">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="#FF5A00" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.22 2c-.12 2.6-1.57 4.54-3.4 5.9C6.88 9.32 5.5 11.4 5.5 14.1c0 3.63 2.94 6.9 6.72 6.9 3.79 0 6.78-3.27 6.78-6.9 0-3.32-2.1-6.19-3.92-8.15a11.3 11.3 0 0 0-2.86-3.85zm-.05 15.96c-1.85 0-3.36-1.52-3.36-3.39 0-1.42.87-2.64 2.1-3.13-.1.65.12 1.34.61 1.83.58.58 1.44.75 2.18.43.08.28.12.57.12.87 0 1.87-1.47 3.39-3.45 3.39z" />
          </svg>
          <span>Processado pela <strong className="font-semibold text-white">Hotmart</strong></span>
        </span>
        <span className="hidden sm:inline text-primary-foreground/30">•</span>
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300">
          <Lock className="size-3 shrink-0" />
          <span>Compra 100% Segura</span>
        </span>
        <span className="hidden sm:inline text-primary-foreground/30">•</span>
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300">
          <ShieldCheck className="size-3.5 shrink-0" />
          <span>Garantia de 7 dias</span>
        </span>
      </div>
    </div>
  );
}
