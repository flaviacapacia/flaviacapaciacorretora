# 📱 Como Visualizar as Interfaces do Projeto

Guia completo para visualizar as interfaces web do projeto no seu navegador.

---

## 🎯 Interfaces Disponíveis

Este projeto possui **duas interfaces principais**:

### 1. 🏠 Site Principal (Imobiliária)
- **Descrição:** Site institucional da Flávia Capacia Corretora
- **Tecnologia:** HTML, CSS, JavaScript puro
- **Localização:** Raiz do projeto (`index.html`)
- **Páginas:** Home, Sobre, Imóveis, Blog, Contato

### 2. 🤖 Dashboard do Bot Google Ads
- **Descrição:** Sistema de geração de anúncios com IA
- **Tecnologia:** React + Vite + Tailwind CSS
- **Localização:** `bot-google-ads/dashboard/`
- **Funcionalidades:** Lista imóveis, gera anúncios, gerencia campanhas

---

## 🚀 Opção 1: Scripts Automáticos (RECOMENDADO)

Use os scripts prontos para abrir as interfaces automaticamente.

### Linux/Mac
```bash
./visualizar.sh
```

### Windows
```
visualizar.bat
```

**O script irá:**
1. Perguntar qual interface você quer ver
2. Instalar dependências se necessário
3. Iniciar servidor automaticamente
4. Abrir no navegador

---

## 🌐 Opção 2: Site Principal (Manual)

### Método A: Servidor HTTP Simples

**Python 3:**
```bash
# Na raiz do projeto
python3 -m http.server 8080
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8080
```

**Node.js (se tiver instalado):**
```bash
npx http-server -p 8080
```

**Acesse:** http://localhost:8080

### Método B: Abrir Arquivo Diretamente

**Windows:**
- Clique duplo em `index.html`
- Ou clique com botão direito → "Abrir com" → Navegador

**Mac:**
```bash
open index.html
```

**Linux:**
```bash
xdg-open index.html
```

⚠️ **Nota:** Algumas funcionalidades podem não funcionar ao abrir arquivo diretamente.

---

## 🤖 Opção 3: Dashboard React (Manual)

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passo 1: Instalar Dependências

```bash
cd bot-google-ads/dashboard
npm install
```

### Passo 2: Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

### Passo 3: Abrir no Navegador

O Vite irá mostrar o endereço (geralmente):
- **Local:** http://localhost:3000
- **Network:** http://192.168.x.x:3000

**Acesse:** http://localhost:3000

---

## 🐳 Opção 4: Docker Compose (Sistema Completo)

Para rodar **todo o sistema** (API + Bot + Dashboard):

### Pré-requisitos
- Docker e Docker Compose instalados
- Arquivo `.env` configurado

### Passos

```bash
cd bot-google-ads
cp .env.example .env
# Edite o .env com suas configurações
docker-compose up -d
```

**Acesse:**
- Dashboard: http://localhost:3000
- API: http://localhost:3001
- Bot: http://localhost:8000

---

## 📱 Páginas do Site Principal

Após abrir o site, você pode navegar para:

- **Home:** `index.html`
- **Sobre:** `sobre.html`
- **Imóveis:** `imoveis-cadastrados.html`
- **Blog:** `blog.html`
- **Contato:** `contato.html`
- **Financiamento:** `financie.html`

### Imóveis Individuais

Exemplos de páginas de imóveis:
- `apartamento-venda-agronomica-v439.html`
- `apartamento-venda-centro-v447.html`
- `apartamento-arkki-v452.html`

---

## 🎨 Páginas do Dashboard React

Após abrir o dashboard, você verá:

### Navegação Principal

1. **Imóveis** (`/`)
   - Lista todos os imóveis cadastrados
   - Cards visuais com fotos
   - Botão "Criar Anúncio" em cada imóvel

2. **Gerar Anúncio** (`/gerar-anuncio/:id`)
   - Dados do imóvel
   - Botão para gerar com IA
   - Preview dos anúncios gerados

3. **Anúncios** (`/anuncios`)
   - Histórico de anúncios criados
   - Status de cada anúncio
   - Filtros e busca

4. **Detalhes** (`/anuncio/:id`)
   - Visualização completa do anúncio
   - Headlines e descriptions
   - Keywords e público-alvo
   - Métricas de performance

---

## 🔧 Problemas Comuns

### "Porta já em uso"

**Problema:** Servidor não inicia porque porta está ocupada.

**Solução:**
```bash
# Matar processo na porta 8080
lsof -ti:8080 | xargs kill -9

# Ou usar outra porta
python3 -m http.server 8081
```

### "Comando não encontrado"

**Problema:** `python3` ou `node` não reconhecido.

**Solução:**
- **Python:** Instale em python.org
- **Node.js:** Instale em nodejs.org

### Dashboard não carrega dados

**Problema:** Dashboard mostra erro ou tela vazia.

**Solução:**
1. Verifique se a API está rodando (http://localhost:3001/health)
2. Configure o arquivo `.env` no dashboard
3. Reinicie o servidor Vite

### Erro ao instalar dependências

**Problema:** `npm install` falha.

**Solução:**
```bash
# Limpar cache
npm cache clean --force

# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Comparação das Opções

| Opção | Facilidade | Recursos | Melhor Para |
|-------|-----------|----------|-------------|
| **Scripts Automáticos** | ⭐⭐⭐⭐⭐ | Completo | Qualquer usuário |
| **Servidor HTTP** | ⭐⭐⭐⭐ | Básico | Ver site estático |
| **Arquivo Direto** | ⭐⭐⭐⭐⭐ | Limitado | Visualização rápida |
| **Vite Dev** | ⭐⭐⭐ | Completo | Desenvolvimento |
| **Docker Compose** | ⭐⭐ | Completo | Sistema todo integrado |

---

## 🎯 Recomendações

### Para Ver o Site Imobiliário
**Use:** Script automático ou servidor HTTP simples
```bash
python3 -m http.server 8080
```
Acesse: http://localhost:8080

### Para Ver o Dashboard React
**Use:** Script automático ou Vite
```bash
cd bot-google-ads/dashboard
npm run dev
```
Acesse: http://localhost:3000

### Para Sistema Completo Funcionando
**Use:** Docker Compose
```bash
cd bot-google-ads
docker-compose up -d
```

---

## 💡 Dicas

✅ **Use o modo desenvolvedor do navegador** (F12) para ver erros

✅ **Teste em diferentes navegadores** (Chrome, Firefox, Edge)

✅ **Mantenha o terminal aberto** para ver logs

✅ **Use Ctrl+C** para parar servidores

✅ **Limpe o cache** se algo não atualizar (Ctrl+Shift+R)

---

## 🔗 Links Úteis

- **Documentação React:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Docker Compose:** https://docs.docker.com/compose

---

## 📞 Ajuda Adicional

Se precisar de ajuda:

1. **Leia os READMEs:**
   - `README.md` (raiz)
   - `bot-google-ads/README.md`
   - `bot-google-ads/GUIA_DE_USO.md`

2. **Verifique logs:**
   - Terminal onde rodou o comando
   - Console do navegador (F12)
   - Arquivo de log do Docker

3. **Teste ambiente:**
   - Node.js: `node --version`
   - Python: `python3 --version`
   - Docker: `docker --version`

---

## 🎉 Sucesso!

Depois de seguir estas instruções, você terá acesso completo às interfaces do projeto!

- 🏠 Site principal rodando
- 🤖 Dashboard React funcionando
- ✨ Tudo pronto para usar!

---

**Última atualização:** 14 de Fevereiro de 2026
**Documentação:** Completa e testada
