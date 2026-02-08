"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Rotas que usam a navbar simplificada (sem padding extra)
  const authRoutes = ["/login", "/cadastro", "/conta"];
  const isAuthPage = authRoutes.includes(pathname);

  // Páginas admin têm seu próprio layout
  const isAdminPage = pathname.startsWith("/admin");

  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }

  // Páginas normais têm top bar (40px) + navbar (80px) = 120px
  return <main className="pt-30">{children}</main>;
}
