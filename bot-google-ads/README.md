# 🤖 Bot Google Ads com IA - Flávia Capacia Corretora

Sistema inteligente de geração automática de anúncios Google Ads usando Mistral AI, análise de dados de imóveis e scraping do blog.

## 🎉 STATUS: 95% COMPLETO

✅ **Implementação finalizada!** Falta apenas obter credenciais do Google Ads.

📖 **Guias de uso:**
- 📋 [CHECKLIST.md](CHECKLIST.md) - Lista de verificação completa
- ⚡ [RESUMO_RAPIDO.md](RESUMO_RAPIDO.md) - Resumo executivo
- 🔑 [GUIA_CREDENCIAIS_GOOGLE_ADS.md](GUIA_CREDENCIAIS_GOOGLE_ADS.md) - Como obter credenciais
- 📊 [STATUS_IMPLEMENTACAO.md](STATUS_IMPLEMENTACAO.md) - Estado detalhado do projeto

## 📋 Visão Geral

Este sistema é composto por três componentes principais:

1. **API Node.js + Express**: Backend que gerencia imóveis, blog e anúncios
2. **Bot Python + FastAPI + Mistral AI**: Motor de IA para gerar e publicar anúncios
3. **Dashboard React**: Interface web para visualizar e gerenciar anúncios

