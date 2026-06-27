import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import LandingLoginPanel from "@/components/LandingLoginPanel";

export const metadata = {
  title: "IQISS Insight - Social Analytics & Reportes de IA",
  description: "Conecta tus páginas de Facebook, descarga analíticas clave de los últimos 28 días y automatiza reportes semanales inteligentes basados en el rendimiento de tus posts.",
};

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("session_token")?.value;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12 items-start relative z-10" id="landing-main">
        
        {/* Left Column: Copy, illustration, and features */}
        <div className="flex-1 w-full flex flex-col items-start text-left">
          {/* Distintivo de Inteligencia Artificial */}
          <div className="badge-ai" id="badge-ai-mvp">
            <svg
              className="w-3.5 h-3.5 animate-spin"
              style={{ animationDuration: '3s' }}
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 bg-gradient-to-b from-text-main via-text-main/95 to-text-sub bg-clip-text text-transparent" id="landing-title">
            Tus métricas de Facebook. <br />
            <span className="bg-gradient-to-r from-accent via-cta to-purple-500 bg-clip-text text-transparent">
              Entendidas por IA.
            </span>
          </h1>

          {/* Descripción (Narrativa) */}
          <p className="text-base sm:text-lg text-text-sub max-w-2xl mb-8 font-light leading-relaxed" id="landing-description">
            Conecta tus páginas de Facebook de forma oficial, descarga métricas clave de los últimos 28 días y genera recomendaciones automatizadas por Inteligencia Artificial para crear contenido estratégico que multiplique tu engagement.
          </p>

          {/* Mobile Login Helper */}
          <div className="block md:hidden mb-6 text-xs text-cta bg-cta/10 border border-cta/20 px-4 py-2.5 rounded-xl font-medium w-full text-center">
            👇 Acepta los términos en la parte inferior para iniciar sesión con Facebook de forma segura.
          </div>

          {/* Imagen de Mockup / Vista Previa del Dashboard */}
          <div className="relative w-full max-w-3xl rounded-2xl border border-border-custom overflow-hidden shadow-2xl shadow-cta/5 hover:shadow-cta/15 transform hover:-translate-y-1 hover:scale-[1.005] transition-all duration-500 group mb-16 bg-card-custom/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-main/30 via-transparent to-transparent pointer-events-none z-10" />
            <img 
              src="/img/dashboard_preview.png" 
              alt="Vista Previa de IQISS Insight Dashboard" 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.005]"
            />
          </div>

          {/* Sección de Features del MVP */}
          <div className="w-full text-left scroll-mt-24 mb-16" id="mvp-features">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main mb-3">
              ¿Qué incluye el MVP de IQISS Insight?
            </h2>
            <p className="text-text-sub text-sm sm:text-base max-w-xl mb-10 font-light">
              Nuestra primera fase está enfocada en proveer valor inmediato a dueños de negocios mediante análisis precisos de los últimos 28 días.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  Reportes automáticos que combinan métricas globales y rendimiento individual de posts para entregarte sugerencias de optimización.
                </p>
              </div>
            </div>
          </div>

          {/* Sección de Futuro Roadmap */}
          <div className="w-full text-left scroll-mt-24 border-t border-border-custom pt-16" id="future-roadmap">
            <h2 className="text-2xl font-bold text-text-main mb-3">
              Roadmap del Producto (Próximas Fases)
            </h2>
            <p className="text-text-sub text-sm max-w-xl mb-10 font-light">
              Una visión clara de las características adicionales planificadas para potenciar tu presencia y administración digital.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
        </div>

        {/* Right Column: Sticky Access Panel */}
        <div className="w-full md:w-auto md:sticky md:top-24">
          <LandingLoginPanel isLoggedIn={isLoggedIn} />
        </div>
    </main>
  );
}
