import {
  getCategories,
  getProducts,
  replaceCategoriesCache,
  replaceProductsCache,
} from "./products";
import { mockOrderItems, mockOrders, mockProfiles } from "../mock-data";
import type { Category, Product } from "../types";

// ============================================
// ADMIN - DASHBOARD STATS
// ============================================

interface DashboardRecentOrder {
  id: string;
  user_id: string;
  status: string;
  total: number;
  shipping_address_street: string;
  shipping_address_number: string;
  shipping_address_complement?: string;
  shipping_address_neighborhood: string;
  shipping_address_city: string;
  shipping_address_state: string;
  shipping_address_zipcode: string;
  created_at: string;
  updated_at: string;
  profiles: {
    name: string;
    email: string;
  };
}

interface DashboardTopProduct {
  product_id: string;
  quantity: number;
  products?: Product;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  monthRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: DashboardRecentOrder[];
  topProducts: DashboardTopProduct[];
}

/**
 * Returns dashboard metrics for the admin overview.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [products] = await Promise.all([getProducts()]);

  const monthRevenue = mockOrders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = mockOrders.filter(
    (order) => order.status === "pending",
  ).length;

  const lowStockProducts = products.filter(
    (product) => product.stock <= 10,
  ).length;

  const recentOrders = mockOrders.slice(0, 5).map((order) => {
    const profile = mockProfiles.find((entry) => entry.id === order.user_id);

    return {
      ...order,
      profiles: {
        name: profile?.name || "Cliente",
        email: profile
          ? `${profile.name.toLowerCase().replace(/\s+/g, ".")}@demo.com`
          : "cliente@demo.com",
      },
    };
  });

  const topProductsById = mockOrderItems.reduce<Record<string, number>>(
    (accumulator, item) => {
      accumulator[item.product_id] =
        (accumulator[item.product_id] || 0) + item.quantity;
      return accumulator;
    },
    {},
  );

  const topProducts = Object.entries(topProductsById)
    .map(([productId, quantity]) => ({
      product_id: productId,
      quantity,
      products: products.find((product) => product.id === productId),
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    totalProducts: products.length,
    totalOrders: mockOrders.length,
    totalUsers: mockProfiles.length,
    monthRevenue,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    topProducts,
  };
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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapProductForCache(
  product: CreateProductDTO,
  id: string,
  category?: Category,
): Product {
  const now = new Date().toISOString();

  return {
    id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category_id: product.category_id,
    image_url: product.images?.[0] || "",
    slug: slugify(product.name),
    is_active: true,
    created_at: now,
    updated_at: now,
    category,
  };
}

/**
 * Creates a new product in the local admin cache.
 */
export async function createProduct(
  product: CreateProductDTO,
): Promise<Product> {
  const categories = await getCategories();
  const category = categories.find((item) => item.id === product.category_id);
  const cachedProducts = await getProducts();
  const created = mapProductForCache(product, `prod-${Date.now()}`, category);

  replaceProductsCache([created, ...cachedProducts]);
  return created;
}

/**
 * Updates a cached product for the current admin session.
 */
export async function updateProduct(
  product: UpdateProductDTO,
): Promise<Product> {
  const categories = await getCategories();
  const cachedProducts = await getProducts();
  const nextProducts = cachedProducts.map((item) => {
    if (item.id !== product.id) {
      return item;
    }

    const name = product.name ?? item.name;
    const description = product.description ?? item.description ?? "";
    const price = product.price ?? item.price;
    const stock = product.stock ?? item.stock;
    const categoryId = product.category_id ?? item.category_id ?? "";
    const category = categories.find((entry) => entry.id === categoryId);
    const images = product.images ?? (item.image_url ? [item.image_url] : []);

    return {
      ...item,
      ...product,
      name,
      description,
      price,
      stock,
      category_id: categoryId,
      image_url: images[0] || item.image_url,
      slug: slugify(name),
      updated_at: new Date().toISOString(),
      category,
    };
  });

  const updated = nextProducts.find((item) => item.id === product.id);
  if (!updated) {
    throw new Error("Produto nao encontrado");
  }

  replaceProductsCache(nextProducts);
  return updated;
}

/**
 * Deletes a cached product for the current admin session.
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const cachedProducts = await getProducts();
  const nextProducts = cachedProducts.filter((item) => item.id !== id);

  if (nextProducts.length === cachedProducts.length) {
    throw new Error("Produto nao encontrado");
  }

  replaceProductsCache(nextProducts);
  return true;
}

// ============================================
// ADMIN - CATEGORIES
// ============================================

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

function mapCategoryForCache(
  category: CreateCategoryDTO,
  id: string,
): Category {
  const now = new Date().toISOString();

  return {
    id,
    name: category.name,
    description: category.description,
    slug: slugify(category.name),
    image_url: undefined,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Creates a category in the local admin cache.
 */
