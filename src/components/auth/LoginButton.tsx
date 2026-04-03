"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "authenticated" && session.user) {
    return (
      <button
        type="button"
        onClick={() => signOut()}
        className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-sm font-light text-gray-700 transition-colors hover:border-gray-300 hover:text-black"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "Usuário"}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
            {session.user.name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        )}
        <span className="max-w-32 truncate">{session.user.name}</span>
        <span className="font-medium text-black">Sair</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google")}
      className="rounded-lg bg-black px-4 py-2 text-sm font-light text-white transition-colors hover:bg-gray-800"
    >
      Entrar com Google
    </button>
  );
}
