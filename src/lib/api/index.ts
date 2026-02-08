// ============================================
// API FUNCTIONS - Barrel Export
// ============================================

// Products & Categories
export {
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
  getCategories,
  getCategoryBySlug,
} from "./products";

// Cart
export {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
} from "./cart";

// Orders
export {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from "./orders";

// Users
export { getProfile, updateProfile, getCurrentUser } from "./users";

// Admin Functions
export {
  getDashboardStats,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllUsers,
  updateUserRole,
  getAllOrders,
  getOrderDetails,
  getSalesAnalytics,
} from "./admin";

export type {
  DashboardStats,
  CreateProductDTO,
  UpdateProductDTO,
  SalesAnalytics,
  CreateCategoryDTO,
} from "./admin";

// Types
export type {
  Profile,
  Category,
  Product,
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  CreateOrderDTO,
  UpdateProfileDTO,
  AddToCartDTO,
} from "../types";
