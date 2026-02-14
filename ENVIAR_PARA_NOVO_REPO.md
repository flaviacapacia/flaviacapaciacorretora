# 📤 Como Enviar Arquivos para o Novo Repositório

Guia completo para transferir todos os arquivos do `bot-google-ads` para o novo repositório `bot-google-ads-ia`.

---

## 🎯 Objetivo

Copiar todos os arquivos da pasta `bot-google-ads` deste repositório para o novo repositório:
👉 **https://github.com/flaviacapacia/bot-google-ads-ia**

---

## 🚀 Método 1: Script Automatizado (Recomendado)

### Linux / Mac

```bash
# 1. Dar permissão de execução
chmod +x enviar_arquivos.sh

# 2. Executar o script
./enviar_arquivos.sh

# 3. Seguir as instruções na tela
```

### Windows

```cmd
# 1. Duplo clique em enviar_arquivos.bat
# OU executar no CMD:
enviar_arquivos.bat

# 2. Seguir as instruções na tela
```

### O Que o Script Faz

1. ✅ Verifica se a pasta `bot-google-ads` existe
2. ✅ Clona o novo repositório em local temporário
3. ✅ Copia TODOS os arquivos do bot
4. ✅ Adiciona arquivos ao Git (staging)
5. ✅ Cria commit descritivo
6. ✅ Oferece fazer push automaticamente
7. ✅ Fornece comandos caso você prefira fazer manual

---

## 📝 Método 2: Manual Passo a Passo

### Passo 1: Clonar o Novo Repositório

```bash
# Escolha um local temporário
cd /tmp  # ou qualquer outro local

# Clone o novo repo
git clone https://github.com/flaviacapacia/bot-google-ads-ia.git

# Entre no diretório
cd bot-google-ads-ia
```

### Passo 2: Copiar os Arquivos

```bash
# Copie todos os arquivos da pasta bot-google-ads
# Substitua /caminho/para/ pelo caminho real
cp -r /caminho/para/flaviacapaciacorretora/bot-google-ads/* .

# Copie também arquivos ocultos
cp /caminho/para/flaviacapaciacorretora/bot-google-ads/.* . 2>/dev/null || true
```

**Windows (CMD):**
```cmd
xcopy /E /I /Y C:\caminho\para\flaviacapaciacorretora\bot-google-ads\* .
```

### Passo 3: Verificar os Arquivos

```bash
# Liste os arquivos copiados
ls -la

# Deve ver:
# - api/
# - bot/
# - dashboard/
# - scripts/
# - docker-compose.yml
# - README.md
# - etc.
```

### Passo 4: Adicionar ao Git

```bash
# Adicione todos os arquivos
git add .

# Verifique o que será commitado
git status
```

### Passo 5: Fazer Commit

```bash
git commit -m "Add complete bot-google-ads project files

- Node.js API with Express
- Python bot with FastAPI and Mistral AI
- React dashboard with Tailwind CSS
- SQL Server database scripts
- Docker Compose setup
- Complete documentation in Portuguese
- All configuration files and examples"
```

### Passo 6: Enviar para GitHub

```bash
# Push para o repositório
git push -u origin main

# Ou se usar master:
# git push -u origin master
```

---

## 🔐 Método 3: Com Credenciais SSH

Se você tem SSH configurado:

```bash
# Clone com SSH
git clone git@github.com:flaviacapacia/bot-google-ads-ia.git

# Resto do processo é igual ao Método 2
```

---

## 📦 Lista de Arquivos a Serem Enviados

### Estrutura Completa

```
bot-google-ads-ia/
├── api/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── imoveis.js
│   │   │   ├── blog.js
│   │   │   └── ads.js
│   │   ├── controllers/
│   │   │   ├── imoveisController.js
│   │   │   ├── blogController.js
│   │   │   └── adsController.js
│   │   ├── config/
│   │   │   └── database.js
│   │   └── app.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── bot/
│   ├── src/
│   │   ├── main.py
│   │   ├── ai_engine.py
│   │   ├── google_ads.py
│   │   ├── database.py
│   │   └── blog_scraper.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── dashboard/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ImovelCard.jsx
│   │   ├── pages/
│   │   │   ├── ImoveisPage.jsx
│   │   │   ├── GerarAnuncioPage.jsx
│   │   │   ├── AnunciosPage.jsx
│   │   │   └── DetalheAnuncioPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── Dockerfile
│   ├── .eslintrc.cjs
│   └── .env.example
│
├── scripts/
│   └── init_database.sql
│
├── docker-compose.yml
├── README.md (ou README_NOVO_REPO.md)
├── GUIA_DE_USO.md
├── ARQUITETURA.md
├── PROJETO_COMPLETO.md
├── SECURITY.md
├── .env.example
├── .gitignore
└── start.sh
```

