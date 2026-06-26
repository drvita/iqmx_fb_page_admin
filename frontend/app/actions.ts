"use server";

import { cookies } from "next/headers";
import { apiClient } from "@/lib/api";

export interface FacebookAuthData {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
}

/**
 * Server Action that processes Facebook Login by sending the
 * access token to the backend FastAPI server and saving the session cookie.
 */
export async function loginWithFacebookAction(authData: FacebookAuthData) {
  console.log("[SERVER ACTION] Sending Facebook credentials using apiClient...");
  
  try {
    // Call the backend API using our custom client helper
    const data = await apiClient("/auth/facebook-login", {
      method: "POST",
      body: authData,
    });

    // Store locally generated JWT inside an HTTP-only secure cookie
    if (data && data.token) {
      const cookieStore = await cookies();
      const expireDays = parseInt(process.env.JWT_EXPIRE_DAYS || "7", 10);
      cookieStore.set("session_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * expireDays,
        path: "/",
        sameSite: "lax",
      });
      console.log(`[SERVER ACTION] Session cookie 'session_token' successfully stored for ${expireDays} days.`);
    }
    
    return { 
      success: true, 
      data 
    };
  } catch (error: any) {
    console.error("[SERVER ACTION] Error connecting to FastAPI backend:", error.message);
    return { 
      success: false, 
      error: error.message || "Unknown error in Next.js Server Action" 
    };
  }
}

/**
 * Server Action that deletes the session cookie and signs out the user.
 */
export async function logoutAction() {
  console.log("[SERVER ACTION] Terminating session and deleting session cookie.");
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  return { success: true };
}

/**
 * Server Action that triggers a manual sync of a page from the backend.
 */
export async function syncPageDataAction(pageId: number) {
  const { revalidatePath } = await import("next/cache");
  console.log(`[SERVER ACTION] Triggering manual sync for page ID ${pageId}...`);
  try {
    const response = await apiClient(`/pages/${pageId}/sync`, {
      method: "POST",
    });
    
    // Automatically revalidate the dynamic path to trigger a fresh Server Component render
    revalidatePath(`/dashboard/${pageId}/fanpage`);
    
    return { success: true, data: response };
  } catch (error: any) {
    console.error(`[SERVER ACTION] Error syncing page ID ${pageId}:`, error.message);
    return { success: false, error: error.message || "Error al sincronizar datos." };
  }
}
