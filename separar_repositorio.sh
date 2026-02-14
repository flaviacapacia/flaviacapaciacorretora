#!/bin/bash

# ═══════════════════════════════════════════════════════════════
#  Script para Separar Bot Google Ads em Repositório Próprio
# ═══════════════════════════════════════════════════════════════

set -e  # Para em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                      ║${NC}"
echo -e "${PURPLE}║          📦 Separar Bot Google Ads - Novo Repositório               ║${NC}"
echo -e "${PURPLE}║                                                                      ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Função para imprimir mensagens
print_step() {
    echo -e "${CYAN}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Verificar se estamos no diretório correto
print_step "Verificando diretório atual..."
if [ ! -d "bot-google-ads" ]; then
    print_error "Pasta 'bot-google-ads' não encontrada!"
    echo "Execute este script a partir da raiz do repositório flaviacapaciacorretora"
    exit 1
fi
print_success "Pasta bot-google-ads encontrada!"

# Definir caminhos
TEMP_DIR="/tmp/bot-google-ads-separado"
SOURCE_DIR="$(pwd)/bot-google-ads"

echo ""
print_step "Configurações:"
echo -e "  ${BLUE}Fonte:${NC} $SOURCE_DIR"
echo -e "  ${BLUE}Destino:${NC} $TEMP_DIR"
echo ""

# Confirmar com usuário
read -p "Deseja continuar? (s/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    print_warning "Operação cancelada pelo usuário"
    exit 0
fi

# Passo 1: Criar/Limpar diretório temporário
echo ""
print_step "Passo 1: Preparando diretório temporário..."
if [ -d "$TEMP_DIR" ]; then
    print_warning "Diretório temporário já existe. Removendo..."
    rm -rf "$TEMP_DIR"
fi
mkdir -p "$TEMP_DIR"
print_success "Diretório temporário criado: $TEMP_DIR"

# Passo 2: Copiar arquivos
echo ""
print_step "Passo 2: Copiando arquivos do bot-google-ads..."
cp -r "$SOURCE_DIR"/* "$TEMP_DIR/" 2>/dev/null || true
cp -r "$SOURCE_DIR"/.* "$TEMP_DIR/" 2>/dev/null || true
print_success "Arquivos copiados com sucesso!"

# Passo 3: Entrar no diretório
cd "$TEMP_DIR"
print_success "Mudou para: $(pwd)"

# Passo 4: Remover .git antigo se existir
echo ""
print_step "Passo 3: Limpando histórico Git antigo..."
if [ -d ".git" ]; then
    rm -rf .git
    print_success "Histórico Git removido"
else
    print_warning "Nenhum histórico Git para remover"
fi

# Passo 5: Inicializar novo repositório
echo ""
print_step "Passo 4: Inicializando novo repositório Git..."
git init
print_success "Repositório Git inicializado!"

# Passo 6: Configurar Git (se necessário)
echo ""
print_step "Passo 5: Configurando Git..."
if ! git config user.name > /dev/null 2>&1; then
    print_warning "Git user.name não configurado"
    read -p "Digite seu nome: " git_name
    git config user.name "$git_name"
fi
if ! git config user.email > /dev/null 2>&1; then
    print_warning "Git user.email não configurado"
    read -p "Digite seu email: " git_email
    git config user.email "$git_email"
fi
print_success "Git configurado!"
echo -e "  Nome: ${BLUE}$(git config user.name)${NC}"
echo -e "  Email: ${BLUE}$(git config user.email)${NC}"

# Passo 7: Verificar estrutura
echo ""
print_step "Passo 6: Verificando estrutura de arquivos..."
echo ""
echo -e "${BLUE}Estrutura do novo repositório:${NC}"
tree -L 2 -a 2>/dev/null || ls -la
echo ""

# Passo 8: Adicionar arquivos
echo ""
print_step "Passo 7: Adicionando arquivos ao Git..."
git add .
FILES_COUNT=$(git diff --cached --numstat | wc -l)
print_success "$FILES_COUNT arquivos adicionados!"

# Passo 9: Mostrar status
echo ""
print_step "Status do Git:"
git status --short

# Passo 10: Fazer commit inicial
echo ""
print_step "Passo 8: Criando commit inicial..."
git commit -m "Initial commit: Bot Google Ads com IA

Sistema completo de geração automática de anúncios para Google Ads usando IA.

Componentes:
- API Node.js + Express
- Bot Python + FastAPI + Mistral AI
- Dashboard React + Vite + Tailwind
- Scripts SQL Server
- Docker Compose

Separado do repositório principal flaviacapaciacorretora para desenvolvimento independente."

print_success "Commit inicial criado!"

# Passo 11: Renomear branch para main
echo ""
print_step "Passo 9: Renomeando branch para 'main'..."
git branch -M main
print_success "Branch renomeada para 'main'"

# Passo 12: Mostrar log
echo ""
print_step "Histórico do Git:"
git log --oneline --decorate

# Passo 13: Instruções finais
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                      ║${NC}"
echo -e "${GREEN}║                    ✓ PREPARAÇÃO CONCLUÍDA!                          ║${NC}"
echo -e "${GREEN}║                                                                      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
echo ""
echo -e "${CYAN}1. Criar o repositório no GitHub:${NC}"
echo "   • Vá para: https://github.com/new"
echo "   • Owner: flaviacapacia"
echo "   • Repository name: bot-google-ads-ia"
echo "   • Description: Sistema de Geração Automática de Anúncios Google Ads com IA"
echo "   • Visibility: Public"
echo "   • NÃO adicione README, .gitignore ou license"
echo "   • Clique em 'Create repository'"
echo ""
echo -e "${CYAN}2. Conectar e fazer push:${NC}"
echo ""
echo -e "${BLUE}cd $TEMP_DIR${NC}"
echo -e "${BLUE}git remote add origin https://github.com/flaviacapacia/bot-google-ads-ia.git${NC}"
echo -e "${BLUE}git push -u origin main${NC}"
echo ""
echo -e "${CYAN}3. Verificar:${NC}"
echo "   • Acesse: https://github.com/flaviacapacia/bot-google-ads-ia"
echo "   • Verifique se todos os arquivos estão lá"
echo ""
echo -e "${YELLOW}⚠️  LEMBRETE:${NC}"
echo "   • Os arquivos estão em: $TEMP_DIR"
echo "   • Você pode deletar após fazer push com sucesso"
echo ""
echo -e "${GREEN}✨ Boa sorte!${NC}"
echo ""

# Perguntar se quer copiar os comandos
echo ""
read -p "Quer copiar os comandos de push? (s/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    COMMANDS="cd $TEMP_DIR
git remote add origin https://github.com/flaviacapacia/bot-google-ads-ia.git
git push -u origin main"
    
    echo "$COMMANDS" | pbcopy 2>/dev/null || echo "$COMMANDS" | xclip -selection clipboard 2>/dev/null || echo "$COMMANDS"
    
    if [ $? -eq 0 ]; then
        print_success "Comandos copiados para clipboard!"
    else
        echo ""
        echo -e "${BLUE}Copie manualmente:${NC}"
        echo ""
        echo "$COMMANDS"
        echo ""
    fi
fi

# Perguntar se quer abrir GitHub
echo ""
read -p "Quer abrir o GitHub para criar o repositório? (s/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    if command -v xdg-open > /dev/null; then
        xdg-open "https://github.com/new" &
    elif command -v open > /dev/null; then
        open "https://github.com/new" &
    else
        print_warning "Não foi possível abrir o navegador automaticamente"
        echo "Abra manualmente: https://github.com/new"
    fi
fi

echo ""
print_success "Script concluído!"
echo ""
