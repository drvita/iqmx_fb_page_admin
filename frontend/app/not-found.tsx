import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#050811] text-gray-100 overflow-hidden font-sans flex flex-col items-center justify-center text-center px-6">
      
      {/* Efectos de luces de fondo (Glow effects) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

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
        {/* Código de Error */}
        <div className="text-8xl font-black tracking-widest bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse select-none">
          404
        </div>
        
        {/* Título de Error */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-6 mb-3 leading-snug">
          Página no encontrada
        </h2>

        {/* Descripción */}
        <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed mb-10">
          La página a la que intentas acceder no existe, ha sido movida o la ruta no ha sido creada todavía.
        </p>

        {/* Botón para Regresar al Home */}
        <Link
          href="/"
          className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all border border-blue-400/10"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Regresar a Inicio
        </Link>
      </div>
    </div>
  );
}
