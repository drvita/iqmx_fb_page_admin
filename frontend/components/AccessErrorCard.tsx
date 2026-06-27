import React from "react";
import Link from "next/link";

export default function AccessErrorCard() {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border-custom bg-card-custom/50 text-center max-w-md mx-auto my-12 shadow-lg">
      <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 shrink-0">
        <svg
          className="w-6 h-6 stroke-current fill-none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <h3 className="text-sm font-bold text-text-main mb-2 uppercase tracking-wide">
        Acceso no disponible
      </h3>
      <p className="text-xs text-text-sub leading-relaxed font-light mb-6">
        Por el momento no tenemos acceso a los datos de esta página. Por favor, asegúrate de haber concedido los permisos necesarios en Facebook y vuelve a conectar tu cuenta.
      </p>
      <Link
        href="/dashboard"
        className="px-5 py-2.5 rounded-xl bg-cta hover:bg-cta/90 text-xs font-semibold text-white transition-all duration-300"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
