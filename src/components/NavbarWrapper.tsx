"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import AuthNavbar from "./AuthNavbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Não mostrar navbar nas rotas admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Rotas que usam a navbar simplificada
  const authRoutes = ["/login", "/cadastro", "/conta"];
  const isAuthPage = authRoutes.includes(pathname);

  if (isAuthPage) {
    return <AuthNavbar />;
  }

  return <Navbar />;
}
