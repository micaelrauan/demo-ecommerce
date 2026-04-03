"use client";

import Link from "next/link";

export default function PedidoCanceladoPage() {
  return (
    <div className="min-h-screen bg-white pt-32 px-4">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">
          Checkout cancelado
        </p>
        <h1 className="text-4xl font-light tracking-tight text-black md:text-5xl">
          Pagamento cancelado. Seu carrinho foi mantido.
        </h1>
        <p className="mt-4 max-w-xl text-base font-light text-gray-600">
          Você pode voltar ao carrinho e concluir a compra quando quiser.
        </p>
        <Link
          href="/carrinho"
          className="mt-10 inline-flex bg-black px-8 py-3 text-sm font-light text-white transition-colors hover:bg-gray-800"
        >
          Voltar ao carrinho
        </Link>
      </div>
    </div>
  );
}
