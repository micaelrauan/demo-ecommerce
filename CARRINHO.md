# 🛒 Sistema de Carrinho

O carrinho de compras foi configurado com **sidebar para desktop** e **página completa para mobile**.

## 📋 Funcionalidades

- ✅ Sidebar lateral no desktop (desliza da direita)
- ✅ Página completa no mobile
- ✅ Adicionar produtos ao carrinho
- ✅ Atualizar quantidades
- ✅ Remover itens
- ✅ Limpar carrinho
- ✅ Ver total em tempo real
- ✅ Contador de itens no badge do ícone
- ✅ Sincronização com banco de dados (Supabase)

## 🎯 Como Usar

### Adicionar Produto ao Carrinho

```tsx
"use client";

import { useCart } from "@/contexts/CartContext";

export default function ProdutoCard({ produto }) {
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    try {
      await addItem(produto.id, 1);
      alert("Produto adicionado ao carrinho!");
    } catch (error) {
      alert("Erro ao adicionar produto");
    }
  };

  return (
    <div>
      <h3>{produto.name}</h3>
      <button onClick={handleAddToCart}>Adicionar ao Carrinho</button>
    </div>
  );
}
```

### Abrir o Carrinho Programaticamente

```tsx
import { useCart } from "@/contexts/CartContext";

function MeuComponente() {
  const { openCart, closeCart, toggleCart } = useCart();

  return <button onClick={toggleCart}>Ver Carrinho</button>;
}
```

### Ver Dados do Carrinho

```tsx
import { useCart } from "@/contexts/CartContext";

function CarrinhoInfo() {
  const { items, itemCount, total, isLoading } = useCart();

  return (
    <div>
      <p>{itemCount} itens</p>
      <p>Total: R$ {total.toFixed(2)}</p>
    </div>
  );
}
```

## 🔧 Contexto do Carrinho

O `CartContext` fornece:

### Estados

- `items: CartItem[]` - Lista de itens no carrinho
- `isLoading: boolean` - Estado de carregamento
- `isOpen: boolean` - Se o sidebar está aberto
- `itemCount: number` - Quantidade total de itens
- `total: number` - Valor total do carrinho

### Funções

- `openCart()` - Abre o sidebar
- `closeCart()` - Fecha o sidebar
- `toggleCart()` - Alterna o sidebar
- `addItem(productId, quantity)` - Adiciona produto
- `updateQuantity(itemId, quantity)` - Atualiza quantidade
- `removeItem(itemId)` - Remove item
- `clearAllItems()` - Limpa todo o carrinho
- `refreshCart()` - Recarrega dados do carrinho

## 📱 Comportamento por Dispositivo

### Desktop (≥ 768px)

- Clique no ícone do carrinho na navbar → abre sidebar
- Sidebar desliza da direita
- Overlay escuro no fundo
- Fecha ao clicar fora ou pressionar ESC

### Mobile (< 768px)

- Clique no ícone do carrinho → navega para `/carrinho`
- Página completa dedicada
- Botão de voltar no header
- Total fixo no bottom

## 🎨 Componentes

### CartSidebar

Sidebar lateral para desktop

- Localização: `src/components/CartSidebar.tsx`
- Renderizado no layout principal
- Controle de visibilidade via contexto

### CarrinhoPage

Página completa para mobile

- Localização: `src/app/(public)/carrinho/page.tsx`
- Redireciona automaticamente no desktop
- Layout otimizado para mobile

## 📦 Estrutura de Dados

### CartItem

```typescript
interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}
```

## 🔄 Fluxo de Dados

1. Usuário adiciona produto → `addItem()`
2. Chama API do Supabase → `addToCart()`
3. Salva no banco de dados
4. Atualiza estado local → `refreshCart()`
5. UI atualiza automaticamente

## ⚙️ Configuração

O carrinho já está configurado no `layout.tsx`:

```tsx
<AuthProvider>
  <CartProvider>
    <NavbarWrapper />
    <CartSidebar />
    <MainWrapper>{children}</MainWrapper>
  </CartProvider>
</AuthProvider>
```

## 🚀 Próximos Passos

Para implementar o checkout:

1. Criar página `/checkout`
2. Usar `items` e `total` do carrinho
3. Processar pagamento
4. Criar pedido com `createOrder()`
5. Limpar carrinho com `clearAllItems()`

## 💡 Dicas

- O carrinho sincroniza automaticamente com o banco
- Produtos são associados ao `user_id` do usuário logado
- Usuários não logados são redirecionados para login ao adicionar itens
- O carrinho persiste entre sessões (salvo no Supabase)
