#!/bin/bash

# Script para visualizar interfaces do projeto
# Flávia Capacia Corretora

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║          📱 Visualizar Interfaces - Flávia Capacia                  ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para abrir URL no navegador
open_browser() {
    local url=$1
    echo ""
    echo -e "${GREEN}🌐 Abrindo navegador em: ${BLUE}$url${NC}"
    echo ""
    
    # Detectar sistema operacional e abrir navegador
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$url" 2>/dev/null || echo "Abra manualmente: $url"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "$url"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        start "$url"
    else
        echo "Abra manualmente no navegador: $url"
    fi
}

# Menu principal
echo "Escolha qual interface você quer visualizar:"
echo ""
echo "1. 🏠 Site Principal (Imobiliária)"
echo "2. 🤖 Dashboard React (Bot Google Ads)"
echo "3. 🐳 Sistema Completo (Docker)"
echo "4. ❌ Cancelar"
echo ""
read -p "Digite sua escolha (1-4): " choice

case $choice in
    1)
        echo ""
        echo "═══════════════════════════════════════════════════════════════════════"
        echo -e "${BLUE}🏠 Iniciando Site Principal${NC}"
        echo "═══════════════════════════════════════════════════════════════════════"
        echo ""
        
        # Verificar se Python está instalado
        if command -v python3 &> /dev/null; then
            PYTHON_CMD="python3"
        elif command -v python &> /dev/null; then
            PYTHON_CMD="python"
        else
            echo -e "${RED}❌ Python não encontrado!${NC}"
            echo ""
            echo "Instale Python ou abra index.html diretamente no navegador"
            exit 1
        fi
        
        echo -e "${GREEN}✅ Python encontrado: $PYTHON_CMD${NC}"
        echo ""
        echo "🚀 Iniciando servidor HTTP na porta 8080..."
        echo ""
        echo -e "${YELLOW}Páginas disponíveis:${NC}"
        echo "  • Home: http://localhost:8080/index.html"
        echo "  • Sobre: http://localhost:8080/sobre.html"
        echo "  • Imóveis: http://localhost:8080/imoveis-cadastrados.html"
        echo "  • Blog: http://localhost:8080/blog.html"
        echo "  • Contato: http://localhost:8080/contato.html"
        echo ""
        echo -e "${YELLOW}💡 Pressione Ctrl+C para parar o servidor${NC}"
        echo ""
        
        # Aguardar 2 segundos e abrir navegador
        sleep 2
        open_browser "http://localhost:8080/index.html"
        
        # Iniciar servidor
        $PYTHON_CMD -m http.server 8080
        ;;
        
    2)
        echo ""
        echo "═══════════════════════════════════════════════════════════════════════"
        echo -e "${BLUE}🤖 Iniciando Dashboard React${NC}"
        echo "═══════════════════════════════════════════════════════════════════════"
        echo ""
        
        # Verificar se Node.js está instalado
        if ! command -v node &> /dev/null; then
            echo -e "${RED}❌ Node.js não encontrado!${NC}"
            echo ""
            echo "Instale Node.js em: https://nodejs.org"
            exit 1
        fi
        
        echo -e "${GREEN}✅ Node.js encontrado: $(node --version)${NC}"
        echo ""
        
        # Ir para pasta do dashboard
        cd bot-google-ads/dashboard || exit 1
        
        # Verificar se node_modules existe
        if [ ! -d "node_modules" ]; then
            echo "📦 Instalando dependências..."
            echo ""
            npm install
            if [ $? -ne 0 ]; then
                echo -e "${RED}❌ Erro ao instalar dependências${NC}"
                exit 1
            fi
            echo ""
            echo -e "${GREEN}✅ Dependências instaladas${NC}"
            echo ""
        fi
        
        echo "🚀 Iniciando servidor Vite..."
        echo ""
        echo -e "${YELLOW}Dashboard será aberto em: http://localhost:3000${NC}"
        echo ""
        echo -e "${YELLOW}Páginas disponíveis:${NC}"
        echo "  • Imóveis: http://localhost:3000/"
        echo "  • Anúncios: http://localhost:3000/anuncios"
        echo ""
        echo -e "${YELLOW}💡 Pressione Ctrl+C para parar o servidor${NC}"
        echo ""
        
        # Aguardar 3 segundos e abrir navegador
        sleep 3
        open_browser "http://localhost:3000"
        
        # Iniciar Vite
        npm run dev
        ;;
        
    3)
        echo ""
        echo "═══════════════════════════════════════════════════════════════════════"
        echo -e "${BLUE}🐳 Iniciando Sistema Completo com Docker${NC}"
        echo "═══════════════════════════════════════════════════════════════════════"
        echo ""
        
        # Verificar se Docker está instalado
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}❌ Docker não encontrado!${NC}"
            echo ""
            echo "Instale Docker em: https://www.docker.com"
            exit 1
        fi
        
        echo -e "${GREEN}✅ Docker encontrado: $(docker --version)${NC}"
        echo ""
        
        # Verificar se .env existe
        cd bot-google-ads || exit 1
        
        if [ ! -f ".env" ]; then
            echo -e "${YELLOW}⚠️  Arquivo .env não encontrado${NC}"
            echo ""
            echo "Copiando .env.example para .env..."
            cp .env.example .env
            echo ""
            echo -e "${YELLOW}📝 IMPORTANTE: Edite o arquivo .env com suas configurações:${NC}"
            echo "  • MISTRAL_API_KEY (obrigatório)"
            echo "  • Credenciais do banco de dados"
            echo ""
            read -p "Pressione Enter para continuar..."
        fi
        
        echo "🐳 Iniciando containers Docker..."
        echo ""
        docker-compose up -d
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Containers iniciados com sucesso!${NC}"
            echo ""
            echo "═══════════════════════════════════════════════════════════════════════"
            echo -e "${GREEN}🎉 Sistema Completo Rodando!${NC}"
            echo "═══════════════════════════════════════════════════════════════════════"
            echo ""
            echo -e "${YELLOW}Acesse:${NC}"
            echo "  • Dashboard: http://localhost:3000"
            echo "  • API: http://localhost:3001"
            echo "  • Bot: http://localhost:8000"
            echo ""
            echo -e "${YELLOW}Comandos úteis:${NC}"
            echo "  • Ver logs: docker-compose logs -f"
            echo "  • Parar: docker-compose stop"
            echo "  • Parar e remover: docker-compose down"
            echo ""
            
            sleep 3
            open_browser "http://localhost:3000"
        else
            echo -e "${RED}❌ Erro ao iniciar containers${NC}"
            echo ""
            echo "Verifique:"
            echo "  • Docker está rodando"
            echo "  • Arquivo .env está configurado"
            echo "  • Portas 3000, 3001, 8000 estão livres"
        fi
        ;;
        
    4)
        echo ""
        echo "❌ Cancelado"
        exit 0
        ;;
        
    *)
        echo ""
        echo -e "${RED}❌ Opção inválida!${NC}"
        exit 1
        ;;
esac
