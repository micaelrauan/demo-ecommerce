"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import type { CartItem } from "@/context/CartContext";

interface CheckoutButtonProps {
  items: CartItem[];
  className: string;
}

export default function CheckoutButton({
  items,
  className,
}: CheckoutButtonProps) {
  const { status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    if (items.length === 0 || isSubmitting) {
      return;
    }

    if (status !== "authenticated") {
      await signIn("google");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Falha ao iniciar checkout");
      }

      const data = (await response.json()) as { url?: string };
      if (!data.url) {
        throw new Error("Checkout sem URL de destino");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Erro ao iniciar checkout:", error);
      alert("Não foi possível iniciar o checkout. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const label =
    items.length === 0
      ? "Carrinho vazio"
      : isSubmitting
        ? "Redirecionando..."
        : status === "authenticated"
          ? "Finalizar Compra"
          : status === "loading"
            ? "Carregando..."
            : "Faça login para continuar";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={items.length === 0 || isSubmitting || status === "loading"}
      className={className}
    >
      {label}
    </button>
  );
}
