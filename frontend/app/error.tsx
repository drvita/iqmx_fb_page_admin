"use client";

import React, { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Registrar el error en sistemas de monitoreo o consola del servidor/cliente
    console.error("[NEXT.js EXCEPCIÓN NO CONTROLADA]:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen bg-[#050811] text-gray-100 overflow-hidden font-sans flex flex-col items-center justify-center text-center px-6">
      
      {/* Efectos de luces de fondo (Glow effects) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid de fondo elegante */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-md w-full">
        {/* Icono de advertencia */}
        <div className="mx-auto h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 mb-6">
          <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        {/* Título de Error */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-snug">
          Ha ocurrido un error inesperado
        </h2>

        {/* Descripción */}
        <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed mb-8">
          La aplicación detectó una excepción inesperada. Puedes intentar recargar la sección o regresar al inicio.
        </p>

        {/* Detalles del error (Opcional, en un spoiler elegante) */}
        <details className="mb-10 text-left bg-white/[0.02] border border-white/5 rounded-xl p-3.5 select-none cursor-pointer">
          <summary className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors">
            Ver detalles del error
          </summary>
          <p className="text-[11px] font-mono text-red-400 mt-2 break-all max-h-24 overflow-y-auto whitespace-pre-wrap">
            {error.message || "Error sin mensaje específico."}
            {error.digest && `\nDigest: ${error.digest}`}
          </p>
        </details>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-base font-bold text-white shadow-lg shadow-blue-500/10 active:scale-[0.98]"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-base font-bold text-gray-300 text-center active:scale-[0.98]"
          >
            Regresar a Inicio
          </a>
        </div>
      </div>
    </div>
  );
}
