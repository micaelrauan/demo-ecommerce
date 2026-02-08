# 📚 API Helper Functions

Funções prontas para interagir com o banco de dados Supabase.

## 📦 Importação

```typescript
// Importar tudo
import * as api from "@/lib/api";

// Ou importar específico
import { getProducts, addToCart, createOrder } from "@/lib/api";
```

---

## 🛍️ Produtos

### `getProducts()`

Busca todos os produtos ativos.

```typescript
const products = await getProducts();
// Retorna: Product[]
```

### `getProductBySlug(slug: string)`

Busca produto por slug.

```typescript
const product = await getProductBySlug("notebook-dell");
// Retorna: Product
```

### `getProductsByCategory(categorySlug: string)`

Busca produtos de uma categoria.

```typescript
const products = await getProductsByCategory("eletronicos");
// Retorna: Product[]
```

### `searchProducts(query: string)`

Pesquisa produtos por nome.

```typescript
const results = await searchProducts("notebook");
// Retorna: Product[]
```

---

## 📂 Categorias

### `getCategories()`

Busca todas as categorias.

```typescript
const categories = await getCategories();
// Retorna: Category[]
```

### `getCategoryBySlug(slug: string)`

Busca categoria por slug.

```typescript
const category = await getCategoryBySlug("eletronicos");
// Retorna: Category
```

---

## 🛒 Carrinho

### `getCartItems(userId: string)`

Busca itens do carrinho do usuário.

```typescript
const items = await getCartItems(user.id);
// Retorna: CartItem[]
```

### `addToCart(userId: string, dto: AddToCartDTO)`

Adiciona produto ao carrinho.

```typescript
await addToCart(user.id, {
  product_id: "uuid-do-produto",
  quantity: 2,
});
// Retorna: CartItem
```

### `updateCartItemQuantity(cartItemId: string, quantity: number)`

Atualiza quantidade de um item.

```typescript
await updateCartItemQuantity("uuid-do-item", 5);
// Retorna: CartItem
```

### `removeFromCart(cartItemId: string)`

Remove item do carrinho.

```typescript
await removeFromCart("uuid-do-item");
// Retorna: { success: true }
```

### `clearCart(userId: string)`

Limpa todo o carrinho.

```typescript
await clearCart(user.id);
// Retorna: { success: true }
```

### `getCartTotal(userId: string)`

Calcula total do carrinho.

```typescript
const total = await getCartTotal(user.id);
// Retorna: { items: number, total: number }
```

---

## 📦 Pedidos

### `getOrders(userId: string)`

Busca todos os pedidos do usuário.

```typescript
const orders = await getOrders(user.id);
// Retorna: Order[]
```

### `getOrderById(orderId: string, userId: string)`

Busca pedido específico com itens.

```typescript
const order = await getOrderById("uuid", user.id);
// Retorna: Order & { order_items: OrderItem[] }
```

### `createOrder(userId: string, dto: CreateOrderDTO)`

Cria novo pedido.

```typescript
const order = await createOrder(user.id, {
  items: [
    {
      product_id: "uuid-produto-1",
      quantity: 2,
      price: 99.9,
    },
    {
      product_id: "uuid-produto-2",
      quantity: 1,
      price: 49.9,
    },
  ],
  shipping_address: {
    street: "Rua Exemplo",
    number: "123",
    complement: "Apt 45",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipcode: "01000-000",
  },
});
// Retorna: Order
```

### `updateOrderStatus(orderId: string, status: OrderStatus)`

Atualiza status do pedido.

```typescript
await updateOrderStatus("uuid", "processing");
// Retorna: Order
// Status: 'pending' | 'processing' | 'completed' | 'cancelled'
```

### `cancelOrder(orderId: string, userId: string)`

Cancela um pedido.

```typescript
await cancelOrder("uuid", user.id);
// Retorna: Order
// Erro se: pedido não existe, não pertence ao usuário, ou já foi concluído
```

---

## 👤 Usuários

### `getProfile(userId: string)`

Busca perfil do usuário.

```typescript
const profile = await getProfile(user.id);
// Retorna: Profile
```

### `updateProfile(userId: string, dto: UpdateProfileDTO)`

Atualiza perfil do usuário.

