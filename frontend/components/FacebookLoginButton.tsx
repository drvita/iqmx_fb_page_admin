"use client";

import React, { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { loginWithFacebookAction } from "@/app/actions";

declare global {
  interface Window {
    FB: any;
  }
}

interface FacebookLoginButtonProps {
  isLoggedIn?: boolean;
  text?: string;
  loggedInText?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export default function FacebookLoginButton({
  isLoggedIn = false,
  text = "Iniciar sesión con Facebook",
  loggedInText = "Ir al Dashboard",
  size = "md",
  disabled = false,
}: FacebookLoginButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const initRef = useRef(false);

  // Initialize the Facebook SDK
  const initFacebookSDK = () => {
    if (initRef.current) return;

    if (typeof window !== "undefined" && window.FB) {
      initRef.current = true;
      const appId = process.env.NEXT_PUBLIC_FB_APP_ID;
      const version = process.env.NEXT_PUBLIC_FB_API_VERSION || "v25.0";

      console.log("Initializing Facebook SDK...");
      const cleanAppId = appId === "{your-app-id}" ? "" : appId;

      window.FB.init({
        appId: cleanAppId,
        cookie: true,
        xfbml: true,
        version: version,
      });

      window.FB.AppEvents.logPageView();
      setSdkLoaded(true);
      console.log("Facebook SDK initialized successfully.");
    }
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.FB) {
      initFacebookSDK();
    }
  }, []);

  const handleFacebookLogin = () => {
    if (typeof window !== "undefined" && window.FB) {
      setLoading(true);
      console.log("Triggering Facebook SDK login popup...");
      window.FB.login(
        (response: any) => {
          if (response.authResponse) {
            handleSession(response.authResponse);
          } else {
            console.log("User cancelled login or did not fully authorize.");
            setLoading(false);
          }
        },
        {
          scope:
            "email,read_insights,pages_show_list,business_management,pages_read_engagement,pages_read_user_content",
        },
      );
    }
  };

  const handleSession = async (authResponse: any) => {
    console.log("[FRONTEND] Sending Facebook authentication token...");
    try {
      const result = await loginWithFacebookAction({
        accessToken: authResponse.accessToken,
        expiresIn: parseInt(authResponse.expiresIn, 10) || 0,
        signedRequest: authResponse.signedRequest || "",
        userID: authResponse.userID,
      });

      if (result.success) {
        console.log(
          "[FRONTEND] Session authorized. Redirecting to dashboard...",
        );
        router.push("/dashboard");
      } else {
        console.error("[FRONTEND] Session authorization failed:", result.error);
        alert("Authentication failed: " + result.error);
        setLoading(false);
      }
    } catch (err) {
      console.error("[FRONTEND] Exception in handleSession:", err);
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  // Define sizing Tailwind classes
  const sizeClasses = {
    sm: {
      btn: "px-5 py-2.5 text-xs rounded-lg gap-2",
      icon: "h-4 w-4",
    },
    md: {
      btn: "px-7 py-3.5 text-sm rounded-xl gap-2.5",
      icon: "h-5 w-5",
    },
    lg: {
      btn: "px-8 py-4 text-base rounded-xl gap-3.5",
      icon: "h-6 w-6",
    },
  };

  const activeSize = sizeClasses[size];

  // Prevent hydration discrepancies (SSR fallback is standard empty placeholder)
  if (!mounted) {
    return (
      <div
        className={`bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center animate-pulse ${activeSize.btn}`}
      >
        Cargando...
      </div>
    );
  }

  // A. IF ALREADY LOGGED IN: Render simple CTA dashboard redirect button
  if (isLoggedIn) {
    return (
      <button
        onClick={handleGoToDashboard}
        className={`group relative flex items-center justify-center font-bold text-white shadow-xl bg-cta hover:bg-cta/90 transition-all duration-300 active:scale-[0.98] transform hover:-translate-y-0.5 text-center cursor-pointer shadow-cta/25 hover:shadow-cta/35 ${activeSize.btn}`}
      >
        {loggedInText}
        <svg
          className={`fill-none stroke-white transition-transform duration-300 group-hover:translate-x-1 ${activeSize.icon}`}
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    );
  }

  // B. IF NOT LOGGED IN: Render Premium Facebook Login button
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Facebook JSSDK loader */}
      <Script
        id="facebook-jssdk"
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="afterInteractive"
        onReady={initFacebookSDK}
        onError={(e) => {
          console.error("Facebook SDK load error:", e);
          setSdkError(true);
        }}
      />

      <button
        onClick={handleFacebookLogin}
        disabled={loading || disabled}
        className={`group relative flex items-center justify-center font-bold text-white shadow-xl bg-gradient-to-r from-[#1877f2] to-[#166fe5] hover:scale-[1.01] transition-all duration-300 hover:shadow-blue-500/25 active:scale-[0.98] border border-blue-400/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${activeSize.btn}`}
      >
        <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {loading ? (
          <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <svg
            className={`fill-white transition-transform duration-300 group-hover:rotate-[3deg] ${activeSize.icon}`}
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )}

        {loading ? "Conectando..." : text}
      </button>

      {sdkError && (
        <span className="text-[10px] text-red-400 font-medium bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md">
          ⚠️ Bloqueador de anuncios activo. Desactívalo para usar el login.
        </span>
      )}
    </div>
  );
}
