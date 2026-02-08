# 🛍️ E-commerce Template - Full Stack

Sistema completo de e-commerce com Next.js + Supabase.
Backend NestJS opcional disponível.

## 📁 Estrutura do Projeto

```
ecommerce-template/
├── src/                    # Frontend Next.js
│   ├── app/               # App Router do Next.js
│   ├── components/        # Componentes React
│   ├── contexts/          # Context API (Auth, etc)
│   └── lib/               # Supabase client e helpers
│
├── backend/               # Backend NestJS (OPCIONAL)
│   └── src/              # API alternativa ao Supabase
│
├── supabase-schema.sql    # Schema completo do banco
├── public/                # Arquivos estáticos
└── README.md
```

## 🚀 Tecnologias

### Stack Principal (Recomendado)

- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização moderna
- **Supabase** - Backend completo (Auth + Database + Storage + RLS)
  - PostgreSQL como banco de dados
  - Row Level Security (RLS) para segurança
  - Realtime subscriptions
  - Auth integrado (email, OAuth, etc)
- **Context API** - Gerenciamento de estado

### Backend Alternativo (Opcional)

Caso prefira um backend customizado ao invés do Supabase:

- **NestJS** - Framework Node.js
- **TypeORM** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Criptografia

## ⚙️ Configuração e Instalação

### Método 1: Com Supabase (Recomendado) ⭐

A forma mais rápida e moderna de começar:

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
```

**3. Configurar Supabase:**

1. Crie uma conta gratuita em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie URL e chave anônima para o `.env`
4. Execute o SQL do arquivo `supabase-schema.sql` no SQL Editor do Supabase

📖 Veja o guia completo em [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

```bash
# 4. Rodar o projeto
npm run dev
```

✅ Pronto! Seu e-commerce está rodando em `http://localhost:3000`

**O que você tem agora:**

- ✅ Autenticação completa (login, cadastro, recuperação de senha)
- ✅ Banco de dados PostgreSQL com RLS
- ✅ Tabelas: usuários, produtos, categorias, carrinho, pedidos
- ✅ APIs automáticas para CRUD
- ✅ Segurança com Row Level Security

### Método 2: Com Backend NestJS (Alternativo)

Caso prefira ter controle total do backend:

**1. Configurar PostgreSQL local:**

```bash
# Instalar PostgreSQL e criar banco
createdb ecommerce
```

**2. Configurar variáveis no `.env`:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=ecommerce
JWT_SECRET=sua-chave-secreta
```

**3. Rodar backend:**

```bash
cd backend
npm install
npm run start:dev
```

**4. Rodar frontend:**

```bash
# Em outro terminal
npm run dev
```

⚠️ **Nota:** Com esta opção, você precisará gerenciar duas aplicações (frontend + backend)

## 🎨 Funcionalidades

### Interface (Frontend)

- ✅ **Navbar responsiva** com auto-hide ao scroll
- ✅ **Design minimalista** preto e branco com tipografia elegante
- ✅ **Carrossel de promoções** no topo
- ✅ **Sistema de autenticação** completo (Login/Cadastro/Recuperação)
- ✅ **Página de conta** do usuário
- ✅ **Proteção de rotas** automática
- ✅ **Persistência de sessão**

### Backend (Supabase)

- ✅ **Autenticação completa**
  - Email/Senha
  - OAuth (Google, GitHub, etc) - configurável
  - Recuperação de senha
  - Email de confirmação
- ✅ **Banco de dados PostgreSQL**
  - Perfis de usuário
  - Produtos e categorias
  - Carrinho de compras
  - Pedidos e histórico
- ✅ **Segurança com RLS** (Row Level Security)
- ✅ **APIs automáticas** para todas as tabelas
- ✅ **Realtime** (opcional para updates em tempo real)
- ✅ **Storage** para imagens de produtos

### Backend Alternativo (NestJS - Opcional)

Caso opte pelo backend customizado:

- ✅ Autenticação JWT
- ✅ CRUD completo (Usuários, Produtos, Categorias, Carrinho, Pedidos)
- ✅ Validação de dados com class-validator
- ✅ Guards e decorators customizados

## 🔐 Variáveis de Ambiente

### Com Supabase (Recomendado)

```env
# Obrigatório - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Com Backend NestJS (Opcional)

Se optar pelo backend customizado, adicione também:

```env
# Backend - Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=ecommerce

# Backend - JWT
JWT_SECRET=sua-chave-secreta
JWT_EXPIRATION=7d

# Backend - API
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📚 Documentação

- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Guia completo de configuração do Supabase
- **[supabase-schema.sql](supabase-schema.sql)** - Schema completo do banco de dados
- **[backend/SETUP.md](backend/SETUP.md)** - Guia do backend NestJS (opcional)

## 🎯 Por que Supabase?

- ✅ **Setup em minutos** vs horas configurando backend
- ✅ **Gratuito** até 500MB de banco e 50k usuários/mês
- ✅ **Segurança nativa** com RLS e autenticação integrada
- ✅ **Escalável** - da prototipação à produção
- ✅ **APIs automáticas** - CRUD sem escrever código
- ✅ **Realtime** - updates em tempo real
- ✅ **Storage** - upload de imagens integrado
- ✅ **Dashboard** - gerenciar dados visualmente

## 🚀 Próximos Passos

Depois de configurar o projeto:

1. ✅ Personalize o design em `src/app/globals.css`
2. ✅ Adicione mais produtos no Supabase
3. ✅ Configure OAuth (Google, GitHub) no dashboard do Supabase
4. ✅ Adicione páginas de produto e checkout
5. ✅ Configure domain customizado
6. ✅ Implante na Vercel (integração automática com Supabase)

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.
