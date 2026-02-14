# Flávia Capacia Corretora - Projetos

## 📋 Descrição

Repositório com projetos para Flávia Capacia Corretora:

1. **🤖 Bot Google Ads com IA** - Sistema inteligente de geração automática de anúncios (Branch: `copilot/create-ads-generation-bot`)
2. **📝 Sistema de Contatos** - Captura contatos do site e salva em CSV

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
