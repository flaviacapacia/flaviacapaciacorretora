# Flávia Capacia Corretora - Projetos

---

## ⚠️ 🚀 BOT GOOGLE ADS FOI MOVIDO PARA REPOSITÓRIO PRÓPRIO!

O projeto **Bot Google Ads com IA** agora tem seu próprio repositório independente!

### 👉 **[CLIQUE AQUI PARA ACESSAR O BOT](https://github.com/flaviacapacia/bot-google-ads-ia)**

🎯 **Novo Repositório:** [github.com/flaviacapacia/bot-google-ads-ia](https://github.com/flaviacapacia/bot-google-ads-ia)

📖 **Leia sobre a migração:** [MIGRACAO.md](MIGRACAO.md)

---

## 📋 Descrição

Este repositório contém:

1. **🏠 Site da Imobiliária** - Site institucional HTML/CSS/JS
2. **📝 Sistema de Contatos** - Captura contatos do site e salva em CSV
3. **📚 Documentação** - Guias e tutoriais em português

**Nota:** O Bot Google Ads foi separado e está em: [github.com/flaviacapacia/bot-google-ads-ia](https://github.com/flaviacapacia/bot-google-ads-ia)

---

## 🚀 COMECE AQUI - Para Iniciantes

**Não sabe como abrir o projeto?** Siga estas instruções super simples:

### 📄 Opção 1: Arquivo LAUNCHER (MAIS FÁCIL)

1. Baixe o projeto (botão verde "Code" → "Download ZIP")
2. Extraia o arquivo ZIP na Área de Trabalho
3. Entre na pasta e dê **duplo clique** em: **`LAUNCHER.html`**
4. ✅ Pronto! Tudo será explicado visualmente!

### 📖 Opção 2: Leia o Guia Simples

Abra o arquivo **`LEIA_PRIMEIRO.txt`** para instruções em texto puro (3 passos).

### 📚 Opção 3: Guia Detalhado

Leia **`COMO_ABRIR_HTML.md`** para guia completo com todos os métodos.

---

## 📥 Como Baixar Este Projeto

### Primeira Vez (Clone)

```bash
git clone https://github.com/flaviacapacia/flaviacapaciacorretora.git
cd flaviacapaciacorretora
```

### Atualizar (Pull)

```bash
cd flaviacapaciacorretora
git pull origin copilot/create-ads-generation-bot
```

### Scripts Automáticos

**Linux/Mac:**
```bash
./atualizar.sh
```

**Windows:**
```
atualizar.bat
```

📖 **Guia completo:** [COMO_BAIXAR.md](COMO_BAIXAR.md)

---

## 📱 Como Visualizar as Interfaces

### Opção 1: Página de Início

Abra o arquivo `start.html` no navegador para escolher qual interface visualizar:

```bash
# Abrir diretamente
open start.html        # Mac
xdg-open start.html    # Linux
start start.html       # Windows
```

### Opção 2: Scripts Automáticos

**Linux/Mac:**
```bash
./visualizar.sh
```

**Windows:**
```
visualizar.bat
```

### Opção 3: Manual

**Site Principal:**
```bash
python3 -m http.server 8080
# Acesse: http://localhost:8080
```

**Dashboard React:**
```bash
cd bot-google-ads/dashboard
npm install
npm run dev
# Acesse: http://localhost:3000
```

📖 **Guia completo:** [COMO_VISUALIZAR.md](COMO_VISUALIZAR.md)

---

## 🤖 Bot Google Ads com IA

Sistema completo para geração automática de anúncios Google Ads usando Inteligência Artificial (Mistral AI).

### Como Usar

```bash
# Mudar para a branch do bot
git checkout copilot/create-ads-generation-bot

# Acessar a pasta do projeto
cd bot-google-ads

# Ler a documentação
cat README.md
```

### Documentação Completa

- **[bot-google-ads/README.md](bot-google-ads/README.md)** - Visão geral
- **[bot-google-ads/GUIA_DE_USO.md](bot-google-ads/GUIA_DE_USO.md)** - Tutorial completo
- **[bot-google-ads/ARQUITETURA.md](bot-google-ads/ARQUITETURA.md)** - Detalhes técnicos

---

## 📝 Sistema de Contatos

Sistema para capturar contatos do site e salvar em **planilha CSV**, preparado para futura integração com **Django/SQL**.

## 🚀 Como usar

### 1. Instalar dependências
```bash
pip install flask flask-cors
```

### 2. Executar o servidor Python
```bash
python backend/salvar_contatos.py
```

Será exibido:
```
🚀 Servidor rodando em http://localhost:5000
💾 Contatos sendo salvos em: contatos.csv
```

### 3. Testar o formulário
- Abra o navegador: `http://localhost:8000/contato.html` (ou seu servidor local)
- Preencha o formulário
- Clique em "Quero mais informações"
- Os dados serão salvos em `contatos.csv`

## 📊 Arquivo CSV gerado
```
Nome,Telefone,Email,Mensagem,Data
João Silva,48999999999,joao@email.com,Quero mais informações sobre o imóvel V439,09/02/2026 14:30:45
Maria Santos,48988888888,maria@email.com,Interessada no apartamento do Centro,09/02/2026 14:35:20
```

## 🔗 Endpoints disponíveis

### POST `/salvar-contato`
Salva um novo contato

**Request:**
```json
{
  "nome": "João Silva",
  "telefone": "48999999999",
  "email": "joao@email.com",
  "mensagem": "Quero mais informações",
  "data": "09/02/2026 14:30:45"
}
```

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Contato salvo com sucesso!"
}
```

### GET `/listar-contatos`
Lista todos os contatos salvos

**Response:**
```json
{
  "contatos": [
    {
      "Nome": "João Silva",
      "Telefone": "48999999999",
      "Email": "joao@email.com",
      "Mensagem": "Quero mais informações",
      "Data": "09/02/2026 14:30:45"
    }
  ]
}
```

## 🔄 Próximos passos (Django/SQL)

1. **Migrar para Django:**
   ```bash
   python manage.py startapp contatos
   ```

2. **Criar modelo:**
   ```python
   class Contato(models.Model):
       nome = models.CharField(max_length=100)
       telefone = models.CharField(max_length=20)
       email = models.EmailField()
       mensagem = models.TextField()
       data = models.DateTimeField(auto_now_add=True)
   ```

3. **Criar view e API:**
   - Usar Django REST Framework
   - Salvar direto no banco de dados

4. **Exportar para Excel:**
   - Usar `openpyxl` ou `xlsxwriter`

## ⚠️ Notas
- O servidor precisa estar rodando para o formulário funcionar
- Os dados são salvos em `contatos.csv` na raiz do projeto
- Para produção, migrar para banco de dados SQL + Django
