# 🤖 Bot Google Ads com IA - Sistema Completo

> Sistema inteligente de geração automática de anúncios para Google Ads usando Inteligência Artificial (Mistral)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED.svg)](https://www.docker.com/)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Documentação](#-documentação)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

Bot inteligente que utiliza **Mistral AI** para gerar anúncios otimizados para Google Ads automaticamente. O sistema analisa dados de imóveis e conteúdo do blog para criar campanhas personalizadas com alta taxa de conversão.

### 💡 Problema que Resolve

- ⏱️ **Economiza tempo:** Gera múltiplos anúncios em segundos
- 🎯 **Aumenta eficácia:** Anúncios otimizados com IA
- 📊 **Analisa mercado:** Web scraping do blog para tendências
- 🔄 **Escalável:** Automatiza processo de criação de campanhas
- 💰 **ROI melhor:** Anúncios mais relevantes = mais conversões

---

## ✨ Funcionalidades

### 🤖 Geração Automática com IA
- ✅ 5 headlines únicos (máx. 30 caracteres)
- ✅ 3 descriptions otimizadas (máx. 90 caracteres)
- ✅ 10-15 keywords relevantes
- ✅ Definição de público-alvo
- ✅ Análise de mercado integrada

### 📊 Análise Inteligente
- ✅ Web scraping do blog da imobiliária
- ✅ Identificação de palavras-chave em alta
- ✅ Análise de tendências de mercado
- ✅ Extração automática de insights

### 🎨 Dashboard Moderno
- ✅ Interface React responsiva
- ✅ Listagem visual de imóveis
- ✅ Preview de anúncios gerados
- ✅ Histórico de campanhas
- ✅ Métricas de performance

### 🔌 API REST Completa
- ✅ Endpoints para imóveis
- ✅ Endpoints para blog
- ✅ Endpoints para anúncios
- ✅ Integração SQL Server
- ✅ Documentação OpenAPI

---

## 🛠️ Tecnologias

### Backend

**Node.js API**
- Express.js 4.18+
- Axios para HTTP
- MSSQL para SQL Server
- CORS e Helmet para segurança

**Python Bot**
- FastAPI para API assíncrona
- Mistral AI para geração de conteúdo
- BeautifulSoup4 para web scraping
- PyODBC para SQL Server

### Frontend

- React 18+
- Vite para build
- Tailwind CSS para estilização
- React Router para navegação
- Axios para requisições

### Infraestrutura

- Docker & Docker Compose
- SQL Server (Azure SQL Database compatível)
- Nginx (opcional para produção)

---

## 🏗️ Arquitetura

```
┌─────────────────┐
│  React Dashboard│
│   (Port 3000)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐      ┌──────────────────┐
│  Node.js API    │←────→│  Python Bot      │
│   (Port 3001)   │      │  + Mistral AI    │
└────────┬────────┘      │   (Port 8000)    │
         │               └──────────────────┘
         ↓
┌─────────────────┐      ┌──────────────────┐
│  SQL Server DB  │      │  Blog Scraping   │
│   (Port 1433)   │      │  (External)      │
└─────────────────┘      └──────────────────┘
```

### Componentes

1. **API Node.js** - Gateway principal, gerencia dados
2. **Bot Python** - IA e processamento inteligente
3. **Dashboard React** - Interface visual para usuário
4. **SQL Server** - Armazenamento persistente
5. **Blog Scraper** - Coleta de dados para análise

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ e npm
- Python 3.9+
- Docker e Docker Compose (recomendado)
- SQL Server (ou Azure SQL Database)
- Conta Mistral AI (chave API gratuita)

### Opção 1: Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/flaviacapacia/bot-google-ads-ia.git
cd bot-google-ads-ia

# Configure variáveis de ambiente
cp .env.example .env
nano .env  # Configure MISTRAL_API_KEY e credenciais SQL

# Suba os containers
docker-compose up -d

# Acesse o dashboard
open http://localhost:3000
```

### Opção 2: Instalação Manual

#### 1. API Node.js

```bash
cd api
npm install
cp .env.example .env
# Configure .env com credenciais
npm start
```

#### 2. Bot Python

```bash
cd bot
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Configure .env com MISTRAL_API_KEY
python src/main.py
```

#### 3. Dashboard React

```bash
cd dashboard
npm install
cp .env.example .env
npm run dev
```

#### 4. Banco de Dados

```bash
# Execute o script de inicialização
sqlcmd -S seu_servidor -d seu_banco -U usuario -P senha -i scripts/init_database.sql
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie arquivo `.env` na raiz com:

```env
# Mistral AI (OBRIGATÓRIO)
MISTRAL_API_KEY=sua_chave_mistral_aqui

# SQL Server
DB_HOST=seu_host_sql_server
DB_PORT=1433
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco

# URLs
BLOG_URL=https://www.flaviacapaciacorretora.com/blog
SITE_URL=https://www.flaviacapaciacorretora.com

# Portas (opcional)
API_PORT=3001
BOT_PORT=8000
DASHBOARD_PORT=3000

# Google Ads (opcional - para produção)
GOOGLE_ADS_CUSTOMER_ID=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_LOGIN_CUSTOMER_ID=
```

### Obter Chave Mistral AI

1. Acesse: https://console.mistral.ai/
2. Crie conta gratuita
3. Vá para API Keys
4. Gere nova chave
5. Cole no `.env`

---

## 🚀 Como Usar

### 1. Iniciar Sistema

```bash
# Com Docker
docker-compose up -d

# Sem Docker
./start.sh  # Linux/Mac
# ou start.bat no Windows
```

### 2. Acessar Dashboard

Abra navegador em: http://localhost:3000

### 3. Gerar Anúncios

1. **Selecione imóvel** na lista
2. **Clique em "Gerar Anúncio"**
3. **Aguarde** (10-30 segundos)
4. **Revise** anúncios gerados
5. **Publique** ou salve como rascunho

### 4. APIs Disponíveis

**Node.js API (3001):**
- `GET /api/imoveis` - Lista imóveis
- `GET /api/imoveis/:id` - Detalhes do imóvel
- `GET /api/blog` - Posts do blog
- `POST /api/ads/generate` - Gera anúncio
- `POST /api/ads/preview` - Preview antes de publicar
- `GET /api/ads` - Lista anúncios
- `GET /api/ads/:id/performance` - Métricas

**Python Bot (8000):**
- `POST /generate` - Gera anúncio com IA
- `POST /analyze` - Analisa tendências
- `GET /health` - Status do serviço

---

## 📚 Documentação

### Guias Detalhados

- [📖 Guia de Uso Completo](GUIA_DE_USO.md) - Tutorial passo a passo
- [🏗️ Arquitetura do Sistema](ARQUITETURA.md) - Detalhes técnicos
- [📊 Projeto Completo](PROJETO_COMPLETO.md) - Visão geral
- [🔒 Segurança](SECURITY.md) - Práticas de segurança

### Documentação API

- Node.js API: http://localhost:3001/api-docs (Swagger)
- Python Bot: http://localhost:8000/docs (FastAPI)

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

### Como Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Padrões

- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/)
- **Código:** Siga ESLint (JS) e PEP 8 (Python)
- **Testes:** Adicione testes para novas funcionalidades
- **Documentação:** Atualize README se necessário

