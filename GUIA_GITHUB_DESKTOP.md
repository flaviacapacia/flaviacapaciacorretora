# 🖥️ Guia Completo: GitHub Desktop

## 📋 Como Enviar Arquivos do Bot Usando GitHub Desktop

Este guia é específico para quem está usando **GitHub Desktop** (a interface gráfica do Git).

---

## ✅ Você Está no Lugar Certo!

Se você:
- ✅ Já tem o GitHub Desktop instalado
- ✅ Já tem os arquivos do repositório `flaviacapaciacorretora` no seu computador
- ✅ Quer enviar os arquivos do bot para o novo repositório `bot-google-ads-ia`

**Então este guia é para você!** 🎉

---

## 🎯 O Que Vamos Fazer

### Objetivo
Copiar a pasta `bot-google-ads` do repositório atual para o novo repositório `bot-google-ads-ia` usando GitHub Desktop.

### Passos
1. Adicionar o novo repositório no GitHub Desktop
2. Copiar os arquivos
3. Fazer commit
4. Fazer push

**Tempo estimado:** 5-10 minutos

---

## 📖 Passo a Passo Completo

### Passo 1: Adicionar Novo Repositório no GitHub Desktop

#### 1.1 Abrir o Menu

Na interface do GitHub Desktop:

1. Clique no menu **File** (Arquivo)
2. Selecione **Clone Repository...** (Clonar Repositório)

**OU**

1. Pressione `Ctrl+Shift+O` (Windows) ou `Cmd+Shift+O` (Mac)

#### 1.2 Clonar o Novo Repositório

Na janela que abrir:

1. Clique na aba **URL**
2. Cole este endereço:
   ```
   https://github.com/flaviacapacia/bot-google-ads-ia.git
   ```

3. Em **Local Path** (Caminho Local), escolha onde salvar:
   - Recomendado: mesma pasta onde está `flaviacapaciacorretora`
   - Exemplo Windows: `C:\Users\SeuNome\Documents\GitHub\`
   - Exemplo Mac: `/Users/SeuNome/Documents/GitHub/`

4. Clique em **Clone** (Clonar)

**Resultado:** O GitHub Desktop vai baixar o repositório (que provavelmente está vazio ou só tem README).

---

### Passo 2: Copiar os Arquivos

#### 2.1 Abrir as Pastas

Você precisa de **duas janelas do explorador de arquivos**:

**Janela 1 - Origem (flaviacapaciacorretora):**
1. No GitHub Desktop, com o repositório `flaviacapaciacorretora` selecionado
2. Clique com botão direito no repositório na lista à esquerda
3. Selecione **Show in Explorer** (Windows) ou **Show in Finder** (Mac)
4. Navegue até a pasta `bot-google-ads`

**Janela 2 - Destino (bot-google-ads-ia):**
1. No GitHub Desktop, mude para o repositório `bot-google-ads-ia`
   - Use o dropdown no topo à esquerda
2. Clique com botão direito
3. Selecione **Show in Explorer** ou **Show in Finder**
4. Você verá a pasta vazia (ou só com README)

#### 2.2 Copiar Tudo

**Copiar o conteúdo:**

1. Na **Janela 1** (pasta `bot-google-ads`), entre na pasta
2. Selecione **TUDO** que está dentro:
   - `api/`
   - `bot/`
   - `dashboard/`
   - `scripts/`
   - `docker-compose.yml`
   - `README.md` (ou `README_NOVO_REPO.md`)
   - `.env.example`
   - `start.sh`
   - Todos os outros arquivos e pastas

3. Copie tudo:
   - Windows: `Ctrl+C`
   - Mac: `Cmd+C`
   - Ou clique direito → Copiar

4. Vá para a **Janela 2** (pasta `bot-google-ads-ia`)

5. Cole tudo:
   - Windows: `Ctrl+V`
   - Mac: `Cmd+V`
   - Ou clique direito → Colar

**⚠️ IMPORTANTE:**
- Copie o **CONTEÚDO** da pasta `bot-google-ads`, não a pasta inteira
- Os arquivos devem ficar na raiz do novo repositório
- Não criar uma subpasta `bot-google-ads` dentro de `bot-google-ads-ia`

**Estrutura correta:**
```
bot-google-ads-ia/
├── api/
├── bot/
├── dashboard/
├── scripts/
├── docker-compose.yml
├── README.md
└── ...
```

**Estrutura ERRADA (não faça assim):**
```
bot-google-ads-ia/
└── bot-google-ads/    ❌ ERRADO!
    ├── api/
    ├── bot/
    └── ...
