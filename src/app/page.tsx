import type { Metadata } from "next";
import HomePageClient from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "Conde Semijoias",
  description:
    "Compre semijoias femininas com design exclusivo na Conde Semijoias. Brincos, aneis, colares e pulseiras com envio para todo o Brasil.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomePageClient />;
}
