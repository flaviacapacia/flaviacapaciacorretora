# 📥 Como Baixar o Projeto para seu PC

Guia completo em português para baixar e atualizar o projeto no seu computador.

---

## 🎯 Opção 1: Primeira Vez (Clone)

Se é a **primeira vez** que você vai baixar o projeto:

### Passo 1: Abra o Terminal/Prompt de Comando

**Windows:**
- Pressione `Win + R`
- Digite `cmd` e pressione Enter
- Ou use o Git Bash (se tiver instalado)

**Mac/Linux:**
- Abra o Terminal
- Ou pressione `Ctrl + Alt + T`

### Passo 2: Navegue até onde quer salvar

```bash
# Exemplo: ir para a pasta Documentos
cd Documentos

# Ou criar uma pasta para projetos
mkdir projetos
cd projetos
```

### Passo 3: Clone o Repositório

```bash
git clone https://github.com/flaviacapacia/flaviacapaciacorretora.git
```

### Passo 4: Entre na pasta do projeto

```bash
cd flaviacapaciacorretora
```

### Passo 5: Veja a branch do Bot de Anúncios

```bash
# Mudar para a branch com o Bot Google Ads
git checkout copilot/create-ads-generation-bot
```

✅ **Pronto!** O projeto está no seu PC!

---

## 🔄 Opção 2: Atualizar (Pull)

Se você **já tem o projeto** e quer atualizar com as últimas mudanças:

### Passo 1: Abra o Terminal na pasta do projeto

```bash
# Entre na pasta do projeto
cd caminho/para/flaviacapaciacorretora
```

### Passo 2: Certifique-se de estar na branch correta

```bash
# Ver em qual branch você está
git branch

# Mudar para a branch do Bot Google Ads
git checkout copilot/create-ads-generation-bot
```

### Passo 3: Faça o Pull

```bash
git pull origin copilot/create-ads-generation-bot
```

✅ **Pronto!** Seu projeto está atualizado!

---

## 🆘 Comandos Úteis

### Ver status do projeto

```bash
git status
```

### Ver histórico de mudanças

```bash
git log --oneline -10
```

### Ver branches disponíveis

```bash
git branch -a
```

### Baixar todas as mudanças sem aplicar

```bash
git fetch origin
```

---

## 📦 Estrutura do Projeto Após o Download

```
flaviacapaciacorretora/
├── bot-google-ads/           ← Projeto do Bot Google Ads
│   ├── api/                  ← API Node.js
│   ├── bot/                  ← Bot Python com IA
│   ├── dashboard/            ← Dashboard React
│   ├── scripts/              ← Scripts SQL
│   ├── README.md             ← Documentação principal
│   ├── GUIA_DE_USO.md       ← Tutorial completo
│   └── docker-compose.yml    ← Orquestração
│
├── index.html                ← Site principal
├── style.css                 ← Estilos
└── outros arquivos...        ← Arquivos do site
```

---

## 🚀 Depois de Baixar

### Para usar o Bot Google Ads:

1. Entre na pasta:
```bash
cd bot-google-ads
```

2. Leia a documentação:
```bash
# Windows
notepad README.md

# Mac/Linux
cat README.md
```

3. Siga o guia de uso:
```bash
# Windows
notepad GUIA_DE_USO.md

# Mac/Linux
cat GUIA_DE_USO.md
```

---

## ❓ Problemas Comuns

### "git não é reconhecido como comando"

**Solução:** Você precisa instalar o Git.

**Windows:**
- Baixe em: https://git-scm.com/download/win
- Instale e reinicie o terminal

**Mac:**
```bash
brew install git
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install git
```

### "Permission denied"

**Solução:** Você pode precisar de credenciais do GitHub.

Se o repositório é privado, configure:
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### "Already up to date"

**Solução:** Seu projeto já está atualizado! Nada para fazer.

### Conflitos ao fazer pull

**Solução:** Se você fez mudanças locais:

```bash
# Salvar suas mudanças temporariamente
git stash

# Fazer o pull
git pull origin copilot/create-ads-generation-bot

# Recuperar suas mudanças
git stash pop
```

---

## 📱 Alternativa: Baixar ZIP (sem Git)

Se você não quer usar Git, pode baixar diretamente:

1. Acesse: https://github.com/flaviacapacia/flaviacapaciacorretora
2. Clique no botão verde **"Code"**
3. Clique em **"Download ZIP"**
4. Extraia o arquivo ZIP no seu PC
5. ⚠️ **Importante:** Você precisará mudar para a branch manualmente no GitHub

---

## 🔐 Configurar Acesso (Primeira Vez)

Se for a primeira vez usando Git no seu PC:

```bash
# Configure seu nome
git config --global user.name "Seu Nome"

# Configure seu email
git config --global user.email "seu@email.com"

# Verificar configuração
git config --list
```

---

## 💡 Dicas

✅ **Faça pull regularmente** para manter seu projeto atualizado

✅ **Use `git status`** antes de fazer pull para ver se tem mudanças locais

✅ **Crie uma cópia de segurança** antes de fazer pull se tiver mudanças importantes

✅ **Leia a documentação** em `bot-google-ads/README.md` depois de baixar

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas, verifique:

1. **Documentação do projeto:** `bot-google-ads/README.md`
2. **Guia de uso:** `bot-google-ads/GUIA_DE_USO.md`
3. **Arquitetura:** `bot-google-ads/ARQUITETURA.md`

---

## 🎉 Sucesso!

Depois de fazer o pull, você terá acesso a:

- ✨ Sistema completo de Bot Google Ads com IA
- 📚 Documentação completa em português
- 🤖 Código do Bot com Mistral AI
- 🎨 Dashboard React moderno
- 🗄️ Scripts de banco de dados
- 🐳 Docker Compose configurado

**Tudo pronto para usar!** 🚀

---

**Última atualização:** 14 de Fevereiro de 2026
**Branch recomendada:** `copilot/create-ads-generation-bot`
**Repositório:** https://github.com/flaviacapacia/flaviacapaciacorretora
