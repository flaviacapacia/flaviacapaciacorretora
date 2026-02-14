#!/bin/bash

#==============================================================================
# Script: Enviar Arquivos para Novo Repositório
# Descrição: Copia arquivos do bot-google-ads para o novo repositório
# Uso: ./enviar_arquivos.sh
#==============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# URLs
REPO_ATUAL=$(pwd)
NOVO_REPO_URL="https://github.com/flaviacapacia/bot-google-ads-ia.git"
PASTA_BOT="bot-google-ads"
DESTINO="/tmp/bot-google-ads-ia-temp"

# Banner
clear
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                      ║${NC}"
echo -e "${PURPLE}║          ${BOLD}📤 Enviar Arquivos para Novo Repositório${NC}${PURPLE}                ║${NC}"
echo -e "${PURPLE}║                                                                      ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Função para exibir status
print_step() {
    echo -e "${CYAN}▶ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

# Verificar se a pasta bot-google-ads existe
print_step "Verificando pasta bot-google-ads..."
if [ ! -d "$PASTA_BOT" ]; then
    print_error "Pasta bot-google-ads não encontrada!"
    print_info "Certifique-se de executar este script na raiz do repositório."
    exit 1
fi
print_success "Pasta encontrada!"

# Verificar se Git está instalado
print_step "Verificando Git..."
if ! command -v git &> /dev/null; then
    print_error "Git não está instalado!"
    exit 1
fi
print_success "Git instalado!"

# Exibir informações
echo ""
echo -e "${BOLD}Configurações:${NC}"
echo -e "  ${CYAN}Repositório atual:${NC} $REPO_ATUAL"
echo -e "  ${CYAN}Pasta origem:${NC} $PASTA_BOT"
echo -e "  ${CYAN}Novo repositório:${NC} $NOVO_REPO_URL"
echo -e "  ${CYAN}Destino temporário:${NC} $DESTINO"
echo ""

# Perguntar confirmação
read -p "$(echo -e ${YELLOW}Deseja continuar? \(s/N\): ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    print_warning "Operação cancelada."
    exit 0
fi

echo ""
print_step "Iniciando processo..."
echo ""

# Passo 1: Limpar diretório temporário se existir
print_step "Passo 1: Limpando diretório temporário..."
if [ -d "$DESTINO" ]; then
    rm -rf "$DESTINO"
    print_success "Diretório temporário removido"
fi

# Passo 2: Clonar o novo repositório
print_step "Passo 2: Clonando novo repositório..."
print_info "Isso pode levar alguns segundos..."
if git clone "$NOVO_REPO_URL" "$DESTINO" 2>/dev/null; then
    print_success "Repositório clonado com sucesso!"
else
    print_error "Erro ao clonar repositório."
    print_info "Verifique se você tem acesso ao repositório: $NOVO_REPO_URL"
    print_info "Você pode precisar configurar suas credenciais Git."
    exit 1
fi

# Passo 3: Copiar arquivos
print_step "Passo 3: Copiando arquivos do bot-google-ads..."
cp -r "$PASTA_BOT"/* "$DESTINO/" 2>/dev/null || true
cp "$PASTA_BOT"/.env.example "$DESTINO/" 2>/dev/null || true
cp "$PASTA_BOT"/.gitignore "$DESTINO/" 2>/dev/null || true
print_success "Arquivos copiados!"

# Contar arquivos copiados
NUM_ARQUIVOS=$(find "$DESTINO" -type f | wc -l)
print_info "Total de arquivos: $NUM_ARQUIVOS"

# Passo 4: Adicionar arquivos ao Git
print_step "Passo 4: Adicionando arquivos ao Git..."
cd "$DESTINO"
git add .
print_success "Arquivos adicionados ao staging!"

# Verificar arquivos
print_info "Arquivos a serem commitados:"
git status --short | head -20
if [ $(git status --short | wc -l) -gt 20 ]; then
    echo "  ... e mais arquivos"
fi

# Passo 5: Criar commit
print_step "Passo 5: Criando commit..."
COMMIT_MSG="Add complete bot-google-ads project files

- Node.js API with Express
- Python bot with FastAPI and Mistral AI
- React dashboard with Tailwind CSS
- SQL Server database scripts
- Docker Compose setup
- Complete documentation in Portuguese
- All configuration files and examples"

git commit -m "$COMMIT_MSG"
print_success "Commit criado!"

# Passo 6: Instruções finais
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                      ║${NC}"
echo -e "${PURPLE}║                    ${BOLD}✓ PREPARAÇÃO CONCLUÍDA!${NC}${PURPLE}                         ║${NC}"
echo -e "${PURPLE}║                                                                      ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

print_success "Todos os arquivos foram preparados e commitados localmente!"
echo ""

print_warning "PRÓXIMO PASSO FINAL:"
echo ""
echo -e "${BOLD}Execute os comandos abaixo para enviar ao GitHub:${NC}"
echo ""
echo -e "${CYAN}cd $DESTINO${NC}"
echo -e "${CYAN}git push -u origin main${NC}"
echo ""

print_info "Ou, se você estiver usando 'master' como branch principal:"
echo -e "${CYAN}git push -u origin master${NC}"
echo ""

print_warning "IMPORTANTE:"
echo "  • Você precisará das suas credenciais GitHub"
echo "  • Se for repositório privado, configure um Personal Access Token"
echo "  • Depois do push, os arquivos estarão no GitHub!"
echo ""

# Opção de fazer push agora
read -p "$(echo -e ${YELLOW}Deseja tentar fazer o push agora? \(s/N\): ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    echo ""
    print_step "Tentando fazer push..."
    
    # Verificar branch
    BRANCH=$(git branch --show-current)
    print_info "Branch atual: $BRANCH"
    
    if git push -u origin "$BRANCH"; then
        echo ""
        print_success "🎉 Push realizado com sucesso!"
        print_success "Arquivos enviados para: $NOVO_REPO_URL"
        echo ""
        print_info "Acesse: https://github.com/flaviacapacia/bot-google-ads-ia"
    else
        echo ""
        print_error "Erro ao fazer push."
        print_info "Você pode tentar manualmente com:"
        echo -e "${CYAN}cd $DESTINO${NC}"
        echo -e "${CYAN}git push -u origin $BRANCH${NC}"
    fi
else
    print_info "Você pode fazer o push manualmente quando quiser."
fi

echo ""
print_step "Localização dos arquivos preparados:"
echo -e "  ${CYAN}$DESTINO${NC}"
echo ""

# Opção de abrir diretório
if command -v xdg-open &> /dev/null; then
    read -p "$(echo -e ${YELLOW}Deseja abrir o diretório no gerenciador de arquivos? \(s/N\): ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[SsYy]$ ]]; then
        xdg-open "$DESTINO" 2>/dev/null || nautilus "$DESTINO" 2>/dev/null || true
    fi
elif command -v open &> /dev/null; then
    read -p "$(echo -e ${YELLOW}Deseja abrir o diretório no Finder? \(s/N\): ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[SsYy]$ ]]; then
        open "$DESTINO"
    fi
fi

echo ""
print_success "✨ Processo concluído!"
echo ""
