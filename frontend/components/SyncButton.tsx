"use client";

import React, { useState, useTransition } from "react";
import { syncPageDataAction } from "@/app/actions";

interface SyncButtonProps {
  pageId: number;
}

export default function SyncButton({ pageId }: SyncButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSync = () => {
    setError(null);
    startTransition(async () => {
      const result = await syncPageDataAction(pageId);
      if (!result.success) {
        setError(result.error || "Ocurrió un error");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSync}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-custom bg-card-custom hover:border-accent/40 active:scale-[0.98] transition-all text-[10px] font-bold uppercase tracking-wider text-text-main cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className={`w-3.5 h-3.5 ${isPending ? "animate-spin text-accent" : "text-text-sub"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <span>{isPending ? "Sincronizando..." : "Sincronizar"}</span>
      </button>
      {error && (
        <span className="text-[8px] font-medium text-red-400 bg-red-500/10 border border-red-500/15 px-1.5 py-0.5 rounded-md leading-none max-w-[200px] text-right">
          {error}
        </span>
      )}
    </div>
  );
}
