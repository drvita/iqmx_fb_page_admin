import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface FacebookPageInfo {
  id: number;
  fb_page_id: string;
  name: string;
}

interface UserProfile {
  id: number;
  name: string;
  facebook_pages: FacebookPageInfo[];
}

/**
 * DashboardPage - Main view listing all connected Facebook Pages.
 * Optimized for mobile-first tactile interaction.
 */
export default async function DashboardPage() {
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
    console.error("[DASHBOARD PAGE] Error fetching user profile:", error);
    shouldRedirect = true;
  }

  if (shouldRedirect || !user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col w-full animate-fade-in">
      
      {/* Mobile-Only Minimal Greeting */}
      <h1 className="text-2xl font-black tracking-tight text-text-main mb-6 md:hidden">
        Hola, {user.name}
      </h1>

      {/* Select Page section */}
      <div className="w-full">
        <h2 className="text-[10px] font-bold text-text-sub uppercase tracking-widest mb-4">
          Selecciona una página
        </h2>

        {user.facebook_pages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-custom bg-card-custom/30 p-8 text-center">
            <p className="text-xs text-text-sub">
              No tienes páginas vinculadas a tu cuenta de Facebook.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {user.facebook_pages.map((page) => (
              <Link
                key={page.id}
                href={`/dashboard/${page.id}/fanpage`}
                className="dash-card-page"
              >
                <div className="flex flex-col pr-4">
                  <span className="text-sm font-bold text-text-main line-clamp-1 leading-snug">
                    {page.name}
                  </span>
                  <span className="text-[9px] text-text-sub font-mono mt-0.5 tracking-wider">
                    ID: {page.fb_page_id}
                  </span>
                </div>
                
                {/* Chevron icon pointing right */}
                <svg
                  className="w-5 h-5 stroke-text-sub fill-none shrink-0"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
