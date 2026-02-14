# 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUÁRIO (Corretor)                          │
│                   Acessa via Navegador Web                          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DASHBOARD REACT                                │
│                   http://localhost:3000                             │
│                                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐              │
│  │   Imóveis   │  │   Gerar      │  │  Anúncios   │              │
│  │   Listagem  │  │   Anúncios   │  │  Histórico  │              │
│  └─────────────┘  └──────────────┘  └─────────────┘              │
│                                                                     │
│  Tecnologias: React 18, Vite, Tailwind CSS, React Router          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ HTTP/REST
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NODE.JS API (Express)                            │
│                   http://localhost:3001                             │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │GET /imoveis  │  │POST /ads/    │  │GET /ads      │            │
│  │GET /blog     │  │  generate    │  │GET /ads/:id  │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
│  Tecnologias: Express, CORS, Helmet, Rate Limiting                │
└────────┬─────────────────────────────────────┬─────────────────────┘
         │                                     │
         │ SQL                                 │ HTTP/REST
         │                                     │
         ▼                                     ▼
┌──────────────────┐           ┌────────────────────────────────────┐
│   SQL SERVER     │           │     PYTHON BOT (FastAPI)           │
│                  │           │   http://localhost:8000            │
│ ┌──────────────┐ │           │                                    │
│ │  Imoveis     │ │           │  ┌─────────────────────────────┐  │
│ │  Ads         │ │◄──────────┤  │  AI Engine (Mistral AI)     │  │
│ │  AdPerform.  │ │           │  │  - Análise de dados         │  │
│ │  BlogPosts   │ │           │  │  - Geração de headlines     │  │
│ └──────────────┘ │           │  │  - Geração de descriptions  │  │
│                  │           │  │  - Keywords otimizadas      │  │
│  Views, SPs,     │           │  └─────────────────────────────┘  │
│  Triggers        │           │                                    │
└──────────────────┘           │  ┌─────────────────────────────┐  │
                               │  │  Blog Scraper               │  │
                               │  │  - Web scraping do blog     │  │
                               │  │  - Extração de keywords     │  │
                               │  │  - Análise de tendências    │  │
                               │  └─────────────────────────────┘  │
                               │                                    │
                               │  ┌─────────────────────────────┐  │
                               │  │  Google Ads Integration     │  │
                               │  │  - Publicação de anúncios   │  │
                               │  │  - (Modo preview por ora)   │  │
                               │  └─────────────────────────────┘  │
                               │                                    │
                               │  Tecnologias: FastAPI, Mistral AI, │
                               │  BeautifulSoup, PyODBC             │
                               └────────────────────────────────────┘
                                              │
                                              │ HTTPS
                                              ▼
                               ┌────────────────────────────────────┐
                               │      SERVIÇOS EXTERNOS             │
                               │                                    │
                               │  ┌──────────────────────────────┐ │
                               │  │  Mistral AI API              │ │
                               │  │  - Processamento de IA       │ │
                               │  │  - Geração de texto          │ │
                               │  └──────────────────────────────┘ │
                               │                                    │
                               │  ┌──────────────────────────────┐ │
                               │  │  Blog Website                │ │
                               │  │  - Scraping de posts         │ │
                               │  │  - Análise de tendências     │ │
                               │  └──────────────────────────────┘ │
                               │                                    │
                               │  ┌──────────────────────────────┐ │
                               │  │  Google Ads API (futuro)     │ │
                               │  │  - Publicação real           │ │
                               │  │  - Métricas de performance   │ │
                               │  └──────────────────────────────┘ │
                               └────────────────────────────────────┘
```

## 🔄 Fluxo de Dados - Geração de Anúncio

```
1. USUÁRIO                 2. DASHBOARD              3. API NODE.JS
   │                          │                         │
   │ Clica "Criar Anúncio"    │                         │
   │──────────────────────────>│                         │
   │                          │ POST /api/ads/generate  │
   │                          │──────────────────────────>│
   │                          │                         │
   │                          │                         │
                                                        │
