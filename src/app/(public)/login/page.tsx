"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou senha incorretos");
        return;
      }

      router.push("/");
    } catch {
      setError("Email ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="max-w-105 w-full border border-gray-200 rounded-2xl p-8 bg-white shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-wider text-black mb-2">
            ENTRAR
          </h1>
          <p className="text-gray-600 font-light">
            Entre na sua conta para continuar
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
          Entrar com Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-sm text-gray-500 font-light">ou</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-light">
              {error}
            </div>
          )}

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900 font-light transition-all"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg font-light hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-600 font-light">
            Não tem conta?{" "}
            <Link
              href="/cadastro"
              className="text-black hover:underline font-normal"
            >
              Registre-se
            </Link>
          </p>
          <Link
            href="#"
            className="text-sm font-light text-gray-600 hover:text-black transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>
      </div>
    </div>
  );
}
