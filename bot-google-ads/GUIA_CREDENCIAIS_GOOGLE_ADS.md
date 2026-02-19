# 🔑 Guia Completo - Obter Credenciais Google Ads

## 📋 Credenciais Necessárias

Você precisa de 5 credenciais para o bot funcionar:

| Credencial | Status | Onde Obter |
|------------|--------|------------|
| ✅ Customer ID | **CONFIGURADO** | `5836429998` |
| ⏳ Developer Token | **FALTA** | Google Ads → Central de API |
| ⏳ Client ID | **FALTA** | Google Cloud Console |
| ⏳ Client Secret | **FALTA** | Google Cloud Console |
| ⏳ Refresh Token | **FALTA** | Gerado via script |

---

## 1️⃣ Developer Token (Google Ads)

### Passo a Passo:

1. **Acesse o Google Ads:**
   - URL: https://ads.google.com/
   - Faça login com sua conta

2. **Navegue até a Central de API:**
   ```
   Ferramentas e Configurações (ícone de chave inglesa no topo)
   → Configuração
   → Central de API
   ```

3. **Solicite/Copie o Developer Token:**
   - Se nunca solicitou: clique em "Solicitar Token de Desenvolvedor"
   - Se já tem: copie o token que aparece
   - **IMPORTANTE:** Token pode levar 24h para aprovação se for primeira vez

4. **Cole no arquivo `.env`:**
   ```env
   GOOGLE_ADS_DEVELOPER_TOKEN=SEU_TOKEN_AQUI
   ```

**Notas:**
- Token de teste funciona imediatamente
- Token de produção pode demorar 24h para aprovação
- Você verá o status: "Aprovado" ou "Em análise"

---

## 2️⃣ OAuth2 Credentials (Google Cloud Console)

### Passo a Passo Completo:

### 2.1 - Criar Projeto no Google Cloud

1. **Acesse o Google Cloud Console:**
   - URL: https://console.cloud.google.com/

2. **Crie um novo projeto:**
   - Clique no seletor de projetos (topo direito)
   - Clique em "Novo Projeto"
   - Nome: `Bot Google Ads Flavia Capacia`
   - Clique em "Criar"
   - Aguarde a criação (30-60 segundos)

### 2.2 - Ativar Google Ads API

1. **No projeto criado, vá até APIs:**
   ```
   Menu hambúrguer (☰)
   → APIs e Serviços
   → Biblioteca
   ```

2. **Procure e ative:**
   - Digite: "Google Ads API"
   - Clique no resultado
   - Clique em "Ativar"
   - Aguarde ativação (10-20 segundos)

### 2.3 - Configurar Tela de Consentimento OAuth

1. **Vá até Tela de Consentimento:**
   ```
   APIs e Serviços
   → Tela de consentimento OAuth
   ```

2. **Escolha o tipo:**
   - Selecione: **"Externo"**
   - Clique em "Criar"

3. **Preencha as informações:**
   - **Nome do app:** Bot Google Ads Flavia Capacia
   - **E-mail de suporte:** seu_email@gmail.com
   - **Domínio da página inicial:** https://www.flaviacapaciacorretora.com
   - **E-mail de contato do desenvolvedor:** seu_email@gmail.com
   - Clique em "Salvar e Continuar"

4. **Escopos (deixe em branco):**
   - Clique em "Salvar e Continuar"

5. **Usuários de teste:**
   - Clique em "+ Adicionar Usuários"
   - Adicione seu e-mail
   - Clique em "Salvar e Continuar"

6. **Resumo:**
   - Clique em "Voltar ao Painel"

### 2.4 - Criar Credenciais OAuth 2.0

1. **Vá até Credenciais:**
   ```
   APIs e Serviços
   → Credenciais
   ```

2. **Crie as credenciais:**
   - Clique em "+ Criar Credenciais"
   - Selecione: **"ID do cliente OAuth 2.0"**

3. **Configure o cliente:**
   - **Tipo de aplicativo:** Aplicativo da Web
   - **Nome:** Bot Google Ads CLI
   - **URIs de redirecionamento autorizados:**
     - Clique em "+ Adicionar URI"
     - Cole: `http://localhost:8080`
   - Clique em "Criar"

4. **Copie as credenciais:**
   - Uma janela aparecerá com:
     - **Client ID** (começa com números e termina em `.apps.googleusercontent.com`)
     - **Client Secret** (string aleatória)
   - ⚠️ **COPIE E GUARDE!** Você precisará deles

5. **Cole no arquivo `.env`:**
   ```env
   GOOGLE_ADS_CLIENT_ID=SEU_CLIENT_ID_AQUI.apps.googleusercontent.com
   GOOGLE_ADS_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI
   ```

---

## 3️⃣ Refresh Token (Gerado via Script)

### Pré-requisitos:
- Python instalado
- Client ID e Client Secret configurados

### Passo a Passo:

1. **Instale a biblioteca Google Ads:**
   ```bash
   pip install google-ads
   ```

2. **Execute o comando para gerar o token:**
   ```bash
   python -m google.ads.googleads.oauth2.generate_refresh_token ^
     --client_id=SEU_CLIENT_ID ^
     --client_secret=SEU_CLIENT_SECRET
   ```

   **Substitua:**
   - `SEU_CLIENT_ID` pelo Client ID que você copiou
   - `SEU_CLIENT_SECRET` pelo Client Secret que você copiou

