import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import SyncButton from "@/components/SyncButton";
import AccessErrorCard from "@/components/AccessErrorCard";
import PerformanceDiagnostics, { AlertInfo } from "@/components/PerformanceDiagnostics";
import MetricsGrid from "@/components/MetricsGrid";
import RecentPostsGrid, { PostInfo } from "@/components/RecentPostsGrid";

interface FacebookPageInfo {
  id: number;
  fb_page_id: string;
  name: string;
  category?: string;
}

interface UserProfile {
  id: number;
  name: string;
  facebook_pages: FacebookPageInfo[];
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
  alerts?: AlertInfo[];
}

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
        <div className="flex items-center gap-3">
          <img
            src={`https://graph.facebook.com/${page.fb_page_id}/picture?type=large`}
            alt={page.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-border-custom bg-black/10 shrink-0"
          />
          <div>
            <h1 className="text-xl font-extrabold text-text-main line-clamp-1 leading-none">
              {page.name}
            </h1>
            {page.category ? (
              <span className="text-[9.5px] text-accent font-bold tracking-widest uppercase block mt-1.5">
                {page.category}
              </span>
            ) : (
              <span className="text-[9px] text-text-sub font-mono block mt-1.5 tracking-wider">
                Página de Facebook
              </span>
            )}
          </div>
        </div>
        {!hasAccessError && insights && (
          <SyncButton pageId={page.id} />
        )}
      </div>

      {hasAccessError || !insights ? (
        /* Unauthorized / No access error card */
        <AccessErrorCard />
      ) : (
        /* Dashboard insights views */
        <>
          {/* Diagnóstico de Rendimiento / Alertas */}
          {insights.alerts && insights.alerts.length > 0 && (
            <PerformanceDiagnostics alerts={insights.alerts} />
          )}

          {/* Minimalistic Metrics Grid (Mobile-First 2x2 Layout) */}
          <MetricsGrid
            followers={insights.followers}
            followersChange={insights.followers_change}
            reach={insights.reach}
            reachChange={insights.reach_change}
            engagement={insights.engagement}
            engagementChange={insights.engagement_change}
            newPostsCount={insights.new_posts_count}
            newPostsChange={insights.new_posts_change}
          />

          {/* Recent Posts Grid */}
          <RecentPostsGrid posts={insights.posts} />
        </>
      )}
    </div>
  );
}
