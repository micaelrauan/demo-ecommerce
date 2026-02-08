import { supabase } from "../supabase";
import type { Product, Category } from "../types";

// ============================================
// PRODUTOS
// ============================================

/**
 * Busca todos os produtos ativos
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*)
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Product[];
}

/**
 * Busca produto por slug
 */
export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*)
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Busca produtos por categoria
 */
export async function getProductsByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories!inner(*)
    `,
    )
    .eq("category.slug", categorySlug)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Product[];
}

/**
 * Busca produtos (com filtros opcionais)
 */
export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*)
    `,
    )
    .eq("is_active", true)
    .ilike("name", `%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Product[];
}

// ============================================
// CATEGORIAS
// ============================================

/**
 * Busca todas as categorias
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as Category[];
}

/**
 * Busca categoria por slug
 */
export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Category;
}
