import { supabase } from "../supabase";
import type { Order, OrderItem, CreateOrderDTO } from "../types";
import { clearCart } from "./cart";

// ============================================
// PEDIDOS
// ============================================

/**
 * Busca todos os pedidos do usuário
 */
export async function getOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Order[];
}

/**
 * Busca um pedido por ID
 */
export async function getOrderById(orderId: string, userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items:order_items(
        *,
        product:products(*)
      )
    `,
    )
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data as Order & { order_items: OrderItem[] };
}

/**
 * Cria um novo pedido
 */
export async function createOrder(userId: string, dto: CreateOrderDTO) {
  // Calcula o total
  const total = dto.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Cria o pedido
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total,
      status: "pending",
      shipping_address_street: dto.shipping_address.street,
      shipping_address_number: dto.shipping_address.number,
      shipping_address_complement: dto.shipping_address.complement,
      shipping_address_neighborhood: dto.shipping_address.neighborhood,
      shipping_address_city: dto.shipping_address.city,
      shipping_address_state: dto.shipping_address.state,
      shipping_address_zipcode: dto.shipping_address.zipcode,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Cria os itens do pedido
  const orderItems = dto.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  // Limpa o carrinho
  await clearCart(userId);

  return order as Order;
}

/**
 * Atualiza o status de um pedido
 */
export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "processing" | "completed" | "cancelled",
) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

/**
 * Cancela um pedido
 */
export async function cancelOrder(orderId: string, userId: string) {
  // Verifica se o pedido pertence ao usuário e está em status cancelável
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  if (order.status === "completed" || order.status === "cancelled") {
    throw new Error("Este pedido não pode ser cancelado");
  }

  return updateOrderStatus(orderId, "cancelled");
}
