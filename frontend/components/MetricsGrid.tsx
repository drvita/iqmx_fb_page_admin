import React from "react";

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

interface MetricsGridProps {
  followers: number;
  followersChange: number;
  reach: number;
  reachChange: number;
  engagement: number;
  engagementChange: number;
  newPostsCount: number;
  newPostsChange: number;
}

export default function MetricsGrid({
  followers,
  followersChange,
  reach,
  reachChange,
  engagement,
  engagementChange,
  newPostsCount,
  newPostsChange,
}: MetricsGridProps) {
  return (
    <>
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
            {renderTrendBadge(followersChange)}
          </div>
          <span className="text-xl font-black text-text-main mt-2 block leading-none">
            {formatNumber(followers)}
          </span>
        </div>

        {/* Metric 2: Reach */}
        <div className="dash-metric-card">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold text-text-sub uppercase tracking-wider">
              Alcance
            </span>
            {renderTrendBadge(reachChange)}
          </div>
          <span className="text-xl font-black text-text-main mt-2 block leading-none">
            {formatNumber(reach)}
          </span>
        </div>

        {/* Metric 3: Engagement */}
        <div className="dash-metric-card">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold text-text-sub uppercase tracking-wider">
              Interacciones
            </span>
            {renderTrendBadge(engagementChange)}
          </div>
          <span className="text-xl font-black text-text-main mt-2 block leading-none">
            {formatNumber(engagement)}
          </span>
        </div>

        {/* Metric 4: New Posts */}
        <div className="dash-metric-card">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold text-text-sub uppercase tracking-wider">
              Nuevos Posts
            </span>
            {newPostsChange > 0 && (
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md leading-none border text-accent bg-accent/10 border-accent/15">
                +{newPostsChange}
              </span>
            )}
          </div>
          <span className="text-xl font-black text-text-main mt-2 block leading-none">
            {newPostsCount}
          </span>
        </div>
      </div>
    </>
  );
}
