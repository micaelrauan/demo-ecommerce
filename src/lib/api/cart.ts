import { supabase } from "../supabase";
import type { CartItem, AddToCartDTO } from "../types";

// ============================================
// CARRINHO
// ============================================

/**
 * Busca todos os itens do carrinho do usuário
 */
export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      product:products(*)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as CartItem[];
}

/**
 * Adiciona item ao carrinho
 */
export async function addToCart(userId: string, dto: AddToCartDTO) {
  // Verifica se o item já existe no carrinho
  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", dto.product_id)
    .single();

  if (existing) {
    // Atualiza a quantidade
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + dto.quantity })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Cria novo item
    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        user_id: userId,
        product_id: dto.product_id,
        quantity: dto.quantity,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Atualiza quantidade de um item no carrinho
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
) {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove item do carrinho
 */
export async function removeFromCart(cartItemId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) throw error;
  return { success: true };
}

/**
 * Limpa todo o carrinho do usuário
 */
export async function clearCart(userId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
  return { success: true };
}

/**
 * Calcula o total do carrinho
 */
export async function getCartTotal(userId: string) {
  const items = await getCartItems(userId);

  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return {
    items: items.length,
    total,
  };
}
