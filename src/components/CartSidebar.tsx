"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    total,
    itemCount,
    updateQuantity,
    removeItem,
    isLoading,
  } = useCart();
  const router = useRouter();

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <>
      {/* Overlay com animação de fade */}
      <div
        className={`fixed inset-0 bg-black z-60 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Sidebar com animação de slide */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-70 flex flex-col transform transition-all duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header com animação */}
        <div
          className={`flex items-center justify-between p-6 border-b border-gray-200 transition-all duration-300 ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
          style={{ transitionDelay: isOpen ? "200ms" : "0ms" }}
        >
          <div>
            <h2 className="text-xl font-light tracking-wider text-black">
              MEU CARRINHO
            </h2>
            <p className="text-sm text-gray-500 font-light mt-1">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-black transition-all duration-200 p-2 hover:rotate-90 hover:scale-110"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
              <svg
                className="w-24 h-24 text-gray-300 mb-4 animate-bounce"
                style={{ animationDuration: "2s" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="text-lg font-light text-gray-900 mb-2">
                Seu carrinho está vazio
              </h3>
              <p className="text-sm text-gray-500 font-light mb-6">
                Adicione produtos para continuar
              </p>
              <button
                onClick={closeCart}
                className="bg-black text-white px-6 py-3 rounded-lg font-light hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-500 hover:shadow-md hover:bg-gray-100 ${
                    isOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8"
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${300 + index * 100}ms` : "0ms",
                  }}
                >
                  {/* Imagem do Produto */}
                  <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0">
                    {item.product?.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Detalhes */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-light text-gray-900 mb-1 truncate">
                      {item.product?.name}
                    </h4>
                    <p className="text-sm font-light text-black mb-2">
                      {formatCurrency(item.product?.price || 0)}
                    </p>

                    {/* Controles de Quantidade */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        -
                      </button>
                      <span className="text-sm font-light w-8 text-center transition-all duration-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com animação */}
        {items.length > 0 && (
          <div
            className={`border-t border-gray-200 p-6 space-y-4 transition-all duration-500 ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: isOpen ? "400ms" : "0ms" }}
          >
            {/* Subtotal */}
            <div className="flex justify-between items-center text-lg">
              <span className="font-light text-gray-700">Subtotal</span>
              <span className="font-light text-black">
                {formatCurrency(total)}
              </span>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-lg font-light hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Finalizar Compra
              </button>
              <button
                onClick={closeCart}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-light hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Continuar Comprando
              </button>
            </div>

            {/* Frete info */}
            <p className="text-xs text-gray-500 font-light text-center">
              Frete e impostos calculados no checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
