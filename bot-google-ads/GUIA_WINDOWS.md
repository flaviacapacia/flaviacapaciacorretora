# 🪟 Guia de Botões Windows - Bot Google Ads IA

## 📋 Visão Geral

Este guia explica como usar os scripts Windows (.bat) para iniciar e gerenciar o Bot Google Ads com IA.

---

## 🎯 Arquivos Disponíveis

### Scripts Principais

| Arquivo | Descrição | Uso |
|---------|-----------|-----|
| **INICIAR.bat** | Atalho principal | Duplo clique para abrir menu |
| **MENU_WINDOWS.bat** | Menu interativo completo | Todas as opções em um lugar |
| **iniciar_tudo.bat** | Inicia sistema completo | API + Bot + Dashboard |
| **abrir_admin.bat** | Abre painel administrativo | Dashboard no navegador |
| **parar_tudo.bat** | Para todos servidores | Encerra tudo |

### Scripts Individuais

| Arquivo | O que faz | Porta |
|---------|-----------|-------|
| **iniciar_api.bat** | Inicia API Node.js | 3001 |
| **iniciar_bot.bat** | Inicia Bot Python | 8000 |
| **iniciar_dashboard.bat** | Inicia Dashboard React | 3000 |

### Interface Visual

| Arquivo | Descrição |
|---------|-----------|
| **botoes_windows.html** | Página HTML com botões visuais |

---

## 🚀 Como Usar

### Método 1: Duplo Clique (Mais Fácil)

1. **Abra a pasta do projeto**
2. **Duplo clique em `INICIAR.bat`**
3. **Escolha a opção no menu**
4. **Aguarde os servidores iniciarem**
5. **Dashboard abre automaticamente!**

### Método 2: Menu Interativo

1. **Duplo clique em `MENU_WINDOWS.bat`**
2. **Veja o menu com 10 opções**
3. **Digite o número da opção**
4. **Pressione Enter**

```
╔══════════════════════════════════════════════════════════╗
║   1. 🚀 Iniciar Sistema Completo                        ║
║   2. 📊 Abrir Painel Administrativo                     ║
║   3. 🤖 Iniciar apenas Bot Python                       ║
║   4. 🌐 Iniciar apenas API Node.js                      ║
║   5. ⚛️  Iniciar apenas Dashboard React                 ║
║   6. 🛑 Parar Todos os Servidores                       ║
║   7. 📚 Abrir Documentação                              ║
║   8. ⚙️  Configurações (editar .env)                    ║
║   9. ℹ️  Informações do Sistema                         ║
║   0. ❌ Sair                                             ║
╚══════════════════════════════════════════════════════════╝
```

### Método 3: Página HTML

1. **Abra `botoes_windows.html` no navegador**
2. **Clique nos botões visuais**
3. **Confirme quando Windows perguntar**
4. **Scripts executam automaticamente**

---

## 📊 Detalhes de Cada Script

### 1. INICIAR.bat

**O que faz:**
- Abre o MENU_WINDOWS.bat
- Ponto de entrada mais simples

**Como usar:**
```
Duplo clique → Menu abre
```

---

### 2. MENU_WINDOWS.bat

**O que faz:**
- Menu interativo completo
- 10 opções disponíveis
- Interface colorida
- Verificação de status

**Funcionalidades:**
- ✅ Iniciar componentes
- ✅ Parar servidores
- ✅ Abrir documentação
- ✅ Editar configurações
- ✅ Ver informações
- ✅ Verificar portas

**Teclas:**
- `1-9, 0` - Escolher opção
- `Ctrl+C` - Sair

---

### 3. iniciar_tudo.bat

**O que faz:**
1. Inicia Bot Python (porta 8000)
2. Inicia API Node.js (porta 3001)
3. Inicia Dashboard React (porta 3000)
4. Abre cada um em janela separada
5. Abre navegador automaticamente

**Tempo:** ~30 segundos para tudo estar rodando

**O que você verá:**
- 3 janelas CMD abertas (uma para cada serviço)
- Navegador abre em http://localhost:3000
- Dashboard carregando

---

### 4. abrir_admin.bat

**O que faz:**
1. Verifica se servidores estão rodando
2. Se não estiverem, oferece iniciar
3. Abre URLs no navegador:
   - Dashboard (porta 3000)
   - API Health (porta 3001)
   - Bot Docs (porta 8000)

**Uso:**
- Para abrir rapidamente o painel
- Mesmo se já estiver rodando
- Múltiplas abas no navegador

