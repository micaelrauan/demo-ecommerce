import type { MetadataRoute } from "next";

const CANONICAL_BASE = "https://condesemijoias.com.br";

function resolveBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return CANONICAL_BASE;

  const normalized = raw.replace(/\/$/, "");
  if (normalized.includes("conde-semijoias.vercel.app")) {
    return CANONICAL_BASE;
  }

  return normalized;
}

export default function robots(): MetadataRoute.Robots {
  const base = resolveBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/sign-in",
        "/sign-up",
        "/minha-conta",
        "/meus-pedidos",
        "/pedido/",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
