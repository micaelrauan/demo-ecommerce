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

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <main className="pt-30">{children}</main>;
}