## 🚀 Quick Start

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- Python 3.11+ (para desenvolvimento local)
- Chave da API Mistral (gratuita em https://mistral.ai)
- Acesso ao SQL Server existente

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/flaviacapacia/flaviacapaciacorretora.git
cd flaviacapaciacorretora/bot-google-ads
```

2. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:
```env
MISTRAL_API_KEY=sua_chave_aqui
DB_HOST=seu_host
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
```

3. **Inicie o banco de dados**
```bash
# Execute o script SQL no seu SQL Server
# O script está em: scripts/init_database.sql
```

4. **Inicie os serviços com Docker**
```bash
docker-compose up -d
```

5. **Acesse o dashboard**
```
http://localhost:3000
```

## 🏗️ Estrutura do Projeto

```
bot-google-ads/
├── api/                    # Node.js + Express API
│   ├── src/
│   │   ├── routes/        # Rotas da API
│   │   ├── controllers/   # Lógica de negócio
│   │   ├── config/        # Configurações
│   │   └── app.js         # Entrada da aplicação
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── bot/                    # Python + FastAPI Bot
│   ├── src/
│   │   ├── main.py        # Entrada FastAPI
│   │   ├── ai_engine.py   # Motor Mistral AI
│   │   ├── blog_scraper.py # Web scraping
│   │   ├── database.py    # Conexão SQL Server
│   │   ├── google_ads.py  # Integração Google Ads
│   │   └── routes/        # Rotas FastAPI
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── dashboard/              # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── App.jsx        # App principal
│   │   └── main.jsx       # Entrada React
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── tailwind.config.js
│
├── scripts/
│   └── init_database.sql  # Schema do banco de dados
│
├── docker-compose.yml     # Orquestração Docker
├── .env.example          # Template de variáveis
└── README.md             # Este arquivo
```

## 📡 Endpoints da API

### Imóveis
- `GET /api/imoveis` - Lista todos os imóveis
- `GET /api/imoveis/:id` - Detalhes de um imóvel

### Blog
- `GET /api/blog` - Lista posts do blog (com scraping)
- `GET /api/blog/trends` - Tendências e palavras-chave

### Anúncios
- `POST /api/ads/generate` - Gera anúncios com IA
- `POST /api/ads/preview` - Preview de anúncios
- `POST /api/ads/publish` - Publica no Google Ads (quando credenciais disponíveis)
- `GET /api/ads` - Lista anúncios gerados
- `GET /api/ads/:id` - Detalhes de um anúncio
- `GET /api/ads/:id/performance` - Performance de um anúncio

## 🤖 Funcionalidades do Bot IA

### Geração de Anúncios
O bot analisa:
- **Dados do Imóvel**: localização, tipo, preço, tamanho, amenidades
- **Conteúdo do Blog**: tendências, palavras-chave em alta
- **Mercado**: análise de concorrência e demanda

E gera:
- 5 headlines otimizados (30 caracteres)
- 3 descrições persuasivas (90 caracteres)
- Palavras-chave relevantes
- Sugestões de público-alvo
- Call-to-actions efetivos

### Exemplo de Request
```json
POST /api/ads/generate
{
  "imovel_id": 439,
  "campaign_type": "search",
  "budget": 500
}
```

### Exemplo de Response
```json
{
  "headlines": [
    "Apto 3 Quartos Agronômica",
    "Apartamento Completo Centro",
    "Seu Novo Lar em Floripa",
    "Pronto para Morar - Vista Mar",
    "Investimento Seguro Floripa"
  ],
  "descriptions": [
    "Apartamento moderno com 3 quartos, 2 vagas. Venha conhecer!",
    "Localização privilegiada, próximo a tudo. Agende sua visita.",
    "Melhor custo-benefício da região. Entre em contato agora!"
  ],
  "keywords": [
    "apartamento florianópolis",
    "apartamento agronômica",
    "imóvel 3 quartos",
    "apartamento venda floripa"
  ],
  "audience": {
    "age_range": "25-50",
    "interests": ["Imóveis", "Investimento", "Florianópolis"],
    "location": "Florianópolis e região"
  }
}
```

## 🎨 Dashboard Features

### Tela Principal
- Lista de todos os imóveis cadastrados
- Busca e filtros
- Botão "Criar Anúncio" em cada imóvel

### Tela de Geração
- Preview dos dados do imóvel
- Botão "Gerar Anúncios com IA"
- Visualização das variações geradas
- Edição manual dos anúncios
- Preview visual do anúncio

### Tela de Histórico
- Lista de anúncios criados
- Status (draft, publicado, pausado)
- Métricas de performance
- Filtros por data e status

### Tela de Performance
- Impressões, cliques, CTR
- Custo por clique (CPC)
- Conversões
- Gráficos de evolução

## 🔐 Segurança

- Validação de entrada em todos os endpoints
- Rate limiting nas requisições à API
- Proteção contra SQL injection
- Sanitização de dados do scraping
- CORS configurado corretamente

## 🧪 Desenvolvimento Local

### API (Node.js)
```bash
cd api
npm install
npm run dev
```

### Bot (Python)
```bash
cd bot
pip install -r requirements.txt
uvicorn src.main:app --reload
```

### Dashboard (React)
```bash
cd dashboard
npm install
npm run dev
```

## 📦 Tecnologias Utilizadas

### Backend
- Node.js 18
- Express.js
- axios
- mssql (SQL Server)
- cors
- dotenv

### Bot IA
- Python 3.11
- FastAPI
- mistralai (Mistral AI SDK)
- pyodbc (SQL Server)
- beautifulsoup4 (Web scraping)
- requests
- pydantic

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Infraestrutura
- Docker
- Docker Compose
- SQL Server

## 🔄 Próximos Passos

### Fase 1 (Atual) ✅
- [x] Sistema completo funcionando
- [x] Geração de anúncios com IA
- [x] Dashboard para visualização
- [x] Preview de anúncios

### Fase 2 (Quando tiver credenciais Google Ads)
- [ ] Autenticação OAuth2 Google Ads
- [ ] Publicação real de anúncios
- [ ] Sincronização de métricas
- [ ] A/B testing automático

### Fase 3 (Melhorias futuras)
- [ ] Agendamento de publicações
- [ ] Otimização automática de budget
- [ ] Relatórios avançados
- [ ] Notificações por email/SMS

## 🐛 Troubleshooting

### Erro: "Cannot connect to SQL Server"
- Verifique se o SQL Server está acessível
- Confirme as credenciais no `.env`
- Verifique firewall e portas

### Erro: "Mistral API Key invalid"
- Obtenha uma chave válida em https://mistral.ai
- Copie a chave corretamente no `.env`
- Reinicie os containers

### Dashboard não carrega
- Verifique se a API está rodando na porta 3001
- Confirme o CORS na API
- Limpe o cache do navegador

## 📞 Suporte

Para dúvidas ou problemas:
- Email: contato@flaviacapaciacorretora.com
- Website: https://www.flaviacapaciacorretora.com

## 📄 Licença

Este projeto é privado e proprietário de Flávia Capacia Corretora.

---

**Desenvolvido com ❤️ para revolucionar o marketing imobiliário em Florianópolis**
