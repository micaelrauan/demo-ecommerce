"use client";

import dynamic from "next/dynamic";
import { UserButton, useAuth } from "@clerk/nextjs";

const SignInButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.SignInButton })),
  { ssr: false },
);

const SignUpButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.SignUpButton })),
  { ssr: false },
);

interface UserMenuProps {
  compact?: boolean;
}

export default function UserMenu({ compact = false }: UserMenuProps) {
  const { isSignedIn } = useAuth();
  const buttonClasses = compact
    ? "min-h-11 px-4 text-sm"
    : "min-h-11 px-5 text-sm";

  return (
    <div className="flex items-center gap-3">
      {!isSignedIn && (
        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <button
              type="button"
              className={`inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-black transition-colors ${buttonClasses}`}
            >
              Entrar
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              type="button"
              className={`inline-flex items-center justify-center rounded-lg bg-black text-white font-light hover:bg-gray-800 transition-colors ${buttonClasses}`}
            >
              Registrar
            </button>
          </SignUpButton>
        </div>
      )}

      {isSignedIn && (
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Minha Conta"
              labelIcon={<span>MC</span>}
              href="/minha-conta"
            />
            <UserButton.Link
              label="Meus Pedidos"
              labelIcon={<span>MP</span>}
              href="/meus-pedidos"
            />
            <UserButton.Link
              label="Favoritos"
              labelIcon={<span>FV</span>}
              href="/favoritos"
            />
          </UserButton.MenuItems>
        </UserButton>
      )}
    </div>
  );
}
