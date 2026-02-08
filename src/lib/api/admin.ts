import { supabase } from "../supabase";

// ============================================
// ADMIN - DASHBOARD STATS
// ============================================

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  monthRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: any[];
  topProducts: any[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Total de produtos
    const { count: totalProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    // Total de pedidos
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    // Total de usuários
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Receita do mês
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const { data: monthOrders } = await supabase
      .from("orders")
      .select("total")
      .gte("created_at", currentMonth.toISOString())
      .eq("status", "completed");

    const monthRevenue =
      monthOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

    // Pedidos pendentes
    const { count: pendingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Produtos com estoque baixo
    const { count: lowStockProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .lte("stock", 10);

    // Pedidos recentes
    const { data: recentOrders } = await supabase
      .from("orders")
      .select(
        `
        *,
        profiles:user_id (name, email)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(5);

    // Produtos mais vendidos
    const { data: topProducts } = await supabase
      .from("order_items")
      .select(
        `
        product_id,
        quantity,
        products (name, price, images)
      `,
      )
      .limit(5);

    return {
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalUsers: totalUsers || 0,
      monthRevenue,
      pendingOrders: pendingOrders || 0,
      lowStockProducts: lowStockProducts || 0,
      recentOrders: recentOrders || [],
      topProducts: topProducts || [],
    };
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
    throw error;
  }
}

// ============================================
// ADMIN - PRODUCTS
// ============================================

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  category_id: string;
  images: string[];
  stock: number;
  sizes?: string[];
  colors?: string[];
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string;
}

export async function createProduct(product: CreateProductDTO) {
  try {
    const slug = product.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { data, error } = await supabase
      .from("products")
      .insert({
        ...product,
        slug,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
}

export async function updateProduct(product: UpdateProductDTO) {
  try {
    const { id, ...updates } = product;

    const updateData: any = { ...updates };

    if (updates.name) {
      updateData.slug = updates.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    throw error;
  }
}

// ============================================
// ADMIN - CATEGORIES
// ============================================

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export async function createCategory(category: CreateCategoryDTO) {
  try {
    const slug = category.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { data, error } = await supabase
      .from("categories")
      .insert({
        ...category,
        slug,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  updates: Partial<CreateCategoryDTO>,
) {
  try {
    const updateData: any = { ...updates };

    if (updates.name) {
      updateData.slug = updates.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const { data, error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    throw error;
  }
}

// ============================================
// ADMIN - USERS
// ============================================

export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        *,
        orders:orders(count)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    throw error;
  }
}

export async function updateUserRole(
  userId: string,
  role: "admin" | "cliente",
) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao atualizar role:", error);
    throw error;
  }
}

// ============================================
// ADMIN - ORDERS
// ============================================

export async function getAllOrders() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        profiles:user_id (name, email),
        order_items (
          *,
          products (name, images)
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao carregar pedidos:", error);
    throw error;
  }
}

export async function getOrderDetails(orderId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        profiles:user_id (name, email),
        order_items (
          *,
          products (name, images, price)
        )
      `,
      )
      .eq("id", orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao carregar detalhes do pedido:", error);
    throw error;
  }
}

// ============================================
// ADMIN - ANALYTICS
// ============================================

export interface SalesAnalytics {
  dailySales: { date: string; total: number }[];
  topCategories: { category: string; total: number }[];
  paymentMethods: { method: string; count: number }[];
  ordersByStatus: { status: string; count: number }[];
}

export async function getSalesAnalytics(
  startDate: string,
  endDate: string,
): Promise<SalesAnalytics> {
  try {
    // Vendas diárias
    const { data: sales } = await supabase
      .from("orders")
      .select("created_at, total")
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .eq("status", "completed");

    const dailySales =
      sales?.reduce((acc: any[], order) => {
        const date = new Date(order.created_at).toISOString().split("T")[0];
        const existing = acc.find((item) => item.date === date);
        if (existing) {
          existing.total += order.total;
        } else {
          acc.push({ date, total: order.total });
        }
        return acc;
      }, []) || [];

    // Top categorias
    const { data: categoryData } = await supabase.from("order_items").select(`
        products (category_id, categories (name))
      `);

    // Pedidos por status
    const { data: statusData } = await supabase
      .from("orders")
      .select("status")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    const ordersByStatus =
      statusData?.reduce((acc: any[], order) => {
        const existing = acc.find((item) => item.status === order.status);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ status: order.status, count: 1 });
        }
        return acc;
      }, []) || [];

    return {
      dailySales,
      topCategories: [],
      paymentMethods: [],
      ordersByStatus,
    };
  } catch (error) {
    console.error("Erro ao carregar analytics:", error);
    throw error;
  }
}
