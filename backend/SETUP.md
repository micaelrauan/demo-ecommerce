# 🚀 Setup Rápido do Backend

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## Passos para rodar

### 1. Instalar PostgreSQL

#### Windows

Baixe em: https://www.postgresql.org/download/windows/

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### macOS

```bash
brew install postgresql
brew services start postgresql
```

### 2. Criar o Banco de Dados

```bash
# Acessar o PostgreSQL
psql -U postgres

# Criar o banco
CREATE DATABASE ecommerce;

# Sair
\q
```

### 3. Configurar o Backend

```bash
# Navegar para a pasta backend
cd backend

# Instalar dependências
npm install

# As variáveis de ambiente estão no .env da raiz do projeto
# Edite ../.env se necessário
```

### 4. Rodar o Backend

```bash
npm run start:dev
```

O servidor estará rodando em: http://localhost:3001
API disponível em: http://localhost:3001/api

## ✅ Testar a API

### Criar um usuário

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@email.com",
    "password": "123456"
  }'
```

### Fazer login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "123456"
  }'
```

## 🐛 Problemas Comuns

### Erro de conexão com o banco

- Verifique se o PostgreSQL está rodando: `sudo systemctl status postgresql`
- Verifique as credenciais no `.env` da raiz do projeto
- Teste a conexão: `psql -U postgres -d ecommerce`

### Porta 3001 já em uso

Altere a variável `PORT` no arquivo `.env`

### Erro de módulos

Execute: `npm install` novamente na pasta backend

## 📊 Estrutura do Banco

O TypeORM criará automaticamente as tabelas:

- users
- categories
- products
- orders
- order_items
- cart_items

## 🔄 Resetar o Banco

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Dropar e recriar o banco
DROP DATABASE ecommerce;
CREATE DATABASE ecommerce;
```

Depois reinicie o backend para recriar as tabelas.