3. **Processo de autorização:**
   - O navegador abrirá automaticamente
   - Você verá: "O Google não verificou este app"
   - Clique em "Avançado"
   - Clique em "Ir para Bot Google Ads CLI (não seguro)"
   - Faça login com sua conta do Google Ads
   - Clique em "Permitir"

4. **Copie o Refresh Token:**
   - Após autorizar, você verá no terminal:
   ```
   Your refresh token is: 1//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   - **COPIE ESTE TOKEN!**

5. **Cole no arquivo `.env`:**
   ```env
   GOOGLE_ADS_REFRESH_TOKEN=1//seu_refresh_token_aqui
   ```

---

## 4️⃣ Login Customer ID (Opcional)

### Quando usar:
- Se você gerencia várias contas Google Ads através de uma conta MCC (Manager Account)
- Se você é uma agência

### Como obter:
1. Acesse: https://ads.google.com/
2. Se você vê múltiplas contas, o ID principal (gerenciador) é o Login Customer ID
3. Geralmente tem 10 dígitos (ex: 123-456-7890)

### Como configurar:
```env
GOOGLE_ADS_LOGIN_CUSTOMER_ID=1234567890
```

**Se você tem apenas uma conta:** Deixe vazio ou use o mesmo Customer ID

---

## ✅ Configuração Final do `.env`

Depois de obter todas as credenciais, seu `.env` deve estar assim:

```env
# Mistral AI (já configurado)
MISTRAL_API_KEY=1wnPs1Yp7PW0TI5gPHMghb5pNzXU2EQF

# Google Ads - Conta
GOOGLE_ADS_CUSTOMER_ID=5836429998

# Google Ads - Credenciais necessárias
GOOGLE_ADS_DEVELOPER_TOKEN=seu_developer_token_aqui
GOOGLE_ADS_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_ADS_REFRESH_TOKEN=1//seu_refresh_token_aqui
GOOGLE_ADS_LOGIN_CUSTOMER_ID=5836429998

# Database
DB_HOST=localhost
DB_USER=sa
DB_PASSWORD=sua_senha
DB_NAME=flaviacapacia_imoveis
DB_PORT=1433

# URLs
BLOG_URL=https://www.flaviacapaciacorretora.com/blog
SITE_URL=https://www.flaviacapaciacorretora.com

# Ports
API_PORT=3001
BOT_PORT=8000
DASHBOARD_PORT=3000
```

---

## 🧪 Testar a Configuração

Depois de configurar tudo:

1. **Instale as dependências:**
   ```bash
   cd bot-google-ads/bot
   pip install -r requirements.txt
   ```

2. **Inicie o bot:**
   ```bash
   python -m uvicorn src.main:app --reload --port 8000
   ```

3. **Teste o health check:**
   ```bash
   curl http://localhost:8000/health
   ```

   **Resposta esperada:**
   ```json
   {
     "status": "saudável",
     "ia_mistral": "✅ configurada",
     "google_ads": "✅ configurado"
   }
   ```

4. **Teste gerando um anúncio:**
   - Acesse: http://localhost:3000
   - Selecione um imóvel
   - Clique em "Criar Anúncio"
   - Clique em "Gerar com IA"
   - Se tudo estiver OK, você verá os anúncios gerados
   - **Botão "Publicar no Google Ads"** estará disponível!

---

## 🚨 Solução de Problemas

### Erro: "Invalid Developer Token"
- Verifique se copiou o token correto
- Aguarde aprovação (pode levar 24h)
- Use o token de teste enquanto aguarda

### Erro: "Invalid Client"
- Verifique Client ID e Client Secret
- Certifique-se de que não tem espaços extras
- Confirme que está usando o projeto correto

### Erro: "Invalid Refresh Token"
- Gere o token novamente
- Certifique-se de autorizar com a conta correta
- Token expira? Não, Refresh Tokens não expiram normalmente

### Erro: "Permission Denied"
- Verifique se ativou a Google Ads API
- Confirme que autorizou os escopos corretos
- Adicione seu e-mail como usuário de teste

### Navegador não abre na geração do Refresh Token
```bash
# Execute com --noauth_local_webserver
python -m google.ads.googleads.oauth2.generate_refresh_token ^
  --client_id=SEU_CLIENT_ID ^
  --client_secret=SEU_CLIENT_SECRET ^
  --noauth_local_webserver
```
- Copie a URL que aparecer
- Cole no navegador manualmente
- Após autorizar, copie o código
- Cole no terminal

---

## 📞 Contatos de Suporte

### Documentação Oficial:
- **Google Ads API:** https://developers.google.com/google-ads/api/docs/start
- **OAuth2 Setup:** https://developers.google.com/google-ads/api/docs/oauth/overview
- **Troubleshooting:** https://developers.google.com/google-ads/api/docs/best-practices/troubleshooting

### Comunidade:
- **Stack Overflow:** Tag `google-ads-api`
- **GitHub Issues:** https://github.com/googleads/google-ads-python/issues

---

## ⏱️ Tempo Estimado

| Etapa | Tempo |
|-------|-------|
| Developer Token | 5 min (+ até 24h aprovação) |
| Google Cloud Setup | 10 min |
| OAuth2 Credentials | 5 min |
| Refresh Token | 5 min |
| Testes | 10 min |
| **TOTAL** | ~35 min (+ aprovação) |

---

## 🎯 Próximo Passo

Depois de configurar tudo:
1. Volte para o arquivo `STATUS_IMPLEMENTACAO.md`
2. Siga o checklist
3. Teste o bot completo!

**Boa sorte! 🚀**
