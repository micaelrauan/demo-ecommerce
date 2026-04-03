"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function SuccessContent({
  sessionId,
}: {
  sessionId: string | null;
}) {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-white pt-32 px-4">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
          Pagamento concluído
        </p>
        <h1 className="text-4xl font-light tracking-tight text-black md:text-5xl">
          Pedido realizado com sucesso!
        </h1>
        <p className="mt-4 max-w-xl text-base font-light text-gray-600">
          Seu pagamento foi confirmado e o carrinho foi limpo automaticamente.
        </p>
        {sessionId && (
          <p className="mt-4 break-all text-xs text-gray-400">
            Sessão Stripe: {sessionId}
          </p>
        )}
        <Link
          href="/produtos"
          className="mt-10 inline-flex bg-black px-8 py-3 text-sm font-light text-white transition-colors hover:bg-gray-800"
        >
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
