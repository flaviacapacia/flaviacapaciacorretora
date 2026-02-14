# 🚀 Guia de Uso - Bot Google Ads com IA

## 📚 Índice
1. [Configuração Inicial](#configuração-inicial)
2. [Como Usar o Sistema](#como-usar-o-sistema)
3. [Fluxo de Trabalho](#fluxo-de-trabalho)
4. [Troubleshooting](#troubleshooting)
5. [FAQ](#faq)

---

## Configuração Inicial

### 1. Pré-requisitos

- Docker e Docker Compose instalados
- Chave da API Mistral (gratuita)
- Acesso ao SQL Server existente

### 2. Obter Chave Mistral AI (Gratuita)

1. Acesse: https://console.mistral.ai/
2. Crie uma conta gratuita
3. Vá em "API Keys"
4. Clique em "Create new key"
5. Copie a chave gerada

### 3. Configurar Variáveis de Ambiente

```bash
cd bot-google-ads
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# ⚠️ OBRIGATÓRIO
MISTRAL_API_KEY=sua_chave_mistral_aqui

# 🗄️ SQL Server (use suas credenciais existentes)
DB_HOST=seu_host_sqlserver
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=flaviacapacia
DB_PORT=1433

# 🌐 URLs (não precisa alterar)
BLOG_URL=https://www.flaviacapaciacorretora.com/blog
SITE_URL=https://www.flaviacapaciacorretora.com

# 📢 Google Ads (opcional - deixe vazio por enquanto)
GOOGLE_ADS_CUSTOMER_ID=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_LOGIN_CUSTOMER_ID=
```

### 4. Inicializar o Banco de Dados

Execute o script SQL no seu SQL Server:

```bash
# No SQL Server Management Studio ou Azure Data Studio
# Abra e execute: scripts/init_database.sql
```

Ou via linha de comando:

```bash
sqlcmd -S seu_host -U seu_usuario -P sua_senha -d flaviacapacia -i scripts/init_database.sql
```

### 5. Iniciar o Sistema

```bash
# Com Docker (recomendado)
docker-compose up -d

# Ou individualmente para desenvolvimento
# Terminal 1 - API
cd api && npm install && npm run dev

# Terminal 2 - Bot
cd bot && pip install -r requirements.txt && uvicorn src.main:app --reload

# Terminal 3 - Dashboard
cd dashboard && npm install && npm run dev
```

### 6. Acessar o Dashboard

Abra seu navegador em: **http://localhost:3000**

---

## Como Usar o Sistema

### 📋 Passo 1: Visualizar Imóveis

1. Acesse o dashboard
2. Você verá a lista de todos os imóveis cadastrados
3. Cada card mostra:
   - Foto do imóvel
   - Título e localização
   - Preço
   - Características (quartos, banheiros, área)

### ✨ Passo 2: Gerar Anúncio com IA

1. Clique no botão **"✨ Criar Anúncio com IA"** no imóvel desejado
2. Revise os dados do imóvel mostrados
3. Clique em **"✨ Gerar Anúncios com IA"**
4. Aguarde 10-30 segundos (a IA está analisando e criando)

### 👀 Passo 3: Revisar Anúncios Gerados

O sistema gera automaticamente:

**Headlines (5 variações)**
- Títulos curtos e impactantes
- Máximo 30 caracteres cada
- Otimizados para conversão

**Descriptions (3 variações)**
- Descrições persuasivas
- Máximo 90 caracteres cada
- Com call-to-action forte

**Palavras-chave (10-15)**
- Keywords relevantes
- Variações long-tail
- Baseadas em tendências do blog

**Público-Alvo**
- Faixa etária ideal
- Localização geográfica
- Interesses específicos
- Nível de renda

### 📢 Passo 4: Publicar Anúncio

**Opção A: Modo Preview (sem credenciais Google Ads)**
1. Clique em **"📢 Publicar Anúncio"**
2. O anúncio será salvo como "Pronto para publicar"
3. Quando tiver credenciais, poderá publicar depois

**Opção B: Publicação Real (com credenciais Google Ads)**
1. Configure as credenciais no `.env`
2. Clique em **"📢 Publicar Anúncio"**
3. O anúncio será enviado para o Google Ads
4. Você receberá o ID da campanha

### 📊 Passo 5: Acompanhar Performance

1. Acesse o menu **"Anúncios"**
2. Veja a lista de todos os anúncios criados
3. Clique em **"Ver Detalhes"** para ver:
   - Todas as variações criadas
   - Status atual
   - Métricas (quando disponíveis)

---

## Fluxo de Trabalho

### Fluxo Completo

```
📱 Cadastrar Imóvel no Sistema
    ↓
🤖 Gerar Anúncios com IA
    ↓
👀 Revisar e Editar (se necessário)
    ↓
📢 Publicar no Google Ads
    ↓
📊 Acompanhar Performance
    ↓
🔄 Otimizar baseado em dados
```

### O que acontece nos bastidores?

1. **Bot faz scraping do blog**
   - Identifica tendências do mercado
   - Extrai palavras-chave relevantes
   - Analisa temas em alta

2. **IA Mistral analisa os dados**
   - Dados do imóvel
   - Tendências do blog
   - Melhores práticas de marketing

3. **IA gera múltiplas variações**
   - Headlines otimizados
   - Descriptions persuasivas
   - Keywords estratégicas
   - Público-alvo definido

4. **Sistema salva tudo no banco**
   - Histórico completo
   - Versionamento
   - Métricas de performance

---

## Troubleshooting

### ❌ Erro: "Cannot connect to SQL Server"

**Solução:**
```bash
# 1. Verifique se o SQL Server está rodando
# 2. Confirme as credenciais no .env
# 3. Teste a conexão:
sqlcmd -S seu_host -U seu_usuario -P sua_senha -Q "SELECT 1"
```

### ❌ Erro: "Mistral API Key invalid"

**Solução:**
```bash
# 1. Verifique se copiou a chave corretamente
# 2. Confirme que não há espaços extras
# 3. Teste a chave:
curl -X GET https://api.mistral.ai/v1/models \
  -H "Authorization: Bearer sua_chave"
```

### ❌ Erro: "Bot not responding"

**Solução:**
```bash
# 1. Verifique se o bot está rodando:
docker ps | grep bot

# 2. Veja os logs:
docker logs flavia-ads-bot

# 3. Reinicie o bot:
docker-compose restart bot
```

### ❌ Dashboard não carrega imóveis

**Solução:**
```bash
# 1. Verifique se a API está rodando:
curl http://localhost:3001/health

# 2. Verifique se há imóveis cadastrados:
# Execute no SQL: SELECT COUNT(*) FROM Imoveis WHERE status = 'ativo'

# 3. Veja os logs da API:
docker logs flavia-ads-api
```

### ❌ Anúncios gerados muito genéricos

**Solução:**
1. Certifique-se que os imóveis têm descrições detalhadas
2. Preencha os campos "diferenciais" e "características"
3. Adicione fotos de qualidade
4. O blog precisa ter conteúdo recente

---

## FAQ

### 📋 Perguntas Gerais

**Q: Quanto custa usar este sistema?**
A: O sistema é gratuito. A API Mistral tem um tier gratuito generoso.

**Q: Preciso ter conta no Google Ads?**
A: Não é obrigatório para usar o sistema. Ele funciona em modo preview sem credenciais.

**Q: Quantos anúncios posso gerar?**
A: Ilimitados! Mas respeite os limites da API Mistral (tier gratuito).

**Q: Os anúncios são publicados automaticamente?**
A: Não. Você sempre revisa antes de publicar.

### 🤖 Sobre a IA

**Q: Como a IA sabe o que escrever?**
A: Ela analisa:
- Dados do imóvel (localização, preço, características)
- Conteúdo do blog (tendências, palavras-chave)
- Melhores práticas de marketing imobiliário

**Q: Posso editar os anúncios gerados?**
A: Sim! Use-os como base e customize como quiser.

**Q: A IA aprende com o tempo?**
A: A IA usa as tendências do blog que são atualizadas automaticamente.

### 📊 Sobre Performance

**Q: Como acompanho os resultados?**
A: Na página de detalhes do anúncio você vê:
- Impressões
- Cliques
- CTR (taxa de cliques)
- Custo
- Conversões

**Q: As métricas são em tempo real?**
A: Depende da configuração do Google Ads. Geralmente atualizam a cada 24h.

### 🔐 Sobre Segurança

**Q: Minhas credenciais estão seguras?**
A: Sim. Elas ficam apenas no arquivo `.env` local e não são commitadas no Git.

**Q: O que acontece se eu perder a chave da API?**
A: Gere uma nova no console da Mistral e atualize o `.env`.

---

## 📞 Suporte

### Problemas Técnicos

1. **Verifique os logs:**
   ```bash
   docker-compose logs -f
   ```

2. **Reinicie os serviços:**
   ```bash
   docker-compose restart
   ```

3. **Reconstrua as imagens:**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Contato

- **Email:** contato@flaviacapaciacorretora.com
- **Website:** https://www.flaviacapaciacorretora.com

---

## 🎯 Melhores Práticas

### Para Melhores Resultados:

1. **Imóveis bem descritos**
   - Descrições detalhadas
   - Destaque diferenciais
   - Fotos de qualidade

2. **Blog atualizado**
   - Poste regularmente
   - Use palavras-chave relevantes
   - Fale sobre o mercado local

3. **Revise os anúncios**
   - Sempre revise antes de publicar
   - Ajuste para seu público
   - Teste variações

4. **Acompanhe métricas**
   - Monitore performance
   - Identifique o que funciona
   - Otimize continuamente

---

**Desenvolvido com ❤️ para revolucionar o marketing imobiliário em Florianópolis**
