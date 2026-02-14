# 📦 Como Separar o Bot Google Ads em Repositório Próprio

## 🎯 Objetivo

Mover o projeto `bot-google-ads` deste repositório para um novo repositório independente na conta **flaviacapacia**.

---

## 📋 Visão Geral

**Repositório Atual:**
```
flaviacapacia/flaviacapaciacorretora
└── bot-google-ads/
    ├── api/
    ├── bot/
    ├── dashboard/
    ├── scripts/
    └── ...
```

**Novo Repositório:**
```
flaviacapacia/bot-google-ads-ia
├── api/
├── bot/
├── dashboard/
├── scripts/
└── ...
```

---

## 🚀 Método 1: Usando Script Automatizado (RECOMENDADO)

### Passo 1: Execute o Script

**Linux/Mac:**
```bash
chmod +x separar_repositorio.sh
./separar_repositorio.sh
```

**Windows:**
```cmd
separar_repositorio.bat
```

### Passo 2: Siga as Instruções

O script vai:
1. ✅ Criar pasta temporária
2. ✅ Copiar apenas a pasta `bot-google-ads`
3. ✅ Inicializar novo repositório Git
4. ✅ Criar commit inicial
5. ✅ Preparar para push

### Passo 3: Criar Repositório no GitHub

1. Vá para: https://github.com/new
2. **Owner:** flaviacapacia
3. **Repository name:** bot-google-ads-ia
4. **Description:** Sistema de Geração Automática de Anúncios Google Ads com IA (Mistral)
5. **Visibility:** Public (ou Private se preferir)
6. ❌ **NÃO marque** "Add a README file"
7. ❌ **NÃO adicione** .gitignore
8. ❌ **NÃO escolha** license
9. Clique em **"Create repository"**

### Passo 4: Fazer Push

O GitHub vai mostrar comandos. Use estes (o script já preparou):

```bash
cd /tmp/bot-google-ads-separado
git remote add origin https://github.com/flaviacapacia/bot-google-ads-ia.git
git branch -M main
git push -u origin main
```

### Passo 5: Verificar

Acesse: https://github.com/flaviacapacia/bot-google-ads-ia

Deve ver toda a estrutura do bot!

---

## 🔧 Método 2: Manual Passo a Passo

Se preferir fazer manualmente sem scripts:

### Passo 1: Criar Nova Pasta

```bash
# Vá para um local temporário
cd /tmp

# Crie nova pasta
mkdir bot-google-ads-separado
cd bot-google-ads-separado
```

### Passo 2: Copiar Arquivos do Bot

```bash
# Copie a pasta bot-google-ads completa
cp -r /caminho/para/flaviacapaciacorretora/bot-google-ads/* .

# Certifique-se de copiar arquivos ocultos também
cp -r /caminho/para/flaviacapaciacorretora/bot-google-ads/.* . 2>/dev/null || true
```

### Passo 3: Inicializar Git

```bash
# Inicialize repositório Git
git init

# Adicione todos os arquivos
git add .

# Faça commit inicial
git commit -m "Initial commit: Bot Google Ads com IA"
```

### Passo 4: Criar Repositório no GitHub

Siga o **Passo 3** do Método 1 acima.

### Passo 5: Conectar e Fazer Push

```bash
# Adicione o remote
git remote add origin https://github.com/flaviacapacia/bot-google-ads-ia.git

# Renomeie branch para main
git branch -M main

# Faça push
git push -u origin main
```

---

## 📝 Método 3: Preservando Histórico Git (Avançado)

Se quiser manter o histórico de commits apenas da pasta `bot-google-ads`:

### Usando git filter-repo

```bash
# Instale git-filter-repo primeiro
pip install git-filter-repo

# Clone o repositório original
git clone https://github.com/flaviacapacia/flaviacapaciacorretora.git temp-repo
cd temp-repo

# Checkout na branch correta
git checkout copilot/create-ads-generation-bot

# Filtre apenas a pasta bot-google-ads
git filter-repo --path bot-google-ads/ --path-rename bot-google-ads/:

# Agora todo o histórico é apenas do bot-google-ads
# Adicione o novo remote
git remote add origin https://github.com/flaviacapacia/bot-google-ads-ia.git

# Push
git push -u origin main
```

**⚠️ Atenção:** Este método é mais complexo e requer git-filter-repo instalado.

---

## 🔗 Atualizar Referências

Após separar, você vai querer atualizar as referências:

### No Repositório Original (flaviacapaciacorretora)

Adicione um README na pasta bot-google-ads:

```markdown
# Bot Google Ads com IA

⚠️ **Este projeto foi movido para um repositório próprio!**

## 📦 Novo Repositório

👉 **https://github.com/flaviacapacia/bot-google-ads-ia**

Toda a documentação, código e atualizações agora estão no repositório acima.

## 🚀 Como Usar

Visite o novo repositório para:
- Documentação completa
- Instalação e configuração
- Últimas atualizações
- Contribuições

---

Este diretório foi mantido apenas para referência histórica.
```

### No Novo Repositório (bot-google-ads-ia)

Atualize o README.md principal para mencionar:

```markdown
## 📜 Histórico

Este projeto foi originalmente parte de:
https://github.com/flaviacapacia/flaviacapaciacorretora

Foi separado em repositório próprio para melhor organização e desenvolvimento independente.
```

---

## 🎯 Estrutura do Novo Repositório

