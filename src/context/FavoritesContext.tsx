"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  compare_at_price?: number;
  image_url?: string;
  slug: string;
  stock: number;
  variant_id?: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  favoritesCount: number;
  isLoading: boolean;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string | number) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string | number) => boolean;
  clearFavorites: () => void;
}

const FAVORITES_STORAGE_KEY = "favorites";

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

function toFavoriteItem(product: Product): FavoriteItem {
  return {
    id: String(product.id),
    name: product.name,
    price: product.price,
    compare_at_price: product.compare_at_price,
    image_url: product.image_url,
    slug: product.slug,
    stock: product.stock,
    variant_id: product.variant_id,
    category: product.category
      ? {
          id: String(product.category.id),
          name: product.category.name,
          slug: product.category.slug,
        }
      : undefined,
  };
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FavoriteItem[];
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites),
    );
  }, [favorites, isLoading]);

  const addFavorite = (product: Product) => {
    const next = toFavoriteItem(product);

    setFavorites((current) => {
      if (current.some((item) => item.id === next.id)) {
        return current;
      }
      return [...current, next];
    });
  };

  const removeFavorite = (productId: string | number) => {
    const id = String(productId);
    setFavorites((current) => current.filter((item) => item.id !== id));
  };

  const toggleFavorite = (product: Product) => {
    const id = String(product.id);
    setFavorites((current) => {
      const exists = current.some((item) => item.id === id);
      if (exists) {
        return current.filter((item) => item.id !== id);
      }
      return [...current, toFavoriteItem(product)];
    });
  };

  const isFavorite = (productId: string | number) => {
    const id = String(productId);
    return favorites.some((item) => item.id === id);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = useMemo<FavoritesContextType>(
    () => ({
      favorites,
      favoritesCount: favorites.length,
      isLoading,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      clearFavorites,
    }),
    [favorites, isLoading],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites deve ser usado dentro de um FavoritesProvider",
    );
  }

  return context;
}