### Total Estimado

- **Arquivos:** ~50 arquivos
- **Pastas:** ~15 pastas
- **Tamanho:** ~5-10 MB (sem node_modules)
- **Linhas de código:** ~3,500 linhas

---

## ⚠️ Avisos Importantes

### ❌ NÃO Enviar

Certifique-se de **NÃO** enviar:
- `node_modules/` (dependências Node.js)
- `__pycache__/` (cache Python)
- `venv/` ou `env/` (ambiente virtual Python)
- `.env` (variáveis de ambiente reais)
- `dist/` ou `build/` (arquivos compilados)
- `.DS_Store` (macOS)
- `Thumbs.db` (Windows)

O `.gitignore` já está configurado para ignorar esses arquivos!

### ✅ Incluir

Certifique-se de **INCLUIR**:
- `.env.example` (exemplos de configuração)
- `.gitignore` (configuração Git)
- `README.md` (documentação)
- Todos os arquivos fonte (`.js`, `.py`, `.jsx`)
- Arquivos de configuração (`package.json`, `requirements.txt`)
- Dockerfiles
- Scripts SQL

---

## 🔍 Verificação Pós-Envio

Após fazer o push, verifique:

1. **Acesse o repositório no GitHub:**
   https://github.com/flaviacapacia/bot-google-ads-ia

2. **Verifique se todas as pastas estão lá:**
   - ✅ api/
   - ✅ bot/
   - ✅ dashboard/
   - ✅ scripts/

3. **Verifique arquivos principais:**
   - ✅ README.md
   - ✅ docker-compose.yml
   - ✅ .gitignore

4. **Verifique documentação:**
   - ✅ GUIA_DE_USO.md
   - ✅ ARQUITETURA.md
   - ✅ PROJETO_COMPLETO.md

5. **Teste o clone:**
   ```bash
   git clone https://github.com/flaviacapacia/bot-google-ads-ia.git teste
   cd teste
   ls -la
   ```

---

## ❓ Problemas Comuns

### Problema: "Permission denied"

**Solução:**
```bash
# Configure suas credenciais Git
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Ou use Personal Access Token
# GitHub → Settings → Developer settings → Personal access tokens
```

### Problema: "Repository not found"

**Solução:**
- Verifique se o repositório existe: https://github.com/flaviacapacia/bot-google-ads-ia
- Certifique-se de ter acesso ao repositório
- Verifique se está logado no GitHub

### Problema: "Large files detected"

**Solução:**
```bash
# Remova node_modules se foi copiado por engano
rm -rf node_modules
rm -rf dashboard/node_modules
rm -rf api/node_modules

# Adicione novamente
git add .
git commit --amend
```

### Problema: "Failed to push"

**Solução:**
```bash
# Pull primeiro
git pull origin main --rebase

# Depois push
git push -u origin main
```

---

## 📚 Documentação Adicional

- [Como usar Git](https://git-scm.com/doc)
- [GitHub Authentication](https://docs.github.com/en/authentication)
- [Git Credential Helper](https://git-scm.com/docs/gitcredentials)

---

## ✅ Checklist Final

Antes de fazer push, verifique:

- [ ] Todos os arquivos copiados
- [ ] `.gitignore` está presente
- [ ] `.env.example` incluído (não `.env`)
- [ ] README.md atualizado
- [ ] Sem node_modules/
- [ ] Sem __pycache__/
- [ ] Commit criado
- [ ] Credenciais Git configuradas
- [ ] Acesso ao repositório confirmado

Depois do push:

- [ ] Arquivos visíveis no GitHub
- [ ] README.md renderizando corretamente
- [ ] Estrutura de pastas correta
- [ ] Documentação acessível
- [ ] Pronto para desenvolvimento

---

## 🎉 Sucesso!

Após completar estes passos, você terá:

✅ Todos os arquivos no novo repositório  
✅ Histórico Git limpo  
✅ Pronto para desenvolvimento  
✅ Documentação completa  
✅ Repositório organizado  

**Novo repositório:** https://github.com/flaviacapacia/bot-google-ads-ia

---

## 💬 Precisa de Ajuda?

Se encontrar problemas:

1. Revise este guia
2. Verifique os problemas comuns acima
3. Execute o script automatizado (`enviar_arquivos.sh` ou `.bat`)
4. Abra uma issue no repositório

**Boa sorte! 🚀**