---

### 5. iniciar_api.bat

**O que faz:**
1. Verifica Node.js instalado
2. Instala dependências (npm install)
3. Cria .env se não existir
4. Inicia API na porta 3001

**Comandos executados:**
```batch
cd api
npm install
npm start
```

**URLs:**
- API: http://localhost:3001
- Health: http://localhost:3001/health

---

### 6. iniciar_bot.bat

**O que faz:**
1. Verifica Python instalado
2. Cria ambiente virtual (venv)
3. Instala dependências (pip install)
4. Cria .env se não existir
5. Inicia Bot na porta 8000

**Comandos executados:**
```batch
cd bot
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

**URLs:**
- Bot: http://localhost:8000
- Docs: http://localhost:8000/docs

---

### 7. iniciar_dashboard.bat

**O que faz:**
1. Verifica Node.js instalado
2. Instala dependências (npm install)
3. Cria .env se não existir
4. Inicia Dashboard na porta 3000
5. Abre navegador automaticamente

**Comandos executados:**
```batch
cd dashboard
npm install
npm run dev
```

**URL:**
- Dashboard: http://localhost:3000

---

### 8. parar_tudo.bat

**O que faz:**
1. Encontra processos nas portas 3000, 3001, 8000
2. Mata cada processo
3. Para Node.js e Python restantes
4. Verifica se portas foram liberadas
5. Mostra status final

**Uso:**
- Para encerrar tudo de uma vez
- Libera portas
- Limpa processos

**⚠️ Aviso:** Fecha TODOS os Node.js e Python no sistema!

---

## ⚙️ Configurações

### Editar Variáveis de Ambiente

**Pelo Menu:**
1. Abra MENU_WINDOWS.bat
2. Digite `8` (Configurações)
3. Escolha qual .env editar
4. Notepad abre automaticamente

**Manual:**
1. Navegue até pasta (api, bot ou dashboard)
2. Abra arquivo `.env` no Notepad
3. Configure as variáveis
4. Salve

**Variáveis Importantes:**

**API (.env):**
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
PORT=3001
```

**Bot (.env):**
```env
MISTRAL_API_KEY=sua_chave_aqui
API_URL=http://localhost:3001
PORT=8000
```

**Dashboard (.env):**
```env
VITE_API_URL=http://localhost:3001
```

---

## 🔍 Verificação de Status

### Pelo Menu

1. Abra MENU_WINDOWS.bat
2. Digite `9` (Informações)
3. Veja:
   - Versões instaladas
   - Status dos servidores
   - URLs disponíveis

### Manual (CMD)

```batch
:: Ver processos nas portas
netstat -ano | find ":3000"
netstat -ano | find ":3001"
netstat -ano | find ":8000"

:: Ver todos Node.js
tasklist | find "node.exe"

:: Ver todos Python
tasklist | find "python.exe"
```

---

## 🐛 Solução de Problemas

### Problema 1: "Node.js não encontrado"

**Solução:**
1. Baixe Node.js: https://nodejs.org
2. Instale (marque "Add to PATH")
3. Reinicie CMD
4. Execute script novamente

### Problema 2: "Python não encontrado"

**Solução:**
1. Baixe Python: https://python.org
2. Instale (marque "Add Python to PATH")
3. Reinicie CMD
4. Execute script novamente

### Problema 3: "Porta já em uso"

**Solução 1 - Usar parar_tudo.bat:**
```batch
parar_tudo.bat
```

**Solução 2 - Manual:**
```batch
:: Ver qual processo está na porta
netstat -ano | find ":3000"

:: Matar o processo (substitua PID)
taskkill /PID 12345 /F
```

### Problema 4: "npm install falha"

**Solução:**
```batch
:: Limpar cache
npm cache clean --force

:: Deletar node_modules
rmdir /s /q node_modules

:: Reinstalar
npm install
```

### Problema 5: "pip install falha"

**Solução:**
```batch
:: Atualizar pip
python -m pip install --upgrade pip

:: Instalar com verbose
pip install -r requirements.txt --verbose
```

### Problema 6: "Erro ao conectar banco"

**Solução:**
1. Verifique SQL Server está rodando
2. Confira credenciais no .env
3. Teste conexão manualmente
4. Verifique firewall

### Problema 7: "Dashboard não carrega"

**Solução:**
1. Verifique se API está rodando (porta 3001)
2. Confira VITE_API_URL no dashboard/.env
3. Limpe cache do navegador
4. Tente modo anônimo

