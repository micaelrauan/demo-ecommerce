"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserMenuMini, setShowUserMenuMini] = useState(false);
  const [currentPromo, setCurrentPromo] = useState(0);
  const { user, logout, isAdmin } = useAuth();
  const { toggleCart, itemCount } = useCart();
  const router = useRouter();

  const promos = [
    "Frete grátis para compras acima de R$ 299",
    "Até 10x sem juros no cartão de crédito",
    "Descontos de até 50% em produtos selecionados",
    "Entrega expressa para sua região",
  ];

  // Rotação automática das promoções
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 8000); // 5 segundos para transição mais suave
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let ticking = false;

    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Rolando para baixo e passou de 100px
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Rolando para cima
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(controlNavbar);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [lastScrollY]);

  // Fechar dropdown do usuário quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        (showUserMenu || showUserMenuMini) &&
        !target.closest(".user-menu-container")
      ) {
        setShowUserMenu(false);
        setShowUserMenuMini(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu, showUserMenuMini]);

  return (
    <>
      {/* Top Bar - Carousel de Promoções */}
      <div
        className={`bg-black text-white py-2 fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Carrossel à Esquerda */}
            <div className="flex items-center gap-3 flex-1">
              {/* Texto com Transição */}
              <div className="relative h-6 overflow-hidden flex-1 max-w-md">
                {promos.map((promo, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 flex items-center text-sm font-light transition-all duration-700 ease-in-out ${
                      index === currentPromo
                        ? "opacity-100 translate-x-0"
                        : index < currentPromo
                          ? "opacity-0 -translate-x-full"
                          : "opacity-0 translate-x-full"
                    }`}
                  >
                    {promo}
                  </div>
                ))}
              </div>

              {/* Indicadores Discretos */}
              <div className="flex items-center gap-1.5">
                {promos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPromo(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentPromo
                        ? "w-4 bg-white/80"
                        : "w-1 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Ir para promoção ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Links à Direita */}
            <div className="flex items-center gap-6 text-sm font-light">
              <Link
                href="/contato"
                className="text-white/80 hover:text-white transition-colors"
              >
                Contato
              </Link>
              <Link
                href="/ajuda"
                className="text-white/80 hover:text-white transition-colors"
              >
                Ajuda
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar Principal */}
      <nav
        className={`bg-white shadow-md fixed left-0 right-0 z-40 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ top: "40px" }}
      >
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-8">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <h1 className="text-2xl font-light tracking-wider text-black">
                SUA LOGO AQUI
              </h1>
            </Link>

            {/* Categorias - Centro */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              <Link
                href="/produtos"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap"
              >
                Produtos
              </Link>
              <Link
                href="/categorias"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap"
              >
                Categorias
              </Link>
              <Link
                href="/ofertas"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap"
              >
                Ofertas
              </Link>
              <Link
                href="/lancamentos"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap"
              >
                Lançamentos
              </Link>
            </div>

            {/* Search Bar + Icons - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              {/* Search Bar */}
              <div className="relative w-64">
                {/* Ícone de busca */}
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-black text-gray-900 placeholder:text-gray-400 font-light transition-all"
                />

                {/* Botão limpar */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Limpar busca"
                  >
                    <svg
                      className="w-4 h-4"
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
                )}
              </div>

              {/* Icons */}
              <div className="flex items-center gap-5">
                {/* Wishlist */}
                <Link
                  href="/favoritos"
                  className="relative text-gray-600 hover:text-black transition-colors"
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </Link>

                {/* User Account */}
                <div className="relative user-menu-container">
                  {user ? (
                    <>
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="relative text-gray-600 hover:text-black transition-colors flex items-center gap-2"
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-light text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs font-light text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="block px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors border-b border-gray-100"
                              onClick={() => setShowUserMenu(false)}
                            >
                              🔐 Painel Admin
                            </Link>
                          )}
                          <Link
                            href="/conta"
                            className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Minha Conta
                          </Link>
                          <Link
                            href="/conta?tab=pedidos"
                            className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Meus Pedidos
                          </Link>
                          <Link
                            href="/conta?tab=favoritos"
                            className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Favoritos
                          </Link>
                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <button
                              onClick={async () => {
                                await logout();
                                setShowUserMenu(false);
                                router.push("/");
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm font-light text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Sair da Conta
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="relative text-gray-600 hover:text-black transition-colors"
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </Link>
                  )}
                </div>

                {/* Shopping Cart */}
                <button
                  onClick={toggleCart}
                  className="relative text-gray-600 hover:text-black transition-colors"
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 4 0 014 0z"
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-light">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                {/* Ícone de busca */}
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-black text-gray-900 placeholder:text-gray-400 font-light transition-all"
                />

                {/* Botão limpar */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Limpar busca"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                <Link
                  href="/"
                  className="py-2 text-gray-600 hover:text-black font-light"
                >
                  Início
                </Link>
                <Link
                  href="/produtos"
                  className="py-2 text-gray-600 hover:text-black font-light"
                >
                  Produtos
                </Link>
                <Link
                  href="/categorias"
                  className="py-2 text-gray-600 hover:text-black font-light"
                >
                  Categorias
                </Link>
                <Link
                  href="/ofertas"
                  className="py-2 text-gray-600 hover:text-black font-light"
                >
                  Ofertas
                </Link>
                <Link
                  href="/lancamentos"
                  className="py-2 text-gray-600 hover:text-black font-light"
                >
                  Lançamentos
                </Link>
                <Link
                  href="/sobre"
                  className="py-2 text-gray-600 hover:text-black font-light"
                >
                  Sobre Nós
                </Link>
              </div>

              {/* Mobile Icons */}
              <div className="flex justify-around pt-4 border-t border-gray-200">
                <Link
                  href="/favoritos"
                  className="flex flex-col items-center text-gray-600"
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-xs mt-1 font-light">Favoritos</span>
                </Link>
                <Link
                  href="/conta"
                  className="flex flex-col items-center text-gray-600"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-xs mt-1 font-light">Conta</span>
                </Link>
                <Link
                  href="/carrinho"
                  className="flex flex-col items-center relative text-gray-600"
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 4 0 014 0z"
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-light">
                      {itemCount}
                    </span>
                  )}
                  <span className="text-xs mt-1 font-light">Carrinho</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mini Search Bar Fixa - Aparece quando navbar principal desaparece */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-lg transition-transform duration-500 ease-in-out ${
          !isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center gap-8">
            {/* Logo compacta */}
            <Link href="/" className="shrink-0">
              <h1 className="text-lg font-light tracking-wider text-black whitespace-nowrap">
                SUA LOGO
              </h1>
            </Link>

            {/* Categorias - Centro */}
            <div className="hidden lg:flex items-center gap-5 flex-1 justify-center">
              <Link
                href="/produtos"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap text-sm"
              >
                Produtos
              </Link>
              <Link
                href="/categorias"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap text-sm"
              >
                Categorias
              </Link>
              <Link
                href="/ofertas"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap text-sm"
              >
                Ofertas
              </Link>
              <Link
                href="/lancamentos"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap text-sm"
              >
                Lançamentos
              </Link>
            </div>

            {/* Search Bar + Icons - Direita */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search Bar Compacta */}
              <div className="relative w-56">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-black text-gray-900 placeholder:text-gray-400 text-sm font-light transition-all"
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Limpar busca"
                  >
                    <svg
                      className="w-4 h-4"
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
                )}
              </div>

              {/* Ícones Compactos */}
              <div className="flex items-center gap-4">
                <Link
                  href="/favoritos"
                  className="text-gray-600 hover:text-black transition-colors"
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </Link>

                {/* User Account Mini */}
                <div className="relative user-menu-container">
                  {user ? (
                    <>
                      <button
                        onClick={() => setShowUserMenuMini(!showUserMenuMini)}
                        className="text-gray-600 hover:text-black transition-colors"
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </button>

                      {showUserMenuMini && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-light text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs font-light text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="block px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors border-b border-gray-100"
                              onClick={() => setShowUserMenuMini(false)}
                            >
                              🔐 Painel Admin
                            </Link>
                          )}
                          <Link
                            href="/conta"
                            className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenuMini(false)}
                          >
                            Minha Conta
                          </Link>
                          <Link
                            href="/conta?tab=pedidos"
                            className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenuMini(false)}
                          >
                            Meus Pedidos
                          </Link>
                          <Link
                            href="/conta?tab=favoritos"
                            className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenuMini(false)}
                          >
                            Favoritos
                          </Link>
                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <button
                              onClick={async () => {
                                await logout();
                                setShowUserMenuMini(false);
                                router.push("/");
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm font-light text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Sair da Conta
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="text-gray-600 hover:text-black transition-colors"
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </Link>
                  )}
                </div>

                <button
                  onClick={toggleCart}
                  className="relative text-gray-600 hover:text-black transition-colors"
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 4 0 014 0z"
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-light">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
