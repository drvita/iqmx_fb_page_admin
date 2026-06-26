import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface UserProfile {
  id: number;
  facebook_user_id: string;
  name: string;
  email: string | null;
  roles: string[];
  facebook_pages: any[];
}

/**
 * ProfilePage - Protected view displaying the logged-in user profile details.
 * Optimized for minimalist mobile settings style.
 */
export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    redirect("/");
  }

  let user: UserProfile | null = null;
  let shouldRedirect = false;
  try {
    user = await apiClient<UserProfile>("/auth/me", {
      cache: "no-store",
    });
  } catch (error) {
    console.error("[PROFILE PAGE] Error fetching user profile:", error);
    shouldRedirect = true;
  }

  if (shouldRedirect || !user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col w-full animate-fade-in">
      
      {/* Tactile Back Button */}
      <Link href="/dashboard" className="dash-btn-back">
        <svg
          className="w-4 h-4 stroke-current fill-none shrink-0"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Volver a Inicio</span>
      </Link>

      {/* Profile Title */}
      <div className="mb-6 border-b border-border-custom pb-4">
        <h1 className="text-xl font-extrabold text-text-main leading-snug">
          Mi Perfil
        </h1>
        <p className="text-xs text-text-sub mt-1 font-light">
          Información de tu cuenta vinculada en IQISS Insight.
        </p>
      </div>

      {/* Settings list layout */}
      <div className="flex flex-col rounded-2xl border border-border-custom bg-card-custom overflow-hidden shadow-md">
        
        {/* Row 1: Name */}
        <div className="flex flex-col gap-1 p-4 border-b border-border-custom bg-card-custom/50">
          <span className="text-[10px] text-text-sub uppercase tracking-wider font-bold">
            Nombre Completo
          </span>
          <span className="text-sm font-semibold text-text-main">
            {user.name}
          </span>
        </div>

        {/* Row 2: Email */}
        <div className="flex flex-col gap-1 p-4 border-b border-border-custom bg-card-custom/50">
          <span className="text-[10px] text-text-sub uppercase tracking-wider font-bold">
            Correo Electrónico
          </span>
          <span className="text-sm font-semibold text-text-main truncate">
            {user.email || "No provisto"}
          </span>
        </div>

        {/* Row 3: FB User ID */}
        <div className="flex flex-col gap-1 p-4 border-b border-border-custom bg-card-custom/50">
          <span className="text-[10px] text-text-sub uppercase tracking-wider font-bold">
            ID de Usuario Facebook
          </span>
          <span className="text-xs font-mono text-text-main truncate">
            {user.facebook_user_id}
          </span>
        </div>

        {/* Row 4: Roles */}
        <div className="flex flex-col gap-1 p-4 border-b border-border-custom bg-card-custom/50">
          <span className="text-[10px] text-text-sub uppercase tracking-wider font-bold">
            Roles de Acceso
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.roles.map((role) => (
              <span
                key={role}
                className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cta/10 border border-cta/20 text-cta capitalize"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Row 5: Pages count */}
        <div className="flex flex-col gap-1 p-4 bg-card-custom/50">
          <span className="text-[10px] text-text-sub uppercase tracking-wider font-bold">
            Cuentas Vinculadas
          </span>
          <span className="text-sm font-semibold text-text-main">
            {user.facebook_pages.length} Fanpage(s)
          </span>
        </div>
      </div>

    </div>
  );
}
