# Backend E-commerce NestJS

API REST para sistema de e-commerce construída com NestJS, TypeORM e PostgreSQL.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Class Validator** - Validação de dados

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar .env.example para .env
cp .env.example .env

# Configurar as variáveis de ambiente no arquivo .env
```

## ⚙️ Configuração do Banco de Dados

1. Instale o PostgreSQL
2. Crie um banco de dados chamado `ecommerce`
3. Configure as credenciais no arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=ecommerce

JWT_SECRET=sua-chave-secreta-muito-segura-aqui
JWT_EXPIRATION=7d

PORT=3001
FRONTEND_URL=http://localhost:3000
```

## 🏃 Executando

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

O servidor estará rodando em `http://localhost:3001`

## 📚 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout (requer autenticação)
- `POST /api/auth/validate` - Validar token (requer autenticação)

### Usuários

- `GET /api/users/profile` - Perfil do usuário logado
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário
- `PATCH /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Produtos

- `GET /api/products` - Listar produtos
- `GET /api/products/featured` - Produtos em destaque
- `GET /api/products?categoryId=uuid` - Produtos por categoria
- `GET /api/products/:id` - Buscar produto
- `POST /api/products` - Criar produto (requer autenticação)
- `PATCH /api/products/:id` - Atualizar produto (requer autenticação)
- `DELETE /api/products/:id` - Deletar produto (requer autenticação)

### Categorias

- `GET /api/categories` - Listar categorias
- `GET /api/categories/:id` - Buscar categoria
- `POST /api/categories` - Criar categoria (requer autenticação)
- `PATCH /api/categories/:id` - Atualizar categoria (requer autenticação)
- `DELETE /api/categories/:id` - Deletar categoria (requer autenticação)

### Carrinho

- `GET /api/cart` - Ver carrinho (requer autenticação)
- `POST /api/cart` - Adicionar item (requer autenticação)
- `PATCH /api/cart/:id` - Atualizar quantidade (requer autenticação)
- `DELETE /api/cart/:id` - Remover item (requer autenticação)
- `DELETE /api/cart` - Limpar carrinho (requer autenticação)

### Pedidos

- `GET /api/orders` - Listar pedidos do usuário (requer autenticação)
- `GET /api/orders/:id` - Buscar pedido (requer autenticação)
- `POST /api/orders` - Criar pedido (requer autenticação)
- `PATCH /api/orders/:id` - Atualizar status (requer autenticação)
- `DELETE /api/orders/:id` - Cancelar pedido (requer autenticação)

## 🔐 Autenticação

A API usa JWT Bearer Token. Para endpoints protegidos, inclua o header:

```
Authorization: Bearer seu_token_jwt_aqui
```

## 📝 Estrutura do Projeto

```
backend/
├── src/
│   ├── auth/           # Autenticação e autorização
│   ├── users/          # Gerenciamento de usuários
│   ├── products/       # Gerenciamento de produtos
│   ├── categories/     # Categorias de produtos
│   ├── cart/           # Carrinho de compras
│   ├── orders/         # Pedidos
│   ├── app.module.ts   # Módulo principal
│   └── main.ts         # Entry point
├── .env.example        # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Modelos do Banco de Dados

### User (Usuário)

- id, name, email, password, phone, cpf, isActive, createdAt, updatedAt

### Category (Categoria)

- id, name, description, image, isActive, createdAt, updatedAt

### Product (Produto)

- id, name, description, price, stock, images, sku, isActive, isFeatured, categoryId, createdAt, updatedAt

### Order (Pedido)

- id, userId, total, status, shippingAddress, trackingCode, createdAt, updatedAt

### OrderItem (Item do Pedido)

- id, orderId, productId, quantity, price, subtotal

### CartItem (Item do Carrinho)

- id, userId, productId, quantity, createdAt, updatedAt

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📄 Licença

MIT
