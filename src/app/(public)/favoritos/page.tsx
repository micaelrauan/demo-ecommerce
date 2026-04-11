"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function FavoritosPage() {
  const { favorites, favoritesCount, removeFavorite, isLoading } = useFavorites();
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-4 py-10">
        <div className="mx-auto max-w-7xl text-center py-20">
          <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-light">Carregando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link
            href="/"
            className="text-gray-500 hover:text-black transition-colors font-light"
          >
            Início
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-black font-light">Favoritos</span>
        </nav>

        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-4xl font-light tracking-tight text-black mb-2">
            Meus Favoritos
          </h1>
          <p className="text-gray-600 font-light">
            {favoritesCount} {favoritesCount === 1 ? "item salvo" : "itens salvos"}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 border border-gray-200">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-black mb-2">
              Você ainda não tem favoritos
            </h2>
            <p className="text-gray-600 font-light mb-8">
              Explore os produtos e salve suas peças preferidas.
            </p>
            <Link
              href="/produtos"
              className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <Link href={`/produtos/${product.id}`} className="block">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg
                          className="w-16 h-16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/produtos/${product.id}`}>
                    <h3 className="text-sm sm:text-base font-medium text-black mb-2 line-clamp-2 min-h-10">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mb-4">
                    {product.compare_at_price &&
                    product.compare_at_price > product.price ? (
                      <>
                        <p className="text-xs text-gray-500 line-through">
                          {formatCurrency(product.compare_at_price)}
                        </p>
                        <p className="text-lg font-bold text-black">
                          {formatCurrency(product.price)}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-black">
                        {formatCurrency(product.price)}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto space-y-2">
                    <button
                      type="button"
                      onClick={() =>
                        addItem(
                          {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image_url: product.image_url,
                            slug: product.slug,
                          },
                          product.variant_id ?? Number(product.id),
                        )
                      }
                      disabled={product.stock === 0}
                      className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-light hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {product.stock === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFavorite(product.id)}
                      className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-light hover:bg-gray-50 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