```
bot-google-ads-ia/
├── api/                          # Node.js API
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── bot/                          # Python Bot com IA
│   ├── src/
│   ├── requirements.txt
│   └── Dockerfile
├── dashboard/                    # React Dashboard
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── scripts/                      # Scripts SQL
│   └── init_database.sql
├── docker-compose.yml
├── README.md
├── GUIA_DE_USO.md
├── ARQUITETURA.md
├── PROJETO_COMPLETO.md
├── SECURITY.md
├── .env.example
├── .gitignore
└── LICENSE
```

---

## 📚 Documentação a Mover

Arquivos que devem estar no novo repositório:

**✅ Incluir:**
- README.md (do bot-google-ads)
- GUIA_DE_USO.md
- ARQUITETURA.md
- PROJETO_COMPLETO.md
- SECURITY.md
- .env.example
- start.sh
- Todo conteúdo de api/, bot/, dashboard/, scripts/

**❌ Não incluir:**
- Arquivos HTML do site principal (index.html, sobre.html, etc)
- Imagens da pasta img/ (do site)
- CSS da pasta css/ (do site)
- LAUNCHER.html, start.html, inicializar.html (são do repo principal)

---

## 🔐 Configurações Importantes

### .gitignore para o Novo Repositório

Já está incluído em `bot-google-ads/.gitignore`, mas certifique-se de ter:

```gitignore
# Node.js
node_modules/
npm-debug.log
yarn-error.log
.env

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Database
*.db
*.sqlite

# Build
dist/
build/
*.egg-info/
```

### Secrets e Environment Variables

**⚠️ IMPORTANTE:** Antes de fazer push, certifique-se de:

1. ✅ Não incluir arquivos `.env` com credenciais reais
2. ✅ Usar apenas `.env.example` com valores de exemplo
3. ✅ Verificar se há API keys no código
4. ✅ Remover qualquer informação sensível

---

## 🚦 Checklist de Verificação

Antes de fazer push, verifique:

- [ ] Todos os arquivos do bot foram copiados
- [ ] Não há arquivos do site principal (index.html, css/, img/)
- [ ] .gitignore está correto
- [ ] .env.example existe (sem valores reais)
- [ ] README.md está atualizado
- [ ] docker-compose.yml funciona
- [ ] Sem credenciais ou secrets no código
- [ ] Documentação está completa
- [ ] LICENSE foi adicionada (se aplicável)

---

## 🎨 Personalizar o Novo Repositório

Após criar, personalize:

### 1. Adicionar Topics

No GitHub, adicione tags:
- `google-ads`
- `artificial-intelligence`
- `mistral-ai`
- `nodejs`
- `python`
- `react`
- `fastapi`
- `real-estate`
- `ad-generation`

### 2. Adicionar Descrição

```
Sistema inteligente de geração automática de anúncios para Google Ads usando IA (Mistral). Bot com análise de mercado, scraping de blog e dashboard React.
```

### 3. Adicionar Website

```
https://www.flaviacapaciacorretora.com
```

### 4. Configurar GitHub Pages (Opcional)

Se quiser hospedar documentação:
- Settings → Pages
- Source: main branch / docs folder
- Salvar

### 5. Proteger Branch Main

- Settings → Branches
- Add rule para `main`
- Requer pull request reviews
- Requer status checks

---

## 🔄 Manter Dois Repositórios Sincronizados

Se quiser manter ambos ativos:

### Opção 1: Git Submodule

No repositório principal:

```bash
cd flaviacapaciacorretora
git rm -r bot-google-ads
git submodule add https://github.com/flaviacapacia/bot-google-ads-ia.git bot-google-ads
git commit -m "Convert bot-google-ads to submodule"
```

### Opção 2: Referência Manual

Mantenha apenas um README com link:

```bash
cd bot-google-ads
# Remova todo o conteúdo
rm -rf *
# Crie apenas um README
echo "Projeto movido para: https://github.com/flaviacapacia/bot-google-ads-ia" > README.md
```

---

## 📞 Suporte

Se tiver problemas:

1. **Erro ao fazer push:**
   - Verifique se tem permissão no repositório
   - Confirme que o remote está correto
   - Tente autenticar novamente

2. **Arquivos faltando:**
   - Verifique se copiou arquivos ocultos (`.env.example`, `.gitignore`)
   - Use `ls -la` para ver todos os arquivos

3. **Histórico perdido:**
   - Normal se usou Método 1 ou 2
   - Use Método 3 se precisar preservar histórico

4. **Conflitos:**
   - Se já criou o repo com README, delete e recrie
   - Ou force push: `git push -f origin main` (cuidado!)

---

## 🎉 Pronto!

Após seguir estes passos, você terá:

✅ **Repositório separado:** `flaviacapacia/bot-google-ads-ia`
✅ **Organização melhor:** Código do bot isolado
✅ **Fácil de compartilhar:** Link específico para o bot
✅ **Desenvolvimento independente:** Commits separados
✅ **Documentação focada:** Apenas sobre o bot

**Novo repositório:**
👉 https://github.com/flaviacapacia/bot-google-ads-ia

---

## 📖 Próximos Passos

Após separar:

1. ✅ Configure CI/CD (GitHub Actions)
2. ✅ Adicione badges no README
3. ✅ Configure Dependabot para segurança
4. ✅ Crie releases e tags
5. ✅ Convide colaboradores
6. ✅ Configure issues e projects
7. ✅ Adicione CODE_OF_CONDUCT.md
8. ✅ Adicione CONTRIBUTING.md

Seu bot agora tem casa própria! 🏠✨
