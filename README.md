# InvestPro Vault

Gestão de carteiras de investimentos com armazenamento local criptografado e backup no Google Drive.

## Tecnologias

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Firebase Auth (autenticação)
- IndexedDB (armazenamento local criptografado — zero-knowledge)
- Google Drive (backup)
- Supabase Edge Functions (cotações de ativos)

## Desenvolvimento local

```sh
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## Build

```sh
npm run build
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com as variáveis necessárias (veja `.env.example` se existir).