4. BOT PYTHON              5. MISTRAL AI              6. BLOG
   │                          │                         │
   │<─────────────────────────┤ Busca dados imóvel     │
   │                          │                         │
   │ Faz scraping do blog     │                         │
   │──────────────────────────────────────────────────>│
   │<──────────────────────────────────────────────────┤
   │ Recebe posts + keywords  │                         │
   │                          │                         │
   │ Envia dados para IA      │                         │
   │──────────────────────────>│                         │
   │                          │ Processa e gera         │
   │                          │ - Headlines             │
   │                          │ - Descriptions          │
   │                          │ - Keywords              │
   │                          │ - Audience              │
   │<──────────────────────────┤                         │
   │ Recebe anúncios gerados  │                         │
   │                          │                         │
   │──────────────────────────>│                         │
                              │                         │
7. SQL SERVER              8. API NODE.JS           9. DASHBOARD
   │                          │                         │
   │<─────────────────────────┤ Salva no banco         │
   │ INSERT INTO Ads          │                         │
   │──────────────────────────>│                         │
   │                          │ Retorna anúncios       │
   │                          │──────────────────────────>│
   │                          │                         │
   │                          │                         │
                                                        │
10. USUÁRIO                                            │
    │<──────────────────────────────────────────────────┤
    │ Visualiza anúncios gerados                       │
    │ - Headlines                                      │
    │ - Descriptions                                   │
    │ - Keywords                                       │
    │ - Público-alvo                                   │
```

## 🎯 Componentes e Responsabilidades

### Frontend (React Dashboard)
- ✅ Interface amigável para o usuário
- ✅ Navegação entre páginas
- ✅ Formulários e validações
- ✅ Exibição de dados em tempo real
- ✅ Feedback visual (loading, sucesso, erro)

### Backend API (Node.js)
- ✅ Gerenciamento de requisições HTTP
- ✅ Validação de entrada
- ✅ Comunicação com banco de dados
- ✅ Integração com o bot Python
- ✅ Rate limiting e segurança

### Bot IA (Python)
- ✅ Processamento de IA com Mistral
- ✅ Web scraping do blog
- ✅ Análise de tendências
- ✅ Geração de conteúdo otimizado
- ✅ Integração Google Ads (preparado)

### Banco de Dados (SQL Server)
- ✅ Armazenamento persistente
- ✅ Relacionamentos entre dados
- ✅ Views para consultas otimizadas
- ✅ Triggers para atualizações automáticas
- ✅ Stored procedures para operações complexas

## 🔒 Segurança

- ✅ Validação de entrada em todos os endpoints
- ✅ Rate limiting para prevenir abuso
- ✅ Helmet.js para headers de segurança
- ✅ CORS configurado adequadamente
- ✅ Sanitização de dados do scraping
- ✅ Credenciais em arquivos .env (não commitados)
- ✅ SQL parametrizado (previne SQL injection)

## 📈 Escalabilidade

- ✅ Containerização com Docker
- ✅ Stateless design (fácil horizontal scaling)
- ✅ Connection pooling no banco de dados
- ✅ Cache de posts do blog
- ✅ API assíncrona (FastAPI)
- ✅ Processamento paralelo possível

## 🔄 Integração Futura - Google Ads

```
Quando credenciais estiverem disponíveis:

DASHBOARD → API → BOT → GOOGLE ADS API
                          │
                          ├─ Criar Campanha
                          ├─ Criar Ad Group
                          ├─ Criar Ads
                          ├─ Adicionar Keywords
                          └─ Definir Budget
                          
                          ↓
                          
                     Anúncio Publicado
                          │
                          ↓
                          
                  Coletar Métricas Daily
                          │
                          ├─ Impressões
                          ├─ Cliques
                          ├─ CTR
                          ├─ Custo
                          └─ Conversões
                          
                          ↓
                          
                  Salvar em AdPerformance
                          │
                          ↓
                          
                  Exibir no Dashboard
```