---

## 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/flaviacapacia/bot-google-ads-ia/issues/new)

Inclua:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (OS, versões, etc)

---

## 📜 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.

---

## 👥 Autores

**Flávia Capacia**
- Website: [flaviacapaciacorretora.com](https://www.flaviacapaciacorretora.com)
- GitHub: [@flaviacapacia](https://github.com/flaviacapacia)

---

## 🙏 Agradecimentos

- [Mistral AI](https://mistral.ai/) - Motor de IA
- [Google Ads API](https://developers.google.com/google-ads/api) - Integração de anúncios
- Comunidade open source

---

## 📊 Status do Projeto

![Status](https://img.shields.io/badge/Status-Ativo-success)
![Manutenção](https://img.shields.io/badge/Manuten%C3%A7%C3%A3o-Sim-green)
![Versão](https://img.shields.io/badge/Vers%C3%A3o-1.0.0-blue)

---

## 📞 Suporte

Precisa de ajuda? 

- 📧 Email: contato@flaviacapaciacorretora.com
- 🐛 Issues: [GitHub Issues](https://github.com/flaviacapacia/bot-google-ads-ia/issues)
- 📖 Documentação: [Guias](GUIA_DE_USO.md)

---

## 🗺️ Roadmap

### Versão Atual (1.0.0)
- ✅ Geração de anúncios com IA
- ✅ Dashboard React
- ✅ API REST completa
- ✅ Web scraping do blog
- ✅ Docker Compose

### Próximas Versões

**v1.1.0**
- [ ] Integração completa Google Ads (publicação)
- [ ] Testes A/B automatizados
- [ ] Relatórios PDF exportáveis

**v1.2.0**
- [ ] Suporte a múltiplos idiomas
- [ ] Templates customizáveis
- [ ] Agendamento de publicações

**v2.0.0**
- [ ] Suporte a Facebook Ads
- [ ] Machine learning para otimização
- [ ] App mobile (React Native)

---

## 📜 Changelog

### [1.0.0] - 2026-02-14

**Adicionado:**
- Sistema completo de geração de anúncios com IA
- Dashboard React com interface moderna
- API Node.js com todos endpoints
- Bot Python com Mistral AI
- Web scraping do blog
- Docker Compose para deploy
- Documentação completa

---

<div align="center">

### ⭐ Se este projeto foi útil, dê uma estrela!

[![Star](https://img.shields.io/github/stars/flaviacapacia/bot-google-ads-ia?style=social)](https://github.com/flaviacapacia/bot-google-ads-ia/stargazers)

**Feito com ❤️ por [Flávia Capacia](https://www.flaviacapaciacorretora.com)**

</div>