---

## 💡 Dicas e Truques

### Atalhos de Teclado

**No CMD:**
- `Ctrl+C` - Para o servidor
- `Seta cima/baixo` - Histórico comandos
- `Tab` - Autocomplete

**No Menu:**
- Números `1-9, 0` - Navegar
- `Ctrl+C` - Sair

### Deixar Rodando em Background

**Opção 1 - Minimizar janelas:**
1. Inicie com `iniciar_tudo.bat`
2. Minimize as 3 janelas CMD
3. Continue usando o PC

**Opção 2 - Docker (recomendado):**
```batch
docker-compose up -d
```

### Agendar Inicialização Automática

1. Pressione `Win+R`
2. Digite `shell:startup`
3. Copie `INICIAR.bat` para lá
4. Renomeie para não abrir menu (opcional)

### Ver Logs em Tempo Real

```batch
:: API
cd api
npm run dev

:: Bot
cd bot
python src/main.py

:: Dashboard
cd dashboard
npm run dev
```

---

## 📚 Comandos Úteis

### Verificar Status

```batch
:: Ver portas em uso
netstat -ano | find "LISTENING"

:: Ver processos Node
tasklist | find "node"

:: Ver processos Python
tasklist | find "python"
```

### Gerenciar Processos

```batch
:: Matar por nome
taskkill /IM node.exe /F
taskkill /IM python.exe /F

:: Matar por PID
taskkill /PID 12345 /F

:: Ver CPU/memória
wmic process where name="node.exe" get ProcessId,WorkingSetSize
```

### Abrir URLs Rapidamente

```batch
:: Dashboard
start http://localhost:3000

:: API
start http://localhost:3001/health

:: Bot Docs
start http://localhost:8000/docs
```

---

## 🎯 Fluxo Recomendado

### Para Primeira Vez

1. ✅ Duplo clique em `INICIAR.bat`
2. ✅ Escolha opção `8` (Configurações)
3. ✅ Configure .env (API Key, DB)
4. ✅ Volte ao menu
5. ✅ Escolha opção `1` (Iniciar tudo)
6. ✅ Aguarde ~30 segundos
7. ✅ Dashboard abre automaticamente
8. ✅ Comece a usar!

### Para Uso Diário

1. ✅ Duplo clique em `iniciar_tudo.bat`
2. ✅ Aguarde abrir
3. ✅ Use normalmente
4. ✅ Quando terminar, execute `parar_tudo.bat`

### Para Desenvolvimento

1. ✅ Abra cada componente separadamente
2. ✅ Use `iniciar_api.bat`
3. ✅ Use `iniciar_bot.bat`
4. ✅ Use `iniciar_dashboard.bat`
5. ✅ Veja logs em cada janela
6. ✅ Desenvolva e teste

---

## 🔗 URLs Importantes

**Sistema Local:**
- Dashboard: http://localhost:3000
- API: http://localhost:3001
- API Health: http://localhost:3001/health
- Bot: http://localhost:8000
- Bot Docs: http://localhost:8000/docs

**Repositório:**
- GitHub: https://github.com/flaviacapacia/bot-google-ads-ia

**Downloads:**
- Node.js: https://nodejs.org
- Python: https://python.org
- Git: https://git-scm.com

---

## ✅ Checklist de Verificação

### Antes de Iniciar

- [ ] Node.js instalado
- [ ] Python instalado
- [ ] Git instalado (opcional)
- [ ] SQL Server configurado
- [ ] Chave Mistral API obtida
- [ ] Arquivos .env configurados

### Após Iniciar

- [ ] 3 janelas CMD abertas
- [ ] Navegador abriu automaticamente
- [ ] Dashboard carregou
- [ ] Não há erros nos logs
- [ ] Consegue listar imóveis
- [ ] Consegue gerar anúncios

---

## 🎉 Pronto!

Agora você tem todos os botões e scripts necessários para usar o Bot Google Ads IA no Windows!

**Comando mais simples:**
```
Duplo clique em INICIAR.bat
```

**Resultado:**
- 🚀 Sistema rodando
- 📊 Dashboard aberto
- 🤖 IA gerando anúncios
- ✅ Tudo funcionando!

---

**Documentação adicional:**
- [GUIA_DE_USO.md](GUIA_DE_USO.md) - Como usar o sistema
- [PROXIMOS_PASSOS.md](../PROXIMOS_PASSOS.md) - O que fazer depois
- [README.md](README.md) - Visão geral do projeto
