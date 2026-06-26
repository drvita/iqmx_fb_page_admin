import { cookies } from "next/headers";

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: any;
}

/**
 * Basic Axios-like custom fetch wrapper for server-to-server calls to FastAPI backend.
 * Automatically appends the base API URL, retrieves and adds bearer token from session cookies if present,
 * and handles standard response types (like 204 No Content).
 */
export async function apiClient<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<T | null> {
  const apiUrl = process.env.API_URL || "http://localhost:8000";
  
  // Normalize path to ensure it starts with / and has the /api prefix
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${apiUrl}/api${cleanPath}`;

  const { body, headers = {}, ...rest } = options;

  // Retrieve JWT session token automatically from cookies if it exists
  let token: string | undefined;
  try {
    const cookieStore = await cookies();
    token = cookieStore.get("session_token")?.value;
  } catch (error) {
    // Fail-safe for builds or contexts where next/headers cookies is unavailable
    console.debug("[API CLIENT] Cookies could not be accessed, proceeding without token:", error);
  }

  const mergedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...((headers as Record<string, string>) || {}),
  };

  // Deduced session check: if token is present, automatically append Authorization header
  if (token) {
    mergedHeaders["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    ...rest,
    headers: mergedHeaders,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(fullUrl, fetchOptions);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  // Handle 204 No Content explicitly
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return null;
}

export default apiClient;
