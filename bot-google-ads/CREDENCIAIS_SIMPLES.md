# 🔑 Configurar Credenciais - Guia Simplificado

## 🚀 Forma Mais Fácil (5 minutos)

### Opção 1: Usando o Script Interativo ⭐ RECOMENDADO

```bash
# Duplo clique no arquivo:
configurar_credenciais.bat

# Ou execute no terminal:
python configurar_credenciais.py
```

O script vai pedir as 5 credenciais uma por vez. Você só precisa colar!

---

## 📝 Credenciais Necessárias

Você já tem: **Customer ID: 583-642-9998** ✅

Faltam apenas 4 credenciais:

### 1️⃣ Developer Token
- **Onde obter:** https://ads.google.com/
- **Caminho:** Ferramentas → Configuração → Central de API
- **Tempo:** 2 minutos

### 2️⃣ Client ID (OAuth2)
- **Onde obter:** https://console.cloud.google.com/
- **Caminho:** APIs e Serviços → Credenciais → Criar credenciais
- **Formato:** Termina com `.apps.googleusercontent.com`
- **Tempo:** 5 minutos

### 3️⃣ Client Secret (OAuth2)
- **Onde obter:** Mesmo lugar do Client ID
- **Formato:** String aleatória
- **Tempo:** Junto com o Client ID

### 4️⃣ Refresh Token (OAuth2)
- **Como gerar:** O script faz isso pra você!
- **Tempo:** 2 minutos

---

## 🎯 Passo a Passo Rápido

### 1. Execute o configurador
```bash
configurar_credenciais.bat
```

### 2. Escolha opção "2 - Configuração rápida"

### 3. Cole as credenciais quando pedido:

```
Customer ID: 583-642-9998 ✅ (já configurado)

Developer Token: [cole aqui quando tiver]

Client ID: [cole aqui quando tiver]

Client Secret: [cole aqui quando tiver]

Refresh Token: [use opção 3 do menu para gerar]
```

---

## ⚡ Ordem Recomendada

1. **Developer Token** (5 min)
   - Acesse Google Ads
   - Vá em Ferramentas → Central de API
   - Copie ou solicite o token

2. **OAuth2 Credentials** (10 min)
   - Acesse Google Cloud Console
   - Crie projeto (se não tiver)
   - Ative Google Ads API
   - Crie credenciais OAuth 2.0
   - Copie Client ID e Client Secret

3. **Refresh Token** (2 min)
   - Execute o configurador
   - Escolha opção "3 - Gerar Refresh Token"
   - Autorize no navegador
   - Copie o token gerado

4. **Teste** (1 min)
   - Execute o bot
   - Acesse http://localhost:8000/health
   - Veja se tudo está ✅

---

## 🔍 Verificar Status

A qualquer momento, execute:

```bash
configurar_credenciais.bat
```

Escolha opção "1 - Ver status" para ver o que já está configurado.

---

## ✅ Quando Tudo Estiver Configurado

Você verá:

```
✅ Customer ID             → 5836...9998
✅ Developer Token         → abcd...xyz
✅ Client ID              → 1234...googleusercontent.com
✅ Client Secret          → wxyz...
✅ Refresh Token          → 1//a...
```

Então pode iniciar o bot:

```bash
INICIAR.bat
```

---

## 💡 Dicas

- **Não compartilhe** essas credenciais
- **Faça backup** do arquivo `.env`
- **Teste** com orçamento baixo primeiro
- **Developer Token** pode demorar até 24h para aprovação

---

## 🆘 Problemas?

### "Python não encontrado"
→ Instale Python 3.8+ de python.org

### "Client ID inválido"
→ Certifique-se que termina com `.apps.googleusercontent.com`

### "Refresh Token expirado"
→ Gere um novo usando opção 3 do menu

### "Developer Token não aprovado"
→ Use o token de teste enquanto aguarda aprovação

---

## 📚 Mais Detalhes

Se precisar de instruções mais detalhadas, veja:
- `GUIA_CREDENCIAIS_GOOGLE_ADS.md` - Tutorial completo com screenshots

---

**⏱️ Tempo total: ~20 minutos**

**🎉 Depois disso, seu bot estará 100% funcional!**