```typescript
const profile = await updateProfile(user.id, {
  name: "João Silva",
  phone: "11999999999",
  cpf: "123.456.789-00",
});
// Retorna: Profile
```

### `getCurrentUser()`

Busca usuário autenticado com perfil.

```typescript
const user = await getCurrentUser();
// Retorna: User & { profile: Profile }
// Erro se: não autenticado
```

---

## 📘 TypeScript - Tipos

Todos os tipos estão disponíveis em `@/lib/api`:

```typescript
import type {
  Product,
  Category,
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  Profile,
  CreateOrderDTO,
  UpdateProfileDTO,
  AddToCartDTO,
} from "@/lib/api";
```

---

## 🔐 Segurança

- ✅ Todas as funções respeitam RLS (Row Level Security)
- ✅ Usuários só acessam seus próprios dados
- ✅ Produtos e categorias são públicos
- ⚠️ Sempre use `user.id` do usuário autenticado

---

## ⚠️ Tratamento de Erros

Todas as funções podem lançar erros. Use try/catch:

```typescript
try {
  const products = await getProducts();
} catch (error) {
  console.error("Erro ao buscar produtos:", error);
  // Tratar erro
}
```

Erros comuns:

- Permissão negada (RLS bloqueou)
- Dados não encontrados
- Violação de constraint (ex: produto duplicado)

---

## 💡 Exemplos de Uso

### Página de Produto

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getProductBySlug, addToCart } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { user } = useAuth();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductBySlug(params.slug).then(setProduct);
  }, [params.slug]);

  const handleAddToCart = async () => {
    if (!user) return;

    await addToCart(user.id, {
      product_id: product.id,
      quantity: 1
    });

    alert('Produto adicionado ao carrinho!');
  };

  return (
    <div>
      <h1>{product?.name}</h1>
      <p>R$ {product?.price}</p>
      <button onClick={handleAddToCart}>Adicionar ao Carrinho</button>
    </div>
  );
}
```

### Página de Carrinho

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getCartItems, getCartTotal, removeFromCart } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) return;

    getCartItems(user.id).then(setItems);
    getCartTotal(user.id).then(data => setTotal(data.total));
  }, [user]);

  const handleRemove = async (itemId: string) => {
    await removeFromCart(itemId);
    // Recarregar carrinho
    setItems(await getCartItems(user.id));
    setTotal((await getCartTotal(user.id)).total);
  };

  return (
    <div>
      <h1>Meu Carrinho</h1>
      {items.map(item => (
        <div key={item.id}>
          <p>{item.product.name} - {item.quantity}x</p>
          <button onClick={() => handleRemove(item.id)}>Remover</button>
        </div>
      ))}
      <p>Total: R$ {total.toFixed(2)}</p>
    </div>
  );
}
```

### Finalizar Pedido

```typescript
import { createOrder, getCartItems } from "@/lib/api";

async function checkout(userId: string) {
  // Buscar itens do carrinho
  const cartItems = await getCartItems(userId);

  // Converter para formato do pedido
  const items = cartItems.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  // Criar pedido
  const order = await createOrder(userId, {
    items,
    shipping_address: {
      street: "Rua Exemplo",
      number: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipcode: "01000-000",
    },
  });

  console.log("Pedido criado:", order.id);
  // Carrinho é limpo automaticamente!
}
```

---

## 🚀 Performance

### Cache (Opcional)

Para melhorar performance, considere usar SWR ou React Query:

```typescript
import useSWR from 'swr';
import { getProducts } from '@/lib/api';

function ProductList() {
  const { data: products, error } = useSWR('products', getProducts);

  if (error) return <div>Erro ao carregar</div>;
  if (!products) return <div>Carregando...</div>;

  return <div>{/* renderizar produtos */}</div>;
}
```

### Realtime (Opcional)

Para updates em tempo real, use subscriptions do Supabase:

```typescript
import { supabase } from "@/lib/supabase";

// Escutar mudanças em produtos
supabase
  .channel("products")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "products" },
    (payload) => {
      console.log("Produto atualizado:", payload);
    },
  )
  .subscribe();
```

---

📖 **Documentação completa do Supabase**: [supabase.com/docs](https://supabase.com/docs)
