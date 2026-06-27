"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import FacebookLoginButton from "./FacebookLoginButton";

interface LandingLoginPanelProps {
  isLoggedIn: boolean;
}

export default function LandingLoginPanel({ isLoggedIn }: LandingLoginPanelProps) {
  const [accepted, setAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full md:w-[360px] p-6 rounded-2xl border border-border-custom bg-card-custom/40 backdrop-blur-md animate-pulse h-[320px] flex items-center justify-center">
        <span className="text-text-sub text-sm">Cargando acceso seguro...</span>
      </div>
    );
  }

  // A. IF ALREADY LOGGED IN: Simple, high-executive welcome card to redirect to dashboard
  if (isLoggedIn) {
    return (
      <div className="w-full md:w-[360px] p-6 rounded-2xl border border-border-custom bg-card-custom/60 backdrop-blur-md shadow-lg shadow-black/5 relative overflow-hidden transition-all duration-300 hover:border-cta/30">
        {/* Glow effect inside card */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-cta/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-cta/15 flex items-center justify-center text-cta mb-4 border border-cta/20">
            <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-text-main mb-2">Sesión Activa</h3>
          <p className="text-xs text-text-sub mb-6 leading-relaxed">
            Ya has iniciado sesión de forma segura. Accede directamente a tu panel de control de analíticas.
          </p>
          <FacebookLoginButton isLoggedIn={true} size="md" loggedInText="Ir al Dashboard" />
        </div>
      </div>
    );
  }

  // B. IF NOT LOGGED IN: Dual layout (Desktop Sidebar vs Mobile Fixed Bottom Bar)
  return (
    <>
      {/* 1. DESKTOP VIEWPORT LAYOUT (Sticky card on the right) */}
      <div className="hidden md:block w-full md:w-[360px] p-6 rounded-2xl border border-border-custom bg-card-custom/50 backdrop-blur-md shadow-xl shadow-black/5 hover:shadow-black/10 transition-all duration-300 relative overflow-hidden group hover:border-cta/20">
        {/* Glow effect on hover */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-600/5 rounded-full blur-xl group-hover:bg-blue-600/10 transition-all duration-500 pointer-events-none" />
        
        <h3 className="text-lg font-bold text-text-main mb-2 flex items-center gap-2">
          <span>Acceso Directo</span>
          <span className="text-[10px] font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
            Seguro
          </span>
        </h3>
        
        <p className="text-xs text-text-sub mb-6 leading-relaxed">
          Conecta tus Fanpages mediante el inicio de sesión oficial de Meta para sincronizar estadísticas y generar reportes semanales de IA.
        </p>

        {/* Checkbox and legal disclaimers */}
        <div className="space-y-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border-custom text-cta focus:ring-cta/30 bg-main/55 transition-all duration-200 cursor-pointer"
            />
            <span className="text-xs text-text-sub leading-normal">
              Acepto expresamente los{" "}
              <Link href="/terminos" className="text-cta hover:underline font-semibold" target="_blank">
                Términos de Servicio
              </Link>{" "}
              y el{" "}
              <Link href="/privacidad" className="text-cta hover:underline font-semibold" target="_blank">
                Aviso de Privacidad
              </Link>.
            </span>
          </label>
        </div>

        {/* Facebook Login Button */}
        <div className="w-full flex justify-center mb-5">
          <FacebookLoginButton 
            isLoggedIn={false} 
            size="md" 
            text="Conectar con Facebook" 
            disabled={!accepted}
          />
        </div>

        {/* Security / Privacy details */}
        <div className="border-t border-border-custom/50 pt-4 flex items-center gap-2 text-[10px] text-text-sub">
          <svg className="w-3.5 h-3.5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>
            Inicio de sesión oficial cifrado de Meta. No guardamos tu contraseña de Facebook.
          </span>
        </div>
      </div>

      {/* 2. MOBILE VIEWPORT LAYOUT (Sticky bottom bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card-custom/95 backdrop-blur-lg border-t border-border-custom px-4 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] transition-transform duration-300">
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          
          {/* Checkbox wrapper */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4.5 w-4.5 rounded border-border-custom text-cta focus:ring-cta/30 bg-main transition-all duration-200 cursor-pointer"
            />
            <span className="text-[11px] text-text-sub leading-normal">
              Acepto los{" "}
              <Link href="/terminos" className="text-cta hover:underline font-bold" target="_blank">
                Términos
              </Link>{" "}
              y el{" "}
              <Link href="/privacidad" className="text-cta hover:underline font-bold" target="_blank">
                Aviso de Privacidad
              </Link>{" "}
              para iniciar sesión en IQISS Insight.
            </span>
          </label>

          {/* Facebook Login Button */}
          <div className="w-full flex justify-center">
            <FacebookLoginButton 
              isLoggedIn={false} 
              size="md" 
              text="Conectar con Facebook" 
              disabled={!accepted}
            />
          </div>
        </div>
      </div>
    </>
  );
}
