#!/bin/bash

# ╔══════════════════════════════════════════════════════════════════════╗
# ║                                                                      ║
# ║     📤 Atualizar Scripts Windows no Novo Repositório               ║
# ║                                                                      ║
# ╚══════════════════════════════════════════════════════════════════════╝

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${PURPLE}📦 Este script vai copiar os novos scripts Windows para o${NC}"
echo -e "${PURPLE}   repositório bot-google-ads-ia que você tem aberto no VS Code${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Perguntar o caminho do repositório
echo -e "${CYAN}📍 Onde está o repositório bot-google-ads-ia no seu PC?${NC}"
echo ""
echo "Exemplos:"
echo "  /home/usuario/projetos/bot-google-ads-ia"
echo "  ~/Desktop/bot-google-ads-ia"
echo "  ~/Documents/bot-google-ads-ia"
echo ""
read -p "Digite o caminho completo: " REPO_PATH

# Expandir ~ se presente
REPO_PATH="${REPO_PATH/#\~/$HOME}"

# Verificar se o caminho existe
if [ ! -d "$REPO_PATH" ]; then
    echo ""
    echo -e "${RED}❌ ERRO: Caminho não encontrado!${NC}"
    echo "   $REPO_PATH"
    echo ""
    echo -e "${YELLOW}💡 Dicas:${NC}"
    echo "   • Verifique se o caminho está correto"
    echo "   • Use Tab para autocompletar"
    echo "   • Use pwd para ver o caminho atual"
    echo ""
    exit 1
fi

# Verificar se é um repositório
if [ ! -d "$REPO_PATH/.git" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  AVISO: Este não parece ser um repositório Git${NC}"
    echo "   Não encontrei a pasta .git em:"
    echo "   $REPO_PATH"
    echo ""
    read -p "Deseja continuar mesmo assim? (s/N): " CONTINUAR
    if [[ ! "$CONTINUAR" =~ ^[Ss]$ ]]; then
        echo ""
        echo -e "${RED}❌ Operação cancelada pelo usuário${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}✓ Caminho confirmado: $REPO_PATH${NC}"
echo ""

echo -e "${BLUE}▶ Preparando para copiar arquivos...${NC}"
echo ""

# Lista de arquivos a copiar
FILES=(
    "bot-google-ads/GUIA_WINDOWS.md"
    "bot-google-ads/INICIAR.bat"
    "bot-google-ads/MENU_WINDOWS.bat"
    "bot-google-ads/abrir_admin.bat"
    "bot-google-ads/botoes_windows.html"
    "bot-google-ads/criar_atalhos.bat"
    "bot-google-ads/remover_atalhos.bat"
    "bot-google-ads/iniciar_api.bat"
    "bot-google-ads/iniciar_bot.bat"
    "bot-google-ads/iniciar_dashboard.bat"
    "bot-google-ads/iniciar_tudo.bat"
    "bot-google-ads/parar_tudo.bat"
)

# Copiar arquivos
COPIED=0
FAILED=0

for FILE in "${FILES[@]}"; do
    FILENAME=$(basename "$FILE")
    
    if [ -f "$FILE" ]; then
        echo -e "${CYAN}📄 Copiando: $FILENAME${NC}"
        if cp "$FILE" "$REPO_PATH/"; then
            ((COPIED++))
            echo -e "${GREEN}   ✓ Copiado com sucesso${NC}"
        else
            ((FAILED++))
            echo -e "${RED}   ❌ Falha ao copiar${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Arquivo não encontrado: $FILENAME${NC}"
        ((FAILED++))
    fi
    echo ""
done

# Resumo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${PURPLE}📊 RESUMO:${NC}"
echo ""
echo -e "   ${GREEN}✓ Arquivos copiados: $COPIED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "   ${RED}❌ Falhas: $FAILED${NC}"
fi
echo -e "   ${CYAN}📁 Destino: $REPO_PATH${NC}"
echo ""

if [ $COPIED -gt 0 ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${GREEN}✅ SUCESSO! Arquivos copiados para o repositório!${NC}"
    echo ""
    echo -e "${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
    echo ""
    echo "   1. No VS Code, você verá os novos arquivos"
    echo ""
    echo "   2. Adicione ao Git:"
    echo -e "      ${CYAN}git add *.bat *.html GUIA_WINDOWS.md${NC}"
    echo ""
    echo "   3. Faça commit:"
    echo -e "      ${CYAN}git commit -m \"Add Windows desktop scripts\"${NC}"
    echo ""
    echo "   4. Faça push:"
    echo -e "      ${CYAN}git push${NC}"
    echo ""
    echo "   5. Execute criar_atalhos.bat no Windows para criar atalhos!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Perguntar se quer abrir o repositório
    read -p "Deseja abrir a pasta no gerenciador de arquivos? (s/N): " ABRIR
    if [[ "$ABRIR" =~ ^[Ss]$ ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "$REPO_PATH"
        elif command -v open &> /dev/null; then
            open "$REPO_PATH"
        else
            echo -e "${YELLOW}⚠️  Não foi possível abrir automaticamente${NC}"
        fi
    fi
else
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${RED}❌ ERRO: Nenhum arquivo foi copiado!${NC}"
    echo ""
    echo -e "${YELLOW}💡 Verifique:${NC}"
    echo "   • Se você está executando do lugar correto"
    echo "   • Se os arquivos existem na pasta bot-google-ads"
    echo "   • Se tem permissão de escrita no destino"
    echo ""
fi

echo ""
