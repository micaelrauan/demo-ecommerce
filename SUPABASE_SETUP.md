# Supabase Setup - Demo E-commerce

Este guia mostra como configurar o banco Supabase para o frontend em Next.js usando o arquivo `supabase-schema.sql`.

## 1. Pre-requisitos

- Conta no Supabase
- Projeto Next.js com dependencias instaladas
- Variaveis de ambiente:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

```

## 2. Criar projeto no Supabase

1. Acesse o dashboard do Supabase.
2. Clique em **New project**.
3. Defina nome, senha do banco e regiao.
4. Aguarde o provisionamento.

## 3. Executar o schema SQL

1. No dashboard, abra **SQL Editor**.
2. Crie uma nova query.
3. Cole todo o conteudo de `supabase-schema.sql`.
4. Execute a query.

O script cria:

- Tabelas: `profiles`, `categories`, `products`, `cart_items`, `orders`, `order_items`
- Triggers para `updated_at`
- Trigger para criar `profiles` automaticamente apos cadastro no Auth
- RLS e policies para usuarios e admin

## 4. Configurar autenticacao

No Supabase, abra **Authentication > Providers** e habilite os metodos desejados (Email/Password, Google etc.).

Observacao: o projeto ja depende de Email/Password em `AuthContext`.

## 5. Criar primeiro usuario admin

1. Cadastre um usuario normalmente na aplicacao (ou via Authentication > Users).
2. Execute no SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'seu-email@dominio.com';
```

## 6. Verificacao rapida

Rode estas consultas no SQL Editor para validar dados:

```sql
select * from public.profiles limit 5;
select * from public.categories limit 5;
select * from public.products limit 5;
select * from public.orders limit 5;
```

## 7. Inserir dados iniciais (opcional)

Exemplo de categoria:

```sql
insert into public.categories (name, slug, description)
values ('Eletronicos', 'eletronicos', 'Produtos de tecnologia');
```

Exemplo de produto:

```sql
insert into public.products (
  name,
  slug,
  description,
  price,
  stock,
  category_id,
  image_url,
  images,
  is_active
)
values (
  'Notebook Gamer X',
  'notebook-gamer-x',
  'Notebook de alta performance',
  7999.90,
  10,
  (select id from public.categories where slug = 'eletronicos' limit 1),
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
  array['https://images.unsplash.com/photo-1496181133206-80ce9b88a853'],
  true
);
```

## 8. Como as permissoes funcionam (RLS)

- Usuarios anonimos podem ler apenas produtos/categorias ativos
- Usuario autenticado acessa e altera apenas seus dados (`profiles`, `cart_items`, `orders`)
- Admin pode gerenciar catalogo e visualizar todos os pedidos

## 9. Troubleshooting

- Erro de permissao em insert/update:
  - Verifique se o usuario esta autenticado
  - Verifique se o `role` esta correto em `public.profiles`
- `profile` nao criado ao registrar:
  - Confirme se o trigger `on_auth_user_created` existe
  - Reexecute `supabase-schema.sql`
- Produtos nao aparecem:
  - Verifique `is_active = true`
  - Confirme se a URL/chave do Supabase no `.env` estao corretas
