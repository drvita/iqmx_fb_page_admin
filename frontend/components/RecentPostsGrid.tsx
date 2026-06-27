import React from "react";

export interface PostPerformance {
  label: string;
  status: "excellent" | "moderate" | "poor" | "recent";
}

export interface PostInfo {
  id: string;
  message: string | null;
  created_time: string;
  is_published: boolean;
  full_picture: string | null;
  reactions_count: number;
  comments_count: number;
  shares_count: number;
  performance?: PostPerformance;
}

interface RecentPostsGridProps {
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

// Map backend performance status to Tailwind styling
const getPerformanceStyles = (status?: string) => {
  switch (status) {
    case "excellent":
      return {
        borderClass: "border-green-500/20 hover:border-green-500/40 bg-green-500/5",
        badgeClass: "bg-green-500/10 text-green-400 border-green-500/15",
      };
    case "moderate":
      return {
        borderClass: "border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/15",
      };
    case "poor":
      return {
        borderClass: "border-red-500/20 hover:border-red-500/40 bg-red-500/5",
        badgeClass: "bg-red-500/10 text-red-400 border-red-500/15",
      };
    case "recent":
    default:
      return {
        borderClass: "border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5",
        badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/15",
      };
  }
};

export default function RecentPostsGrid({ posts }: RecentPostsGridProps) {
  return (
    <div className="mt-8">
      <h3 className="text-[10px] font-bold text-text-sub uppercase tracking-widest mb-4">
        Publicaciones Recientes
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => {
            const perf = getPerformanceStyles(post.performance?.status);
            const label = post.performance?.label || "Reciente";

            return (
              <div
                key={post.id}
                className={`p-4 rounded-xl border ${perf.borderClass} flex flex-col h-full justify-between transition-all duration-200`}
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
                  
                  {/* Performance Status Badge */}
                  <span
                    className={`ml-auto px-1.5 py-0.5 rounded-full text-[8px] font-semibold border ${perf.badgeClass}`}
                  >
                    {label}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8 text-xs text-text-sub border border-dashed border-border-custom rounded-xl bg-card-custom/20">
            No se encontraron publicaciones recientes.
          </div>
        )}
      </div>
    </div>
  );
}
