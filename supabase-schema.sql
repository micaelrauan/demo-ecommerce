-- =====================================================
-- SUPABASE SCHEMA - DEMO E-COMMERCE
-- =====================================================
-- Este script cria:
-- 1) Tabelas e relacionamentos
-- 2) Índices
-- 3) Triggers (updated_at e criação de profile)
-- 4) Funções auxiliares
-- 5) RLS (Row Level Security) e políticas

begin;

create extension if not exists pgcrypto;

-- =====================================================
-- TABELAS
-- =====================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  phone text,
  cpf text,
  role text not null default 'cliente' check (role in ('admin', 'cliente')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  slug text not null unique,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  category_id uuid references public.categories (id) on delete set null,
  image_url text,
  images text[] not null default '{}'::text[],
  slug text not null unique,
  sku text unique,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled')),
  total numeric(10,2) not null check (total >= 0),
  shipping_address_street text not null,
  shipping_address_number text not null,
  shipping_address_complement text,
  shipping_address_neighborhood text not null,
  shipping_address_city text not null,
  shipping_address_state text not null,
  shipping_address_zipcode text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price numeric(10,2) not null check (price >= 0),
  subtotal numeric(10,2) generated always as (price * quantity) stored,
  created_at timestamptz not null default now(),
  unique (order_id, product_id)
);

-- =====================================================
-- INDICES
-- =====================================================

create index if not exists idx_profiles_role on public.profiles (role);

create index if not exists idx_categories_slug on public.categories (slug);
create index if not exists idx_categories_active on public.categories (is_active);

create index if not exists idx_products_slug on public.products (slug);
create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_active on public.products (is_active);
create index if not exists idx_products_featured on public.products (is_featured);
create index if not exists idx_products_created_at on public.products (created_at desc);

create index if not exists idx_cart_items_user_id on public.cart_items (user_id);
create index if not exists idx_cart_items_product_id on public.cart_items (product_id);

create index if not exists idx_orders_user_id on public.orders (user_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_created_at on public.orders (created_at desc);

create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_items_product_id on public.order_items (product_id);

-- =====================================================
-- FUNCOES E TRIGGERS
-- =====================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = user_id
      and p.role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1), 'Usuario'),
    new.email
  )
  on conflict (id) do update
    set name = excluded.name,
        email = excluded.email,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_categories_set_updated_at on public.categories;
create trigger trg_categories_set_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

drop trigger if exists trg_products_set_updated_at on public.products;
create trigger trg_products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists trg_cart_items_set_updated_at on public.cart_items;
create trigger trg_cart_items_set_updated_at
before update on public.cart_items
for each row
execute function public.set_updated_at();

drop trigger if exists trg_orders_set_updated_at on public.orders;
create trigger trg_orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- =====================================================
-- RLS
-- =====================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles

drop policy if exists "Profiles select own or admin" on public.profiles;
create policy "Profiles select own or admin"
on public.profiles
for select
using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Profiles update own or admin" on public.profiles;
create policy "Profiles update own or admin"
on public.profiles
for update
using (id = auth.uid() or public.is_admin(auth.uid()))
with check (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Profiles insert self or admin" on public.profiles;
create policy "Profiles insert self or admin"
on public.profiles
for insert
with check (id = auth.uid() or public.is_admin(auth.uid()));

-- Categories (public read, admin write)

drop policy if exists "Categories public read active" on public.categories;
create policy "Categories public read active"
on public.categories
for select
to anon, authenticated
using (is_active = true or public.is_admin(auth.uid()));

drop policy if exists "Categories admin insert" on public.categories;
create policy "Categories admin insert"
on public.categories
for insert
to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists "Categories admin update" on public.categories;
create policy "Categories admin update"
on public.categories
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Categories admin delete" on public.categories;
create policy "Categories admin delete"
on public.categories
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- Products (public read active, admin write)

drop policy if exists "Products public read active" on public.products;
create policy "Products public read active"
on public.products
for select
to anon, authenticated
using (is_active = true or public.is_admin(auth.uid()));

drop policy if exists "Products admin insert" on public.products;
create policy "Products admin insert"
on public.products
for insert
to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists "Products admin update" on public.products;
create policy "Products admin update"
on public.products
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Products admin delete" on public.products;
create policy "Products admin delete"
on public.products
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- Cart items (somente dono)

drop policy if exists "Cart select own" on public.cart_items;
create policy "Cart select own"
on public.cart_items
for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Cart insert own" on public.cart_items;
create policy "Cart insert own"
on public.cart_items
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Cart update own" on public.cart_items;
create policy "Cart update own"
on public.cart_items
for update
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Cart delete own" on public.cart_items;
create policy "Cart delete own"
on public.cart_items
for delete
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- Orders (usuário ve e cria os seus; admin ve e altera todos)

drop policy if exists "Orders select own or admin" on public.orders;
create policy "Orders select own or admin"
on public.orders
for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Orders insert own" on public.orders;
create policy "Orders insert own"
on public.orders
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Orders update own or admin" on public.orders;
create policy "Orders update own or admin"
on public.orders
for update
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- Order items (visibilidade por dono do pedido; admin full)

drop policy if exists "Order items select own or admin" on public.order_items;
create policy "Order items select own or admin"
on public.order_items
for select
to authenticated
using (
  public.is_admin(auth.uid())
  or exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.user_id = auth.uid()
  )
);

drop policy if exists "Order items insert own or admin" on public.order_items;
create policy "Order items insert own or admin"
on public.order_items
for insert
to authenticated
with check (
  public.is_admin(auth.uid())
  or exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.user_id = auth.uid()
  )
);

drop policy if exists "Order items update admin only" on public.order_items;
create policy "Order items update admin only"
on public.order_items
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Order items delete admin only" on public.order_items;
create policy "Order items delete admin only"
on public.order_items
for delete
to authenticated
using (public.is_admin(auth.uid()));

commit;