```

---

### Passo 3: Ver as Mudanças no GitHub Desktop

#### 3.1 Verificar Arquivos

1. No GitHub Desktop, certifique-se que está no repositório `bot-google-ads-ia`
2. Você verá:
   - À esquerda: lista de todos os arquivos adicionados (em verde)
   - Deve mostrar ~50 arquivos
   - Pastas: api, bot, dashboard, scripts

Se não ver nada:
- Verifique se está no repositório correto (dropdown no topo)
- Verifique se copiou os arquivos para a pasta certa

#### 3.2 Revisar Mudanças

O GitHub Desktop mostra:
- **Arquivos novos** (em verde com +)
- **Arquivos modificados** (em amarelo com ⚠)
- **Arquivos deletados** (em vermelho com -)

Você deve ver principalmente arquivos novos (verde).

---

### Passo 4: Fazer Commit

#### 4.1 Criar o Commit

No canto inferior esquerdo do GitHub Desktop:

1. **Summary (required)** - Título do commit:
   ```
   Initial commit: Add complete bot system with AI
   ```

2. **Description** (opcional) - Descrição detalhada:
   ```
   - Add Node.js API with Express
   - Add Python bot with FastAPI and Mistral AI
   - Add React dashboard with Tailwind CSS
   - Add SQL Server database scripts
   - Add Docker Compose configuration
   - Add complete documentation
   
   Migrated from flaviacapaciacorretora repository.
   ```

3. Clique no botão azul **Commit to main** (ou **Commit to master**)

**Resultado:** Os arquivos são commitados localmente (ainda não estão no GitHub online).

---

### Passo 5: Fazer Push (Enviar para GitHub)

#### 5.1 Push para Servidor

Após o commit, você verá uma barra no topo dizendo:
```
Push origin
```

1. Clique no botão **Push origin**

**OU**

1. Use o menu: **Repository** → **Push**
2. Ou pressione `Ctrl+P` (Windows) ou `Cmd+P` (Mac)

#### 5.2 Aguardar Upload

- O GitHub Desktop mostrará uma barra de progresso
- Dependendo da sua internet, pode levar 30 segundos a 2 minutos
- Aguarde até completar

**Mensagem de sucesso:**
```
✓ Pushed to origin
```

---

### Passo 6: Verificar no GitHub.com

#### 6.1 Abrir no Navegador

No GitHub Desktop:

1. Clique com botão direito no repositório `bot-google-ads-ia`
2. Selecione **View on GitHub**

**OU**

Acesse diretamente:
- https://github.com/flaviacapacia/bot-google-ads-ia

#### 6.2 Conferir os Arquivos

No GitHub.com você deve ver:

✅ **Pastas:**
- api/
- bot/
- dashboard/
- scripts/

✅ **Arquivos:**
- README.md renderizado
- docker-compose.yml
- .env.example
- start.sh
- Documentos (GUIA_DE_USO.md, ARQUITETURA.md, etc)

✅ **Commits:**
- Seu commit com a mensagem que você escreveu

Se tudo estiver lá: **🎉 SUCESSO! Parabéns!**

---

## 🎨 Dicas de Interface do GitHub Desktop

### Áreas Principais

```
┌─────────────────────────────────────────────────┐
│ File  Edit  View  Repository  Branch  Help     │ ← Menu
├─────────────────────────────────────────────────┤
│ Current Repository: bot-google-ads-ia ▼        │ ← Seletor
├──────────────┬──────────────────────────────────┤
│              │                                  │
│ Repositories │  Changes              History   │ ← Abas
│              │                                  │
│ • repo-1     │  📄 arquivo1.js                 │
│ • repo-2     │  📄 arquivo2.py                 │
│ ▼ repo-3     │  📁 pasta/                      │
│              │                                  │
│              │  Summary:                       │ ← Commit
│              │  [________________]             │
│              │                                 │
│              │  Description:                   │
│              │  [________________]             │
│              │  [________________]             │
│              │                                 │
│              │  [Commit to main]               │ ← Botão
└──────────────┴──────────────────────────────────┘
```

### Atalhos Úteis

| Ação | Windows | Mac |
|------|---------|-----|
| Clone Repository | Ctrl+Shift+O | Cmd+Shift+O |
| Create New Repository | Ctrl+N | Cmd+N |
| Commit | Ctrl+Enter | Cmd+Enter |
| Push | Ctrl+P | Cmd+P |
| Fetch | Ctrl+Shift+F | Cmd+Shift+F |
| Show in Explorer/Finder | Ctrl+Shift+F | Cmd+Shift+F |

---

## ❓ Problemas Comuns

### Problema 1: "Não vejo os arquivos no GitHub Desktop"

**Sintomas:**
- Copiei os arquivos mas não aparecem na aba "Changes"

**Soluções:**

1. **Verifique o repositório selecionado:**
   - Olhe no topo à esquerda
   - Deve estar em `bot-google-ads-ia`, não em `flaviacapaciacorretora`

2. **Verifique se copiou para pasta correta:**
   - Clique direito no repo → Show in Explorer/Finder
   - Confirme que os arquivos estão lá

3. **Atualize a visualização:**
   - Menu: Repository → Refresh
   - Ou feche e abra o GitHub Desktop

4. **Verifique .gitignore:**
   - Se houver um arquivo `.gitignore`, pode estar ignorando arquivos
   - Normalmente não é problema

---

### Problema 2: "Push falhou"

**Sintomas:**
- Erro ao tentar fazer push
- Mensagem de autenticação

**Soluções:**

1. **Faça login no GitHub:**
   - Menu: File → Options (Windows) ou GitHub Desktop → Preferences (Mac)
   - Aba "Accounts"
   - Clique em "Sign in to GitHub.com"
   - Faça login com suas credenciais

2. **Permissões do repositório:**
   - Verifique se você tem permissão de escrita
   - Se for seu repositório, você tem
   - Se for de outra pessoa, precisa ser colaborador

3. **Token de acesso:**
   - Se solicitado, crie um Personal Access Token em:
   - https://github.com/settings/tokens
   - Use como senha

---

### Problema 3: "Repositório já tem conteúdo conflitante"

**Sintomas:**
- Erro dizendo que há conflitos
- Não consegue fazer push

**Soluções:**

1. **Fazer pull primeiro:**
   - Menu: Repository → Pull
   - Baixa alterações do servidor
   - Depois tente push novamente

2. **Forçar push (cuidado!):**
   - Menu: Repository → Repository Settings
   - Apenas se tiver certeza
   - Pode perder dados

3. **Começar do zero:**
   - Delete o repositório local
   - Clone novamente
   - Copie os arquivos
   - Faça commit e push

---

### Problema 4: "Muitos arquivos (node_modules, etc)"

**Sintomas:**
- GitHub Desktop mostra milhares de arquivos
- Inclui pastas como `node_modules`, `__pycache__`, etc

**Soluções:**

1. **NÃO copie essas pastas:**
   - `node_modules/` (JavaScript)
   - `__pycache__/` (Python)
   - `venv/` ou `env/` (Python virtual env)
   - `dist/` ou `build/` (compilados)

2. **Use .gitignore:**
   - O projeto já tem `.gitignore` configurado
   - Copie o arquivo `.gitignore` também
   - Ele impedirá que essas pastas sejam commitadas

3. **Se já copiou:**
   - Delete essas pastas do novo repositório
   - Faça commit da exclusão
   - Apenas arquivos de código devem ir para o Git

---

### Problema 5: "Commit muito grande"

**Sintomas:**
- Push lento ou falhando
- Mensagem sobre tamanho

**Soluções:**

1. **Verifique se não incluiu:**
   - `node_modules/` - deve ser ~300 MB
   - `venv/` ou `env/` - ambientes Python
   - Arquivos `.env` com secrets (só `.env.example` deve ir)
   - Arquivos compilados

2. **Tamanho normal esperado:**
   - Sem dependências: 5-10 MB
   - Com dependências: 50-100 MB (mas NÃO deve incluir!)

3. **Se commit já foi feito:**
   - Pode precisar refazer
   - Delete o repositório local e comece novamente

---

## ✅ Checklist Final

### Antes de Começar
- [ ] GitHub Desktop instalado
- [ ] Logado na conta GitHub
- [ ] Repositório flaviacapaciacorretora aberto no GitHub Desktop
- [ ] Novo repositório bot-google-ads-ia criado no GitHub.com

### Durante o Processo
- [ ] Clonei bot-google-ads-ia no GitHub Desktop
- [ ] Abri duas janelas do explorador
- [ ] Copiei CONTEÚDO da pasta bot-google-ads (não a pasta inteira)
- [ ] Colei na raiz de bot-google-ads-ia
- [ ] Verifiquei ~50 arquivos no GitHub Desktop
- [ ] NÃO copiei node_modules ou __pycache__

### Commit
- [ ] Revisei arquivos na aba "Changes"
- [ ] Escrevi mensagem de commit clara
- [ ] Cliquei em "Commit to main"

### Push
- [ ] Cliquei em "Push origin"
- [ ] Aguardei upload completar
- [ ] Vi mensagem "Pushed to origin"

### Verificação
- [ ] Acessei github.com/flaviacapacia/bot-google-ads-ia
- [ ] Vejo pastas: api/, bot/, dashboard/, scripts/
- [ ] Vejo README.md renderizado
- [ ] Vejo arquivos de configuração
- [ ] Tudo está lá!

---

## 🎉 Parabéns!

Se seguiu todos os passos, seu bot agora está no novo repositório!

### Próximos Passos

1. **Compartilhe o link:**
   - https://github.com/flaviacapacia/bot-google-ads-ia

2. **Adicione descrição:**
   - No GitHub.com, clique em "About" → Edit
   - Adicione: "Bot inteligente para geração automática de anúncios Google Ads usando IA"

3. **Adicione topics:**
   - No GitHub.com, em "About"
   - Adicione: `google-ads`, `ai`, `bot`, `mistral`, `fastapi`, `react`, `nodejs`

4. **Comece a desenvolver:**
   - Clone o novo repositório
   - Instale dependências
   - Configure .env
   - Execute com Docker Compose

---

## 📚 Documentação Adicional

- [INSTRUCOES_FINAIS.md](INSTRUCOES_FINAIS.md) - Guia resumido
- [ENVIAR_PARA_NOVO_REPO.md](ENVIAR_PARA_NOVO_REPO.md) - Guia completo (linha de comando)
- [MIGRACAO.md](MIGRACAO.md) - Sobre a migração

---

## 💬 Precisa de Ajuda?

Se tiver dúvidas:

1. **Documentação do GitHub Desktop:**
   - https://docs.github.com/en/desktop

2. **Vídeos tutoriais:**
   - YouTube: "Como usar GitHub Desktop"

3. **Issues do projeto:**
   - https://github.com/flaviacapacia/bot-google-ads-ia/issues

---

**Boa sorte! 🚀✨**
