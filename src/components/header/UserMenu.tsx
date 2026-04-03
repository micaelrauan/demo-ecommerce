"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

interface UserMenuProps {
  compact?: boolean;
}

export default function UserMenu({ compact = false }: UserMenuProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status !== "authenticated") {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-light text-gray-600 hover:text-black transition-colors"
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-light hover:bg-gray-800 transition-colors"
        >
          Registrar
        </Link>
      </div>
    );
  }

  const userName = session.user?.name || "Cliente";
  const userEmail = session.user?.email || "";
  const initial = userName.charAt(0).toUpperCase();
  const iconSize = compact ? "w-5 h-5" : "w-6 h-6";

  return (
    <div className="relative user-menu-container" ref={containerRef}>
      <button
        onClick={() => setIsOpen((current) => !current)}
        className="text-gray-600 hover:text-black transition-colors"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-medium">
            {initial}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-medium">
                {initial}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-light text-gray-900 truncate">{userName}</p>
              <p className="text-xs font-light text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>

          <Link
            href="/minha-conta"
            className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Minha Conta
          </Link>
          <Link
            href="/meus-pedidos"
            className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Meus Pedidos
          </Link>
          <Link
            href="/favoritos"
            className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Favoritos
          </Link>
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-4 py-2.5 text-sm font-light text-red-600 hover:bg-red-50 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}