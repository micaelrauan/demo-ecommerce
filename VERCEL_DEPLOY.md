# Deploy no Vercel - Guia Prático

Este projeto está pronto para ser deployado no Vercel. Siga os passos abaixo:

## Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- GitHub conectado ao Vercel (ou repositório remoto configurado)
- Variáveis de ambiente configuradas

## Como Fazer Deploy

### 1. Via CLI do Vercel (Recomendado para desenvolvimento)

```bash
# Instalar a CLI do Vercel globalmente (se ainda não tem)
npm install -g vercel

# Fazer deploy
vercel
```

### 2. Via GitHub (Recomendado para produção)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Conecte seu repositório GitHub
4. Selecione este projeto (`conde-semijoias`)
5. Configure as variáveis de ambiente (ver seção abaixo)
6. Clique em "Deploy"

## Variáveis de Ambiente no Vercel

No painel do Vercel, configure as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://ciheewdlnjxfgwqxzkhv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-chave-anonima]
NEXT_PUBLIC_API_URL=[sua-api-url]
```

### Para Desenvolvimento

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Para Produção

```
NEXT_PUBLIC_API_URL=https://seu-api-domain.com/api
```

## Informações de Build

- **Framework:** Next.js 16.2.1 (Turbopack)
- **Script de Build:** `npm run build`
- **Output:** `.next/`
- **Node:** Recomendado v18+

## Checklist Pré-Deploy

✅ Build local funciona (`npm run build`)
✅ Variáveis de ambiente configuradas (`.env`)
✅ TypeScript sem erros
✅ Branding CONDE SEMIJOIAS aplicado
✅ Logo do hero carousel funcionando
✅ Metadata configurada

## URLs Após Deploy

- **Preview:** `https://[seu-projeto].vercel.app`
- **Production:** `https://seu-dominio.com` (após configurar custom domain)

## Troubleshooting

### Build falha

- Verificar que `backend/` está excluído do TypeScript (`tsconfig.json`)
- Limpar cache local: `rm -rf .next node_modules` e `npm install`

### Página em branco

- Verificar variáveis de ambiente no Vercel
- Verificar console do navegador (F12) para erros

### API não conecta

- Verificar `NEXT_PUBLIC_API_URL` está correta
- Verificar CORS no backend

## Próximos Passos

1. Deploy no Vercel
2. Testar todas as rotas: `/`, `/produtos`, `/admin`, `/login`
3. Testar funcionalidade de carrinho
4. Verificar responsive design
5. Testar em diferentes browsers

## Suporte

Para mais informações sobre deploy no Vercel, visite:
https://vercel.com/docs/framework-guides/nextjs
