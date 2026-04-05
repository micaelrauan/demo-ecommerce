"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

export default function HomePageLowerContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const featuredData = await getProducts({ per_page: 8 });
        setProducts(featuredData.slice(0, 8));
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cadastro realizado! Você ganhou 15% OFF na primeira compra!");
    setEmail("");
  };

  return (
    <>
      {/* Products Grid */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[2rem] font-light mb-2 tracking-tight">
              Produtos em Destaque
            </h2>
            <p className="text-[#666] text-[0.95rem] font-light mb-10">
              Selecionamos o melhor para você
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-white transition-all duration-300 flex flex-col"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link href={`/produtos/${product.id}`} className="block">
                    <div className="relative aspect-3/4 bg-gray-100 overflow-hidden mb-4">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-5xl">📦</span>
                        </div>
                      )}

                      {product.compare_at_price &&
                        product.compare_at_price > product.price && (
                          <span className="absolute left-2 top-2 inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                            Oferta
                          </span>
                        )}
                    </div>
                    <h3
                      className="text-[0.9rem] font-light mb-3 text-black group-hover:text-gray-600 transition-colors"
                      style={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.name}
                    </h3>
                    <div className="h-px bg-gray-200 mb-3"></div>
                    <div className="mb-3 min-h-13">
                      {product.compare_at_price &&
                      product.compare_at_price > product.price ? (
                        <>
                          <p className="text-sm text-gray-500 line-through">
                            R$ {product.compare_at_price.toFixed(2)}
                          </p>
                          <p className="text-xl font-semibold text-[#6B0000]">
                            R$ {product.price.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500 line-through opacity-0">
                            R$ 0.00
                          </p>
                          <p className="text-xl font-semibold text-[#6B0000]">
                            R$ {product.price.toFixed(2)}
                          </p>
                        </>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() =>
                      addItem(product, product.variant_id ?? Number(product.id))
                    }
                    className="w-full py-3 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors group-hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/produtos"
              prefetch
              className="inline-flex items-center justify-center min-w-70 bg-black text-white px-10 py-4 text-sm font-medium tracking-widest uppercase hover:bg-gray-800 transition-all"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-4 sm:px-8 bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 text-center">
          <div className="benefit-item md:px-10">
            <div className="mb-4 flex justify-center">
              <svg
                className="w-8 h-8 text-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="7" width="12" height="8" rx="1" />
                <path d="M14 10h4l3 2v3h-7z" />
                <circle cx="7" cy="17" r="1.5" />
                <circle cx="17" cy="17" r="1.5" />
              </svg>
            </div>
            <h3 className="text-[0.8rem] font-medium mb-2 tracking-[0.12em] uppercase">
              FRETE GRÁTIS
            </h3>
            <p className="text-[0.85rem] text-[#777] font-light">
              Para compras acima de R$ 799
            </p>
          </div>
          <div className="benefit-item md:px-10 md:border-l md:border-gray-200">
            <div className="mb-4 flex justify-center">
              <svg
                className="w-8 h-8 text-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
                <path d="M6 15h4" />
              </svg>
            </div>
            <h3 className="text-[0.8rem] font-medium mb-2 tracking-[0.12em] uppercase">
              5% OFF NO PIX
            </h3>
            <p className="text-[0.85rem] text-[#777] font-light">
              Ganhe desconto pagando com PIX
            </p>
          </div>
          <div className="benefit-item md:px-10 md:border-l md:border-gray-200">
            <div className="mb-4 flex justify-center">
              <svg
                className="w-8 h-8 text-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M7 7h10l-2.5-2.5" />
                <path d="M17 17H7l2.5 2.5" />
                <path d="M17 7a5 5 0 014.5 4" />
                <path d="M7 17a5 5 0 01-4.5-4" />
              </svg>
            </div>
            <h3 className="text-[0.8rem] font-medium mb-2 tracking-[0.12em] uppercase">
              TROCA GRÁTIS
            </h3>
            <p className="text-[0.85rem] text-[#777] font-light">
              Primeira troca por nossa conta
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-8 bg-[#0f0f0f] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">
            Cadastre-se e Ganhe
          </h2>
          <p className="text-3xl md:text-4xl font-light mb-8 text-[#c9a96e]">
            15% OFF na Primeira Compra
          </p>
          <form
            onSubmit={handleNewsletter}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              required
              className="flex-1 px-6 py-4 border border-[#c9a96e]/50 bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-[#c9a96e] transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 border border-[#c9a96e] text-white text-sm font-medium tracking-widest uppercase hover:bg-[#c9a96e] hover:text-black transition-colors whitespace-nowrap"
            >
              Cadastrar
            </button>
          </form>
          <p className="text-xs text-white/60 mt-4 font-light">
            *Desconto não cumulativo com outras promoções
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-[2.5rem] font-light mb-8 tracking-tight">
            Apaixone-se por Você Mesma
          </h2>
          <div className="mx-auto max-w-160 space-y-6 text-gray-700 font-light leading-[1.9]">
            <p className="text-lg leading-[1.9]">
              Uma marca de semijoias que valoriza a elegância e o estilo em cada
              detalhe, trazendo tendências atuais de forma moderna e com
              identidade brasileira.
            </p>
            <p className="text-lg leading-[1.9]">
              Apostamos em peças e acessórios que refletem a personalidade de
              pessoas autênticas e confiantes, com um toque da essência vibrante
              do Brasil.
            </p>
            <p className="text-lg leading-[1.9]">
              Semijoias ideais para momentos casuais, formais ou ocasiões
              especiais. Você é sempre o protagonista.
            </p>
          </div>
          <div className="mt-12">
            <Link
              href="/sobre"
              className="inline-block border-2 border-black px-12 py-4 text-sm font-medium tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
            >
              Conheça Nossa História
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