export async function createCategory(
  category: CreateCategoryDTO,
): Promise<Category> {
  const cachedCategories = await getCategories();
  const created = mapCategoryForCache(category, `cat-${Date.now()}`);
  replaceCategoriesCache([...cachedCategories, created]);
  return created;
}

/**
 * Updates a cached category for the current admin session.
 */
export async function updateCategory(
  id: string,
  updates: Partial<CreateCategoryDTO>,
): Promise<Category> {
  const cachedCategories = await getCategories();
  const nextCategories = cachedCategories.map((item) => {
    if (item.id !== id) {
      return item;
    }

    return {
      ...item,
      ...updates,
      slug: updates.name ? slugify(updates.name) : item.slug,
      updated_at: new Date().toISOString(),
    };
  });

  const updated = nextCategories.find((item) => item.id === id);
  if (!updated) {
    throw new Error("Categoria nao encontrada");
  }

  replaceCategoriesCache(nextCategories);
  return updated;
}

/**
 * Deletes a cached category for the current admin session.
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const cachedCategories = await getCategories();
  const nextCategories = cachedCategories.filter((item) => item.id !== id);

  if (nextCategories.length === cachedCategories.length) {
    throw new Error("Categoria nao encontrada");
  }

  replaceCategoriesCache(nextCategories);
  return true;
}

// ============================================
// ADMIN - USERS
// ============================================

/**
 * Returns the mocked admin user list.
 */
export async function getAllUsers() {
  return mockProfiles.map((profile) => ({
    ...profile,
    email: `${profile.name.toLowerCase().replace(/\s+/g, ".")}@demo.com`,
    role:
      profile.id === "admin-user" ? ("admin" as const) : ("cliente" as const),
    orders: [
      {
        count: mockOrders.filter((order) => order.user_id === profile.id)
          .length,
      },
    ],
  }));
}

/**
 * Updates the cached role for a demo user entry.
 */
export async function updateUserRole(
  userId: string,
  role: "admin" | "cliente",
) {
  const target = mockProfiles.find((entry) => entry.id === userId);
  if (!target) {
    throw new Error("Usuario nao encontrado");
  }

  return {
    ...target,
    role,
  };
}

// ============================================
// ADMIN - ORDERS
// ============================================

/**
 * Returns the mocked order list.
 */
export async function getAllOrders() {
  return mockOrders.map((order) => ({
    ...order,
    profiles: {
      email: `${(mockProfiles.find((entry) => entry.id === order.user_id)?.name || "cliente").toLowerCase().replace(/\s+/g, ".")}@demo.com`,
    },
    order_items: mockOrderItems.filter((item) => item.order_id === order.id),
  }));
}

/**
 * Returns a mocked order detail entry.
 */
export async function getOrderDetails(orderId: string) {
  const order = mockOrders.find((entry) => entry.id === orderId);
  if (!order) {
    throw new Error("Pedido nao encontrado");
  }

  return {
    ...order,
    profiles: {
      email: `${(mockProfiles.find((entry) => entry.id === order.user_id)?.name || "cliente").toLowerCase().replace(/\s+/g, ".")}@demo.com`,
    },
    order_items: mockOrderItems
      .filter((item) => item.order_id === order.id)
      .map((item) => ({
        ...item,
        products: undefined,
      })),
  };
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

/**
 * Returns demo analytics data for the admin reports page.
 */
export async function getSalesAnalytics(
  _startDate: string,
  _endDate: string,
): Promise<SalesAnalytics> {
  const products = await getProducts();
  const dailySales = mockOrders.map((order) => ({
    date: order.created_at.split("T")[0],
    total: order.total,
  }));

  const topCategoriesMap = mockOrderItems.reduce<Record<string, number>>(
    (accumulator, item) => {
      const product = products.find((entry) => entry.id === item.product_id);
      const key = product?.category?.name || product?.name || item.product_id;
      accumulator[key] = (accumulator[key] || 0) + item.quantity;
      return accumulator;
    },
    {},
  );

  const topCategories = Object.entries(topCategoriesMap).map(
    ([category, total]) => ({
      category,
      total,
    }),
  );

  const ordersByStatusMap = mockOrders.reduce<Record<string, number>>(
    (accumulator, order) => {
      accumulator[order.status] = (accumulator[order.status] || 0) + 1;
      return accumulator;
    },
    {},
  );

  const ordersByStatus = Object.entries(ordersByStatusMap).map(
    ([status, count]) => ({
      status,
      count,
    }),
  );

  return {
    dailySales,
    topCategories,
    paymentMethods: [
      { method: "PIX", count: 5 },
      { method: "Cartao", count: 3 },
      { method: "Boleto", count: 1 },
    ],
    ordersByStatus,
  };
}
