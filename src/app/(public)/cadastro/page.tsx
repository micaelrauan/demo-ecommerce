"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function CadastroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
          detail?: string;
        };
        setError(data.error || data.detail || "Erro ao criar conta. Tente novamente.");
        return;
      }

      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
      <div className="max-w-105 w-full border border-gray-200 rounded-2xl p-8 bg-white shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-wider text-black mb-2">
            CRIAR CONTA
          </h1>
          <p className="text-gray-600 font-light">
            Preencha os dados para criar sua conta
          </p>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full bg-[#4285F4] text-white py-3 rounded-lg font-light transition-colors hover:brightness-95 flex items-center justify-center gap-3"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Registrar com Google
        </button>
        <p className="text-xs text-gray-500 text-center mt-2 font-light">
          Sua conta será criada automaticamente
        </p>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-sm text-gray-500 font-light">ou</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-light">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-light text-gray-700 mb-2"
            >
              Nome completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900 font-light transition-all"
              placeholder="Seu nome completo"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-light text-gray-700 mb-2"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900 font-light transition-all"
              placeholder="Seu email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-light text-gray-700 mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900 font-light transition-all"
              placeholder="Crie uma senha"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-light text-gray-700 mb-2"
            >
              Confirmar senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900 font-light transition-all"
              placeholder="Repita a senha"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg font-light hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 font-light">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="text-black hover:underline font-normal"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
