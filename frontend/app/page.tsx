import React from "react";
import { cookies } from "next/headers";
import FacebookLoginButton from "@/components/FacebookLoginButton";

export const metadata = {
  title: "IQISS Insight - Social Analytics & Reportes de AI",
  description: "Conecta tus páginas de Facebook, descarga analíticas clave de los últimos 28 días y automatiza reportes semanales inteligentes basados en el rendimiento de tus posts.",
};

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("session_token")?.value;

  return (
    <div className="app-background">
      
      {/* Efectos de luces de fondo (Glow effects) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none dark:bg-blue-600/5" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none dark:bg-purple-600/5" />

      {/* Grid de fondo elegante */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40 dark:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(rgba(108,60,225,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header */}
      <header className="header-main" id="landing-header">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 flex items-center justify-center">
            <img 
              src="/logo_without_text_transparent.png" 
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
        </div>
        <div>
          <span className="text-xs text-text-sub bg-card-custom px-3 py-1.5 rounded-full border border-border-custom font-medium shadow-sm">
            Fase 1: MVP Analítico
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="hero-section" id="landing-main">
        {/* Distintivo de Inteligencia Artificial */}
        <div className="badge-ai" id="badge-ai-mvp">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 21l8.982-11.795H14.18l1.018-5.096L6.218 15.904h3.595z"
            />
          </svg>
          INTELIGENCIA ARTIFICIAL & ANALÍTICA DE NEGOCIO
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6 bg-gradient-to-b from-text-main via-text-main/80 to-text-sub bg-clip-text text-transparent" id="landing-title">
          Tus métricas de Facebook. Entendidas por IA.
        </h1>

        {/* Descripción (Narrativa) */}
        <p className="text-lg sm:text-xl text-text-sub max-w-3xl mb-12 font-light leading-relaxed" id="landing-description">
          Conecta tus páginas de Facebook de forma oficial, descarga métricas clave de los últimos 28 días y genera recomendaciones automatizadas por Inteligencia Artificial para crear contenido estratégico que multiplique tu ROI.
        </p>

        {/* CTA B2B (Call to action) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center min-h-[80px] w-full mb-24" id="landing-cta-container">
          <FacebookLoginButton isLoggedIn={isLoggedIn} size="lg" />
          <a
            href="#mvp-features"
            className="btn-cta-secondary"
            id="btn-learn-more"
          >
            Explorar Características
          </a>
        </div>

        {/* Sección de Features del MVP */}
        <div className="w-full max-w-6xl text-center scroll-mt-24 mb-24" id="mvp-features">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main mb-3">
            ¿Qué incluye el MVP de IQISS Insight?
          </h2>
          <p className="text-text-sub text-sm sm:text-base max-w-2xl mx-auto mb-10 font-light">
            Nuestra primera fase está enfocada en proveer valor inmediato a dueños de negocios mediante análisis precisos de los últimos 28 días.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Card 1 */}
            <div className="card-feature" id="feature-fb-connect">
              <div className="card-icon-wrapper">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">
                Conexión con Facebook
              </h3>
              <p className="text-sm text-text-sub leading-relaxed">
                Autenticación oficial de Meta para acceder a tus páginas administradas y obtener tokens de acceso de larga duración en un clic.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card-feature" id="feature-metrics-sync">
              <div className="card-icon-wrapper">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">
                Analíticas del Último Ciclo
              </h3>
              <p className="text-sm text-text-sub leading-relaxed">
                Descarga automática y persistente en base de datos de tus KPIs de los últimos 28 días (Seguidores, Alcance y Engagement).
              </p>
            </div>

            {/* Card 3 */}
            <div className="card-feature" id="feature-post-audit">
              <div className="card-icon-wrapper">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">
                Auditoría de Publicaciones
              </h3>
              <p className="text-sm text-text-sub leading-relaxed">
                Desglose inteligente de tus posts recientes incluyendo mensaje, imágenes, recuento de reacciones, comentarios y veces compartido.
              </p>
            </div>

            {/* Card 4 */}
            <div className="card-feature" id="feature-ai-reports">
              <div className="card-icon-wrapper">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">
                Reportes Semanales con IA
              </h3>
              <p className="text-sm text-text-sub leading-relaxed">
                Reportes automáticos que combinan métricas globales y rendimiento individual de posts para entregarte sugerencias claras de optimización.
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Futuro Roadmap */}
        <div className="w-full max-w-5xl text-center scroll-mt-24 border-t border-border-custom pt-16" id="future-roadmap">
          <h2 className="text-2xl font-bold text-text-main mb-3">
            Roadmap del Producto (Próximas Fases)
          </h2>
          <p className="text-text-sub text-sm max-w-xl mx-auto mb-10 font-light">
            Una visión clara de las características adicionales planificadas para potenciar tu presencia y administración digital.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Roadmap 1 */}
            <div className="p-5 rounded-xl border border-border-custom bg-card-custom/40 backdrop-blur-sm relative" id="roadmap-instagram">
              <span className="absolute top-4 right-4 text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                Fase 2
              </span>
              <h4 className="text-base font-bold text-text-main/80 mb-2">
                Conexión con Instagram
              </h4>
              <p className="text-xs text-text-sub leading-relaxed">
                Integración y comparación directa de analíticas para cuentas comerciales de Instagram enlazadas a tu Fanpage.
              </p>
            </div>

            {/* Roadmap 2 */}
            <div className="p-5 rounded-xl border border-border-custom bg-card-custom/40 backdrop-blur-sm relative" id="roadmap-content">
              <span className="absolute top-4 right-4 text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                Fase 2
              </span>
              <h4 className="text-base font-bold text-text-main/80 mb-2">
                Generador de Contenido
              </h4>
              <p className="text-xs text-text-sub leading-relaxed">
                Asistente de Inteligencia Artificial para redactar posts y proponer imágenes llamativas listas para publicar.
              </p>
            </div>

            {/* Roadmap 3 */}
            <div className="p-5 rounded-xl border border-border-custom bg-card-custom/40 backdrop-blur-sm relative" id="roadmap-schedule">
              <span className="absolute top-4 right-4 text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                Fase 3
              </span>
              <h4 className="text-base font-bold text-text-main/80 mb-2">
                Calendario Editorial
              </h4>
              <p className="text-xs text-text-sub leading-relaxed">
                Programación y calendarización automática de posts directamente a tus perfiles desde una sola pantalla.
              </p>
            </div>

            {/* Roadmap 4 */}
            <div className="p-5 rounded-xl border border-border-custom bg-card-custom/40 backdrop-blur-sm relative" id="roadmap-replies">
              <span className="absolute top-4 right-4 text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                Fase 3
              </span>
              <h4 className="text-base font-bold text-text-main/80 mb-2">
                Messenger Auto-Reply
              </h4>
              <p className="text-xs text-text-sub leading-relaxed">
                Respuestas automáticas inteligentes controladas por IA para responder consultas en tu buzón de Facebook Messenger.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-main" id="landing-footer">
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

