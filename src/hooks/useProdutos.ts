"use client";

import { useEffect, useState } from "react";
import type {
  NuvemshopCategory,
  NuvemshopProduct,
} from "../../types/nuvemshop";

interface ProdutosResponse {
  products: NuvemshopProduct[];
  total: number;
}

interface UseProdutosResult {
  produtos: NuvemshopProduct[];
  isLoading: boolean;
  error: string | null;
}

interface UseCategoriasResult {
  categorias: NuvemshopCategory[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches products from the local proxy route with optional category filtering.
 */
export function useProdutos(categoryId?: number): UseProdutosResult {
  const [produtos, setProdutos] = useState<NuvemshopProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProdutos() {
      try {
        setIsLoading(true);
        setError(null);

        const url = new URL("/api/produtos", window.location.origin);
        url.searchParams.set("page", "1");
        url.searchParams.set("per_page", "12");

        if (typeof categoryId === "number") {
          url.searchParams.set("category_id", String(categoryId));
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error || "Failed to load products.");
        }

        const data = (await response.json()) as ProdutosResponse;

        if (mounted) {
          setProdutos(data.products);
        }
      } catch (err) {
        if (mounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load products.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProdutos();

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  return { produtos, isLoading, error };
}

/**
 * Fetches categories from the local proxy route.
 */
export function useCategorias(): UseCategoriasResult {
  const [categorias, setCategorias] = useState<NuvemshopCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCategorias() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/categorias");

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error || "Failed to load categories.");
        }

        const data = (await response.json()) as NuvemshopCategory[];

        if (mounted) {
          setCategorias(data);
        }
      } catch (err) {
        if (mounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load categories.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCategorias();

    return () => {
      mounted = false;
    };
  }, []);

  return { categorias, isLoading, error };
}
