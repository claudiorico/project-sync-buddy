# InvestPro Vault

Aplicação web SPA para gestão completa de carteira de investimentos no mercado brasileiro, com foco em privacidade total dos dados financeiros.

## Funcionalidades

- **Dashboard** — visão geral do patrimônio com gráficos de evolução, alocação por ativo, histórico de dividendos e métricas de rentabilidade (ganho total, variação do dia)
- **Gestão de portfólios** — cadastro de múltiplas carteiras com ativos, transações de compra/venda e movimentações de caixa
- **Analytics** — gráficos históricos de preço por ticker e evolução do patrimônio mês a mês
- **Dividendos** — controle de proventos recebidos por ativo e período
- **Imposto de Renda** — cálculo automático de DARF mensal com apuração de ganho de capital, diferenciando operações normais, day trade e isenções (vendas até R$ 20.000/mês)
- **Rebalanceamento** — calculadora que indica quantas cotas comprar/vender para atingir a alocação-alvo ao aportar um novo valor
- **Backup & Sync** — exportação manual em arquivo `.vault` e sincronização automática com Google Drive

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + TypeScript + Vite + shadcn/ui + Tailwind |
| Autenticação | Firebase Auth (Google Sign-In) |
| Armazenamento local | IndexedDB com criptografia AES-256 (zero-knowledge) |
| Cotações em tempo real | Supabase Edge Functions (Deno) como proxy CORS para APIs financeiras |
| Backup na nuvem | Google Drive API — `appDataFolder` (invisível ao usuário no Drive) |
| Deploy | GitHub Actions → GitHub Pages |

## Destaques técnicos

- **Zero-knowledge**: todos os dados financeiros ficam criptografados no dispositivo do usuário — nem o servidor nem o Google têm acesso ao conteúdo
- **Sync inteligente**: o token OAuth do Google é renovado silenciosamente em background via Google Identity Services; popup só abre quando estritamente necessário
- **Funções serverless**: edge functions no Supabase resolvem CORS e centralizam as chamadas às APIs de cotações sem expor chaves no cliente
- **CI/CD completo**: build automatizado com injeção de variáveis de ambiente via GitHub Environments Secrets

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

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```
