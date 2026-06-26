import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import SyncButton from "@/components/SyncButton";

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

interface PostInfo {
  id: string;
  message: string | null;
  created_time: string;
  is_published: boolean;
  full_picture: string | null;
  reactions_count: number;
  comments_count: number;
  shares_count: number;
}

interface FanpageInsights {
  followers: number;
  followers_change: number;
  reach: number;
  reach_change: number;
  engagement: number;
  engagement_change: number;
  new_posts_count: number;
  new_posts_change: number;
  posts: PostInfo[];
}

// Format date helper to MX Spanish locale
function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

// Format numbers elegantly (e.g. 8430 -> 8.4K)
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(".0", "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(".0", "") + "K";
  }
  return num.toLocaleString("es-MX");
}

// Render trend badge (only if change is non-zero)
const renderTrendBadge = (change: number) => {
  if (change === 0) return null;
  const isPositive = change >= 0;
  return (
    <span
      className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md leading-none border ${
        isPositive
          ? "text-green-400 bg-green-500/10 border-green-500/15"
          : "text-red-400 bg-red-500/10 border-red-500/15"
      }`}
    >
      {isPositive ? `+${change}%` : `${change}%`}
    </span>
  );
};

/**
 * FanPage - Detailed dynamic route page for a selected Facebook Page.
 * Displays clean mobile-optimized key metric cards and recent posts.
 */
export default async function FanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    redirect("/");
  }

  const { id } = await params;

  let user: UserProfile | null = null;
  let shouldRedirect = false;
  try {
    user = await apiClient<UserProfile>("/auth/me", {
      cache: "no-store",
    });
  } catch (error) {
    console.error("[FANPAGE PAGE] Error fetching user profile:", error);
    shouldRedirect = true;
  }

  if (shouldRedirect || !user) {
    redirect("/");
  }

  // Find the selected page in the user's verified page list to prevent unauthorized access
  const page = user.facebook_pages.find((p) => p.id === parseInt(id, 10));
  if (!page) {
    console.warn(
      `[FANPAGE PAGE] Page ID ${id} not linked to user ${user.id}. Redirecting.`,
    );
    redirect("/dashboard");
  }

  // Fetch page insights from the API
  let insights: FanpageInsights | null = null;
  let hasAccessError = false;
  
  try {
    insights = await apiClient<FanpageInsights>(`/pages/${id}/insights`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("[FANPAGE PAGE] Error fetching page insights:", error);
    hasAccessError = true;
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
        <span>Volver a páginas</span>
      </Link>

      {/* Selected Fanpage Title */}
      <div className="mb-6 border-b border-border-custom pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-extrabold text-text-main line-clamp-1 leading-snug">
            {page.name}
          </h1>
          <span className="text-[9px] text-text-sub font-mono tracking-wider block mt-1">
            ID de Página: {page.fb_page_id}
          </span>
        </div>
        {!hasAccessError && insights && (
          <SyncButton pageId={page.id} />
        )}
      </div>

      {hasAccessError || !insights ? (
        /* Unauthorized / No access error card */
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
      ) : (
        /* Dashboard insights views */
        <>
          {/* Minimalistic Metrics Grid (Mobile-First 2x2 Layout) */}
          <h2 className="text-[10px] font-bold text-text-sub uppercase tracking-widest mb-3">
            Métricas clave (Últimos 30 días)
          </h2>

          <div className="dash-metric-grid">
            {/* Metric 1: Followers */}
            <div className="dash-metric-card">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-bold text-text-sub uppercase tracking-wider">
                  Seguidores
                </span>
                {renderTrendBadge(insights.followers_change)}
              </div>
              <span className="text-xl font-black text-text-main mt-2 block leading-none">
                {formatNumber(insights.followers)}
              </span>
            </div>

            {/* Metric 2: Reach */}
            <div className="dash-metric-card">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-bold text-text-sub uppercase tracking-wider">
                  Alcance
                </span>
                {renderTrendBadge(insights.reach_change)}
              </div>
              <span className="text-xl font-black text-text-main mt-2 block leading-none">
                {formatNumber(insights.reach)}
              </span>
            </div>

            {/* Metric 3: Engagement */}
            <div className="dash-metric-card">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-bold text-text-sub uppercase tracking-wider">
                  Interacciones
                </span>
                {renderTrendBadge(insights.engagement_change)}
              </div>
              <span className="text-xl font-black text-text-main mt-2 block leading-none">
                {formatNumber(insights.engagement)}
              </span>
            </div>

            {/* Metric 4: New Posts */}
            <div className="dash-metric-card">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-bold text-text-sub uppercase tracking-wider">
                  Nuevos Posts
                </span>
                {insights.new_posts_change > 0 && (
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md leading-none border text-accent bg-accent/10 border-accent/15">
                    +{insights.new_posts_change}
                  </span>
                )}
              </div>
              <span className="text-xl font-black text-text-main mt-2 block leading-none">
                {insights.new_posts_count}
              </span>
            </div>
          </div>

          {/* Recent Posts Grid (1 col on mobile, up to 3-4 cols on desktop) */}
          <div className="mt-8">
            <h3 className="text-[10px] font-bold text-text-sub uppercase tracking-widest mb-4">
              Publicaciones Recientes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {insights.posts && insights.posts.length > 0 ? (
                insights.posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl border border-border-custom bg-card-custom/80 flex flex-col h-full justify-between hover:border-accent/30 transition-all duration-200"
                  >
                    <div>
                      {post.full_picture && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/10 border border-border-custom mb-3">
                          <img
                            src={post.full_picture}
                            alt="Publicación"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-1 mb-4">
                        <span className="text-[9px] font-mono text-text-sub">
                          {formatDate(post.created_time)}
                        </span>
                        
                        {post.message ? (
                          <p className="text-xs text-text-main leading-relaxed font-light whitespace-pre-line mt-1 line-clamp-4">
                            {post.message}
                          </p>
                        ) : (
                          <p className="text-xs text-text-sub italic font-light mt-1">
                            Sin mensaje o descripción.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 items-center border-t border-border-custom/50 pt-3 text-[10px] text-text-sub font-medium">
                      {/* Reactions */}
                      <div className="flex items-center gap-1" title="Reacciones">
                        <svg
                          className="w-3.5 h-3.5 opacity-70 fill-none stroke-current"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                        <span>{formatNumber(post.reactions_count)}</span>
                      </div>

                      {/* Comments */}
                      <div className="flex items-center gap-1" title="Comentarios">
                        <svg
                          className="w-3.5 h-3.5 opacity-70 fill-none stroke-current"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>{formatNumber(post.comments_count)}</span>
                      </div>

                      {/* Shares */}
                      <div className="flex items-center gap-1" title="Veces compartido">
                        <svg
                          className="w-3.5 h-3.5 opacity-70 fill-none stroke-current"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        <span>{formatNumber(post.shares_count)}</span>
                      </div>
                      
                      {/* Status */}
                      <span
                        className={`ml-auto px-1.5 py-0.5 rounded-full text-[8px] font-semibold border ${
                          post.is_published
                            ? "bg-green-500/10 text-green-400 border-green-500/15"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/15"
                        }`}
                      >
                        {post.is_published ? "P" : "B"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-xs text-text-sub border border-dashed border-border-custom rounded-xl bg-card-custom/20">
                  No se encontraron publicaciones recientes.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
