import type { Metadata } from "next";
import ProdutoDetalheClient from "./ProdutoDetalheClient";

type ParamsInput = { id: string } | Promise<{ id: string }>;

async function resolveParams(params: ParamsInput): Promise<{ id: string }> {
  if (typeof (params as Promise<{ id: string }>).then === "function") {
    return params as Promise<{ id: string }>;
  }

  return params as { id: string };
}

export async function generateMetadata({
  params,
}: {
  params: ParamsInput;
}): Promise<Metadata> {
  try {
    const resolved = await resolveParams(params);
    const res = await fetch(
      `https://api.nuvemshop.com.br/2025-03/${process.env.NUVEMSHOP_STORE_ID}/products/${resolved.id}`,
      {
        headers: {
          Authentication: `bearer ${process.env.NUVEMSHOP_TOKEN}`,
          "User-Agent": "CondeJoias (contato@condesemijoias.com.br)",
        },
        next: { revalidate: 120 },
      },
    );

    if (!res.ok) {
      return { title: "Produto - Conde Semijoias" };
    }

    const p = await res.json();
    const name = p.name?.pt ?? p.name ?? "Produto";
    const description = (p.description?.pt ?? "")
      .replace(/<[^>]+>/g, "")
      .slice(0, 160);
    const image = p.images?.[0]?.src ?? "";

    return {
      title: `${name} - Conde Semijoias`,
      description,
      openGraph: {
        title: name,
        description,
        images: image
          ? [{ url: image, width: 800, height: 800, alt: name }]
          : [],
        type: "website",
      },
    };
  } catch {
    return { title: "Produto - Conde Semijoias" };
  }
}

export default function ProdutoDetalhePage() {
  return <ProdutoDetalheClient />;
}
