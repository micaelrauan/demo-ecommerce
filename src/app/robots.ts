import type { MetadataRoute } from "next";

const CANONICAL_BASE = "https://condesemijoias.com.br";

function resolveBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return CANONICAL_BASE;

  return raw.replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const base = resolveBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/sign-in",
          "/sign-up",
          "/meus-pedidos",
          "/pedido/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/sign-in", "/sign-up", "/meus-pedidos", "/pedido/"],
      },
    ],
    host: base,
    sitemap: `${base}/sitemap.xml`,
  };
}
