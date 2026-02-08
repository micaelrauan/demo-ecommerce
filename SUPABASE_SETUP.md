# 🔐 Configuração Completa do Supabase

> Guia passo a passo para configurar o Supabase como banco de dados principal do e-commerce

## 📋 Índice

1. [Criar conta e projeto](#1-criar-conta-no-supabase)
2. [Obter credenciais](#2-obter-as-credenciais)
3. [Configurar variáveis de ambiente](#3-configurar-variáveis-de-ambiente)
4. [Criar schema do banco de dados](#4-criar-schema-do-banco-de-dados)
5. [Configurar autenticação](#5-configurar-autenticação)
6. [Testar a integração](#6-testar-a-integração)

---

## 1. Criar conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **Start your project**
3. Faça login com GitHub, Google ou email

### Criar um novo projeto

1. Clique em "**New Project**"
2. Preencha os dados:
   - **Name**: `ecommerce-template` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte (salve em local seguro!)
   - **Region**: Escolha a mais próxima (ex: South America - São Paulo)
   - **Pricing Plan**: Free (até 500MB de banco e 50k usuários/mês)
3. Clique em "**Create new project**"
4. Aguarde 1-2 minutos para o projeto ser criado

---

## 2. Obter as credenciais

1. No dashboard do projeto, vá em **Settings** (⚙️) → **API**
2. Copie os seguintes valores:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **anon public** key: String longa começando com `eyJ...`

⚠️ **Importante**: A `anon public` key é segura para uso no frontend. Nunca use a `service_role` key no cliente!

---

## 3. Configurar variáveis de ambiente

Edite o arquivo `.env` na raiz do projeto:

```bash
# Se ainda não tem o arquivo
cp .env.example .env
```

Adicione suas credenciais:

```env
# ============================================
# SUPABASE - BANCO DE DADOS PRINCIPAL
# ============================================
NEXT_PUBLIC_SUBASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

---

## 4. Criar schema do banco de dados

### Opção 1: Executar script completo (Recomendado) ⭐

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "**New query**"
3. Copie INTEIRO o conteúdo do arquivo [`supabase-schema.sql`](supabase-schema.sql)
4. Cole no editor
5. Clique em "**Run**" (ou pressione Ctrl/Cmd + Enter)

✅ **Pronto!** Todas as tabelas, políticas RLS, triggers e dados iniciais foram criados.

### Opção 2: Executar manualmente (Avançado)

Se preferir entender cada parte, execute os blocos do `supabase-schema.sql` separadamente.

---

## 5. O que foi criado no banco

Após executar o schema, você terá:

### 📊 Tabelas

| Tabela        | Descrição                               | RLS |
| ------------- | --------------------------------------- | --- |
| `profiles`    | Perfis de usuário (nome, telefone, CPF) | ✅  |
| `categories`  | Categorias de produtos                  | ✅  |
| `products`    | Produtos do e-commerce                  | ✅  |
| `cart_items`  | Itens no carrinho de cada usuário       | ✅  |
| `orders`      | Pedidos realizados                      | ✅  |
| `order_items` | Itens de cada pedido                    | ✅  |

### 🔐 Segurança (Row Level Security)

Todas as tabelas têm RLS habilitado com políticas que garantem:

- ✅ Usuários veem apenas seus próprios dados (carrinho, pedidos, perfil)
- ✅ Produtos e categorias são públicos (leitura para todos)
- ✅ Usuários não podem modificar dados de outros
- ✅ Pedidos são imutáveis depois de criados

### ⚡ Triggers automáticos

- **Auto-criar perfil**: Quando um usuário se registra, um perfil é criado automaticamente
- **Updated_at**: Todas as tabelas atualizam `updated_at` automaticamente

### 📦 Dados iniciais (Seed)

O script já inclui:

- 5 categorias de exemplo
- 3 produtos de exemplo

Você pode editar ou adicionar mais na tabela `products` do Supabase.

---

## 6. Configurar autenticação

### Habilitar provedores de login

1. No dashboard, vá em **Authentication** → **Providers**
2. Configure os provedores que deseja:

| Provedor           | Status        | Configuração necessária |
| ------------------ | ------------- | ----------------------- |
| **Email/Password** | ✅ Habilitado | Nenhuma                 |
| **Google**         | ⚪ Opcional   | Client ID + Secret      |
| **GitHub**         | ⚪ Opcional   | Client ID + Secret      |
| **Facebook**       | ⚪ Opcional   | App ID + Secret         |

### Configurar emails (Opcional)

Em **Authentication** → **Email Templates**, personalize:

- 📧 **Confirm signup** - Email de confirmação
- 🔄 **Reset password** - Email de recuperação de senha
- 📩 **Invite user** - Convidar usuários

### Para desenvolvimento: desabilitar confirmação de email

1. Vá em **Authentication** → **Providers**
2. Clique em **Email**
3. Desative "**Confirm email**"

⚠️ **Importante**: Em produção, sempre mantenha confirmação ativada!

---

## 7. Testar a integração

```bash
# Rodar o projeto
npm run dev
```

Acesse `http://localhost:3000` e teste:

1. ✅ Criar uma conta em `/cadastro`
2. ✅ Fazer login em `/login`
3. ✅ Acessar a conta em `/conta`
4. ✅ Ver produtos na home

### Verificar o banco de dados

No dashboard do Supabase:

1. **Authentication** → **Users** - Ver usuários cadastrados
2. **Table Editor** → **profiles** - Ver perfis criados
3. **Table Editor** → **products** - Ver produtos
4. **Table Editor** → **cart_items** - Ver carrinhos (se adicionar produtos)

---

## 8. Usando as APIs no código

O projeto já inclui funções helper prontas em `src/lib/api/`:

### Produtos

```typescript
import { getProducts, getProductBySlug, searchProducts } from "@/lib/api";

// Listar todos os produtos
const products = await getProducts();

// Buscar por slug
const product = await getProductBySlug("notebook-dell");

// Pesquisar
const results = await searchProducts("notebook");
```

### Carrinho

```typescript
import { addToCart, getCartItems, updateCartItemQuantity } from "@/lib/api";

// Adicionar ao carrinho
await addToCart(userId, {
  product_id: "uuid-do-produto",
  quantity: 2,
});

// Ver carrinho
const items = await getCartItems(userId);

// Atualizar quantidade
await updateCartItemQuantity(cartItemId, 5);
```

### Pedidos

```typescript
import { createOrder, getOrders } from "@/lib/api";

// Criar pedido
const order = await createOrder(userId, {
  items: [{ product_id: "uuid", quantity: 2, price: 99.9 }],
  shipping_address: {
    street: "Rua Exemplo",
    number: "123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipcode: "01000-000",
  },
});

// Listar pedidos
const orders = await getOrders(userId);
```

---

## 🔒 Segurança - Boas Práticas

### ✅ O que ESTÁ seguro

- Chaves `NEXT_PUBLIC_*` expostas no cliente (são públicas por design)
- RLS protege todos os dados automaticamente
- Supabase valida permissões em cada requisição

### ⚠️ O que NÃO fazer

- ❌ Nunca compartilhe a `service_role_key`
- ❌ Nunca desabilite RLS em produção
- ❌ Nunca confie em validações apenas no frontend

### 🛡️ Recomendações

1. Use RLS (já configurado) para todas as tabelas
2. Valide dados no backend (Edge Functions ou API Routes)
3. Use HTTPS em produção (automático na Vercel)
4. Habilite confirmação de email em produção
5. Configure rate limiting se necessário

---

## 🚀 Deploy em Produção

### Vercel (Recomendado)

1. Push seu código para GitHub
2. Importe projeto na [Vercel](https://vercel.com)
3. Adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático! ✨

### Supabase em Produção

1. **Habilitar confirmação de email**
2. **Configurar domínio customizado** (opcional)
3. **Configurar SMTP** para emails (SendGrid, AWS SES, etc)
4. **Monitorar uso** no dashboard (banco, auth, storage)

---

## 📚 Recursos Adicionais

- 📖 [Documentação Supabase](https://supabase.com/docs)
- 🔐 [Supabase Auth](https://supabase.com/docs/guides/auth)
- 🗃️ [Supabase Database](https://supabase.com/docs/guides/database)
- ⚡ [Edge Functions](https://supabase.com/docs/guides/functions)
- 🎓 [Tutoriais Next.js + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

---

## ❓ Troubleshooting

### Erro: "Invalid API key"

✅ Verifique se copiou corretamente a `anon public` key (não a `service_role`)

### Erro: "Row Level Security policies"

✅ Execute o `supabase-schema.sql` completo para criar as políticas RLS

### Produtos não aparecem

✅ Verifique em **Table Editor** → **products** se `is_active = true`

### Usuário não consegue fazer login

✅ Verifique em **Authentication** → **Users** se o usuário existe
✅ Se confirmação de email estiver ativa, usuário precisa confirmar

---

## 💡 Dicas

- Use o **SQL Editor** para queries rápidas
- **Table Editor** é visual e fácil para editar dados
- **Logs** mostra todas as requisições em tempo real
- **API Docs** gera documentação automática das suas tabelas
- **Database** → **Replication** permite criar réplicas read-only

---

🎉 **Parabéns!** Seu e-commerce agora tem um backend completo e escalável com Supabase!
