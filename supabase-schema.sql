-- ============================================
-- SCHEMA COMPLETO DO ECOMMERCE - SUPABASE
-- ============================================

-- 1. TABELA DE PERFIS (Estende auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  cpf TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE CATEGORIAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE PRODUTOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE CARRINHO
-- ============================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 5. TABELA DE PEDIDOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  
  -- Endereço de entrega
  shipping_address_street TEXT NOT NULL,
  shipping_address_number TEXT NOT NULL,
  shipping_address_complement TEXT,
  shipping_address_neighborhood TEXT NOT NULL,
  shipping_address_city TEXT NOT NULL,
  shipping_address_state TEXT NOT NULL,
  shipping_address_zipcode TEXT NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE ITENS DO PEDIDO
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER PARA AUTO-CRIAR PERFIL
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS - PROFILES
-- ============================================

-- Usuários podem ver e atualizar apenas seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- POLÍTICAS RLS - CATEGORIES
-- ============================================

-- Todos podem ver categorias
CREATE POLICY "Categorias são públicas"
  ON public.categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- ============================================
-- POLÍTICAS RLS - PRODUCTS
-- ============================================

-- Todos podem ver produtos ativos
CREATE POLICY "Produtos ativos são públicos"
  ON public.products FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- ============================================
-- POLÍTICAS RLS - CART_ITEMS
-- ============================================

-- Usuários podem ver apenas seus próprios itens do carrinho
CREATE POLICY "Usuários podem ver seu próprio carrinho"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem adicionar itens ao seu próprio carrinho
CREATE POLICY "Usuários podem adicionar ao seu carrinho"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar seu próprio carrinho
CREATE POLICY "Usuários podem atualizar seu carrinho"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuários podem deletar itens do seu próprio carrinho
CREATE POLICY "Usuários podem deletar do seu carrinho"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS - ORDERS
-- ============================================

-- Usuários podem ver apenas seus próprios pedidos
CREATE POLICY "Usuários podem ver seus próprios pedidos"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem criar seus próprios pedidos
CREATE POLICY "Usuários podem criar seus pedidos"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS - ORDER_ITEMS
-- ============================================

-- Usuários podem ver itens de seus próprios pedidos
CREATE POLICY "Usuários podem ver itens de seus pedidos"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- Usuários podem criar itens para seus próprios pedidos
CREATE POLICY "Usuários podem criar itens para seus pedidos"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Categorias de exemplo
INSERT INTO public.categories (name, description, slug) VALUES
  ('Eletrônicos', 'Produtos eletrônicos e tecnologia', 'eletronicos'),
  ('Roupas', 'Vestuário masculino e feminino', 'roupas'),
  ('Livros', 'Livros e e-books', 'livros'),
  ('Casa', 'Itens para casa e decoração', 'casa'),
  ('Esportes', 'Artigos esportivos', 'esportes')
ON CONFLICT (slug) DO NOTHING;

-- Produtos de exemplo
INSERT INTO public.products (name, description, price, stock, slug, category_id) VALUES
  (
    'Notebook Dell',
    'Notebook Dell Inspiron 15, Intel Core i5, 8GB RAM, 256GB SSD',
    2999.90,
    10,
    'notebook-dell-inspiron-15',
    (SELECT id FROM public.categories WHERE slug = 'eletronicos')
  ),
  (
    'Camiseta Básica',
    'Camiseta 100% algodão, disponível em várias cores',
    49.90,
    50,
    'camiseta-basica',
    (SELECT id FROM public.categories WHERE slug = 'roupas')
  ),
  (
    'O Senhor dos Anéis',
    'Trilogia completa de J.R.R. Tolkien',
    89.90,
    20,
    'senhor-dos-aneis',
    (SELECT id FROM public.categories WHERE slug = 'livros')
  )
ON CONFLICT (slug) DO NOTHING;
