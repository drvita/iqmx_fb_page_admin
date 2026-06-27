import React from "react";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-background pb-32 md:pb-12">
      {/* Efectos de luces de fondo (Glow effects) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none dark:bg-blue-600/5 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none dark:bg-purple-600/5 animate-pulse" />

      {/* Grid de fondo elegante */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40 dark:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(rgba(108,60,225,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header Público Unificado */}
      <header className="header-main" id="landing-header">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 flex items-center justify-center animate-bounce">
            <img 
              src="/img/logo_without_text_transparent.png" 
              alt="IQISS Insight Logo" 
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-text-main to-text-sub bg-clip-text text-transparent leading-none">
              IQISS <span className="text-cta font-extrabold">Insight</span>
            </span>
            <span className="text-[10px] text-text-sub font-semibold tracking-wider uppercase mt-1">
              By IQISSMexico
            </span>
          </div>
        </Link>
      </header>

      {/* Contenido único de la ruta */}
      {children}

      {/* Footer Público Unificado */}
      <footer className="footer-main" id="landing-footer">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 text-xs font-semibold">
          <Link href="/privacidad" className="text-text-sub hover:text-cta transition-colors">
            Aviso de Privacidad
          </Link>
          <span className="text-border-custom hidden sm:inline">|</span>
          <Link href="/terminos" className="text-text-sub hover:text-cta transition-colors">
            Términos de Servicio
          </Link>
          <span className="text-border-custom hidden sm:inline">|</span>
          <Link href="/eliminacion-cuenta" className="text-text-sub hover:text-cta transition-colors">
            Eliminación de Datos
          </Link>
        </div>
        <p className="mb-2">
          &copy; {new Date().getFullYear()} IQISS Insight. Todos los derechos reservados.
        </p>
        <p>
          Una marca y producto de <a href="https://iqissmexico.com" target="_blank" rel="noopener noreferrer" className="text-text-sub hover:text-cta transition-colors font-semibold">IQISSMexico</a>. Analítica de Redes Sociales con Inteligencia Artificial.
        </p>
      </footer>
    </div>
  );
}
