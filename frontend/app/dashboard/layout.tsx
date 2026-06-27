import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface UserProfile {
  id: number;
  name: string;
  email: string | null;
}

/**
 * DashboardLayout - Common wrapper layout for protected dashboard pages.
 * Validates the session, queries user profile details, and renders
 * a top navigation header for desktop and a fixed bottom navigation bar for mobile.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    console.error("[DASHBOARD LAYOUT] Failed to fetch user session details:", error);
    shouldRedirect = true;
  }

  if (shouldRedirect || !user) {
    redirect("/");
  }

  // Logout Server Action inside the layout
  async function handleLogout() {
    "use server";
    const { logoutAction } = await import("@/app/actions");
    await logoutAction();
    redirect("/");
  }

  return (
    <div className="relative min-h-screen bg-main text-text-main flex flex-col font-sans transition-colors duration-300">
      
      {/* 1. Desktop Header (Hidden on Mobile) */}
      <header className="dash-header">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cta to-accent flex items-center justify-center text-white font-extrabold shadow-sm">
              IQ
            </div>
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-text-main to-text-sub bg-clip-text text-transparent">
              IQISS <span className="text-accent font-extrabold">Insight</span>
            </span>
          </Link>
          
          {/* Desktop Nav Links */}
          <nav className="flex items-center gap-5 ml-4 border-l border-border-custom pl-5">
            <Link
              href="/dashboard"
              className="text-[10px] font-bold uppercase tracking-widest text-text-sub hover:text-text-main transition-colors duration-200"
            >
              Inicio
            </Link>
            <Link
              href="/dashboard/perfil"
              className="text-[10px] font-bold uppercase tracking-widest text-text-sub hover:text-text-main transition-colors duration-200"
            >
              Perfil
            </Link>
          </nav>
        </div>

        {/* Minimalist greeting & logout */}
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-text-main">
            Hola, {user.name}
          </span>
          <form action={handleLogout}>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg border border-border-custom hover:bg-white/5 text-xs font-semibold text-text-sub hover:text-text-main transition-colors duration-200 cursor-pointer"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      {/* 2. Main Page Content wrapper */}
      <main className="flex-1 w-full relative z-10">
        <div className="dash-container">{children}</div>
      </main>

      {/* 3. Mobile Navigation Bottom Bar (Hidden on Desktop) */}
      <nav className="dash-nav-bottom">
        {/* Navigation Link: Home */}
        <Link href="/dashboard" className="dash-nav-item">
          <svg
            className="w-5 h-5 stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Inicio</span>
        </Link>

        {/* Navigation Link: Profile */}
        <Link href="/dashboard/perfil" className="dash-nav-item">
          <svg
            className="w-5 h-5 stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Perfil</span>
        </Link>

        {/* Form Action: Secure Logout */}
        <form action={handleLogout} className="flex">
          <button type="submit" className="dash-nav-item bg-transparent border-0 px-4 cursor-pointer">
            <svg
              className="w-5 h-5 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Salir</span>
          </button>
        </form>
      </nav>
      
    </div>
  );
}
