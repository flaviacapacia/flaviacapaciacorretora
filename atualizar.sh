#!/bin/bash

# Script para baixar/atualizar o projeto Bot Google Ads
# Execute este script para atualizar o projeto automaticamente

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║           📥 Atualizando Projeto - Flávia Capacia                   ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se estamos em um repositório git
if [ ! -d .git ]; then
    echo -e "${RED}❌ Erro: Esta pasta não é um repositório git${NC}"
    echo ""
    echo "Se é a primeira vez, clone o repositório:"
    echo "git clone https://github.com/flaviacapacia/flaviacapaciacorretora.git"
    exit 1
fi

echo "📍 Pasta atual: $(pwd)"
echo ""

# Verificar branch atual
current_branch=$(git branch --show-current)
echo -e "📌 Branch atual: ${YELLOW}$current_branch${NC}"
echo ""

# Perguntar se quer mudar para a branch do bot
if [ "$current_branch" != "copilot/create-ads-generation-bot" ]; then
    echo -e "${YELLOW}⚠️  Você não está na branch do Bot Google Ads${NC}"
    echo ""
    read -p "Deseja mudar para copilot/create-ads-generation-bot? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[SsYy]$ ]]; then
        echo "🔄 Mudando para branch copilot/create-ads-generation-bot..."
        git checkout copilot/create-ads-generation-bot
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Erro ao mudar de branch${NC}"
            exit 1
        fi
        echo -e "${GREEN}✅ Branch alterada com sucesso${NC}"
        echo ""
    fi
fi

# Verificar se há mudanças locais
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Você tem mudanças locais não commitadas${NC}"
    echo ""
    git status --short
    echo ""
    read -p "Deseja salvar suas mudanças temporariamente? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[SsYy]$ ]]; then
        echo "💾 Salvando mudanças locais..."
        git stash
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Erro ao salvar mudanças${NC}"
            exit 1
        fi
        echo -e "${GREEN}✅ Mudanças salvas temporariamente${NC}"
        echo ""
        STASHED=true
    else
        echo ""
        read -p "Deseja descartar suas mudanças? (s/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[SsYy]$ ]]; then
            echo "🗑️  Descartando mudanças locais..."
            git reset --hard
            git clean -fd
            echo -e "${GREEN}✅ Mudanças descartadas${NC}"
            echo ""
        else
            echo -e "${RED}❌ Operação cancelada${NC}"
            echo "Resolva as mudanças locais antes de continuar"
            exit 1
        fi
    fi
fi

# Fazer fetch
echo "🔄 Buscando atualizações do GitHub..."
git fetch origin
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao buscar atualizações${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Atualizações buscadas${NC}"
echo ""

# Fazer pull
echo "⬇️  Baixando atualizações..."
git pull origin copilot/create-ads-generation-bot
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao fazer pull${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Projeto atualizado com sucesso!${NC}"
echo ""

# Restaurar mudanças se foram salvas
if [ "$STASHED" = true ]; then
    echo "♻️  Restaurando suas mudanças locais..."
    git stash pop
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️  Houve conflitos ao restaurar suas mudanças${NC}"
        echo "Resolva os conflitos manualmente"
    else
        echo -e "${GREEN}✅ Mudanças restauradas${NC}"
    fi
    echo ""
fi

# Mostrar últimos commits
echo "📝 Últimas atualizações:"
echo ""
git log --oneline -5
echo ""

# Informações adicionais
echo "══════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}🎉 Projeto atualizado com sucesso!${NC}"
echo ""
echo "📂 Arquivos importantes:"
echo "   • bot-google-ads/README.md         - Documentação principal"
echo "   • bot-google-ads/GUIA_DE_USO.md   - Tutorial completo"
echo "   • bot-google-ads/ARQUITETURA.md   - Detalhes técnicos"
echo ""
echo "🚀 Para iniciar o Bot Google Ads:"
echo "   cd bot-google-ads"
echo "   ./start.sh"
echo ""
echo "══════════════════════════════════════════════════════════════════════"
