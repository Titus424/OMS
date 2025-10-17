export function injectClientEnv() {
  if (typeof window === "undefined") return;
  (window as unknown as { __ENV__?: { API_BASE_URL?: string } }).__ENV__ = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  };
}
