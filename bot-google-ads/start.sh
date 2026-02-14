#!/bin/bash

echo "🤖 Bot Google Ads - Flávia Capacia Corretora"
echo "=============================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica se .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado${NC}"
    echo "📋 Copiando .env.example para .env..."
    cp .env.example .env
    echo ""
    echo -e "${RED}⚠️  ATENÇÃO: Configure o arquivo .env antes de continuar!${NC}"
    echo "   Edite o arquivo .env e adicione:"
    echo "   - MISTRAL_API_KEY (obrigatório)"
    echo "   - Credenciais do SQL Server"
    echo ""
    exit 1
fi

# Verifica se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando${NC}"
    echo "   Inicie o Docker e tente novamente"
    exit 1
fi

echo "✅ Docker está rodando"
echo ""

# Verifica se o banco de dados foi inicializado
echo "📊 Verificando banco de dados..."
echo -e "${YELLOW}⚠️  Certifique-se de que o script SQL foi executado:${NC}"
echo "   scripts/init_database.sql"
echo ""
read -p "O banco de dados foi inicializado? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[SsYy]$ ]]
then
    echo -e "${RED}❌ Execute o script SQL primeiro${NC}"
    exit 1
fi

echo ""
echo "🚀 Iniciando serviços com Docker Compose..."
echo ""

docker-compose up -d

echo ""
echo "⏳ Aguardando serviços iniciarem..."
sleep 10

echo ""
echo "🔍 Verificando status dos serviços..."
echo ""

# Verifica API
if curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${GREEN}✅ API está rodando (http://localhost:3001)${NC}"
else
    echo -e "${RED}❌ API não está respondendo${NC}"
fi

# Verifica Bot
if curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${GREEN}✅ Bot está rodando (http://localhost:8000)${NC}"
else
    echo -e "${RED}❌ Bot não está respondendo${NC}"
fi

# Verifica Dashboard
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Dashboard está rodando (http://localhost:3000)${NC}"
else
    echo -e "${RED}❌ Dashboard não está respondendo${NC}"
fi

echo ""
echo "=============================================="
echo "🎉 Sistema iniciado com sucesso!"
echo "=============================================="
echo ""
echo "📱 Acesse o dashboard em: http://localhost:3000"
echo ""
echo "📚 Documentação:"
echo "   - README.md - Visão geral do projeto"
echo "   - GUIA_DE_USO.md - Tutorial completo"
echo ""
echo "🔧 Comandos úteis:"
echo "   docker-compose logs -f       # Ver logs em tempo real"
echo "   docker-compose stop          # Parar serviços"
echo "   docker-compose down          # Parar e remover containers"
echo "   docker-compose restart       # Reiniciar serviços"
echo ""
echo "❓ Problemas? Consulte o GUIA_DE_USO.md"
echo ""
