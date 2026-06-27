import React from "react";

export interface AlertInfo {
  id: string;
  type: "warning" | "danger" | "info";
  title: string;
  message: string;
  metric: string;
}

interface PerformanceDiagnosticsProps {
  alerts: AlertInfo[];
}

export default function PerformanceDiagnostics({ alerts }: PerformanceDiagnosticsProps) {
  return (
    <div className="mb-6 flex flex-col gap-3">
      <h2 className="text-[10px] font-bold text-text-sub uppercase tracking-widest">
        Diagnóstico de Rendimiento
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {alerts.map((alert) => {
          let borderColor = "border-blue-500/15";
          let bgColor = "bg-blue-500/5";
          let textColor = "text-blue-200";
          let iconColor = "text-blue-400";
          let iconPath = (
            <path d="M12 16h.01M12 8v4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          );

          if (alert.type === "danger") {
            borderColor = "border-red-500/15";
            bgColor = "bg-red-500/5";
            textColor = "text-red-200";
            iconColor = "text-red-400";
            iconPath = (
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            );
          } else if (alert.type === "warning") {
            borderColor = "border-amber-500/15";
            bgColor = "bg-amber-500/5";
            textColor = "text-amber-200";
            iconColor = "text-amber-400";
            iconPath = (
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            );
          }

          return (
            <div
              key={alert.id}
              className={`flex gap-3 items-start p-3.5 rounded-xl border ${borderColor} ${bgColor} hover:brightness-105 transition-all duration-200`}
            >
              <svg
                className={`w-5 h-5 shrink-0 ${iconColor} fill-none stroke-current`}
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {iconPath}
              </svg>
              <div className="flex flex-col gap-0.5">
                <span className={`text-xs font-bold ${textColor}`}>
                  {alert.title}
                </span>
                <p className="text-[11px] text-text-sub font-light leading-normal">
                  {alert.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
