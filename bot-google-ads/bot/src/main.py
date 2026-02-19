import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

from .ai_engine import ai_engine
from .blog_scraper import scraper
from .google_ads import google_ads
# from .database import db  # Comentado temporariamente (precisa pyodbc)

# Carrega variáveis de ambiente
load_dotenv()

# Inicializa FastAPI
app = FastAPI(
    title="Flavia Capacia - Bot Google Ads",
    description="Bot inteligente para geração de anúncios Google Ads com IA",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models Pydantic
class AdGenerateRequest(BaseModel):
    """Requisição para gerar anúncios"""
    imovel: Dict[str, Any]  # Dados do imóvel
    campaign_type: str = 'search'  # Tipo de campanha (search, display)
    budget: Optional[float] = None  # Orçamento opcional

    class Config:
        json_schema_extra = {
            "example": {
                "imovel": {
                    "titulo": "Apartamento 3 quartos Centro",
                    "descricao": "Apartamento moderno com vista mar",
                    "preco": 450000,
                    "quartos": 3,
                    "banheiros": 2,
                    "area": 120,
                    "localizacao": "Centro, Florianópolis"
                },
                "campaign_type": "search",
                "budget": 1000
            }
        }

class AdPublishRequest(BaseModel):
    """Requisição para publicar anúncio"""
    ad_id: int
    headlines: list
    descriptions: list
    keywords: list
    budget: float

# Rotas
@app.get("/", tags=["Sistema"], summary="Informações do sistema")
async def root():
    """Retorna informações básicas do bot"""
    return {
        "servico": "Flavia Capacia - Bot de Anúncios",
        "versao": "1.0.0",
        "status": "online",
        "documentacao": "/docs"
    }

@app.get("/health", tags=["Sistema"], summary="Status de saúde")
async def health_check():
    """Verifica o status dos serviços integrados"""
    return {
        "status": "saudável",
        "ia_mistral": "✅ configurada" if os.getenv('MISTRAL_API_KEY') else "❌ não configurada",
        "google_ads": "✅ configurado" if google_ads.has_credentials else "⚠️ credenciais incompletas",
        "customer_id": google_ads.customer_id if google_ads.customer_id else "não configurado"
    }

# ==================== AUTENTICAÇÃO ====================

@app.post("/auth/register", tags=["Autenticação"], summary="Registrar novo usuário")
async def register(request: RegisterRequest):
    """
    Registra um novo usuário no sistema.
    
    Credenciais mínimas:
    - Username: mínimo 3 caracteres
    - Password: mínimo 6 caracteres
    - Email: válido
    """
    try:
        result = auth.register_user(
            username=request.username,
            password=request.password,
            email=request.email
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login", tags=["Autenticação"], summary="Login")
async def login(request: LoginRequest):
    """
    Faz login e retorna um token de acesso.
    
    O token expira em 7 dias e deve ser enviado no header Authorization:
    `Authorization: Bearer SEU_TOKEN`
    
    **Usuário padrão:**
    - Username: admin
    - Password: admin123
        
        # Gera anúncios com IA
        ads = ai_engine.generate_ads(
            imovel=request.imovel,
            blog_trends=blog_trends,
            campaign_type=request.campaign_type
        )
        
        return {
            "sucesso": True,
            "anuncios": ads,
            "insights_blog": {
                "palavras_chave_populares": blog_trends.get('top_keywords', [])[:5],
                "temas_em_alta": blog_trends.get('trending_themes', [])[:3]
            },
            "mensagem": "Anúncios gerados com sucesso pela IA!"
        }
    except Exception as e:
        print(f"Erro ao gerar anúncios: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao gerar anúncios: {str(e)}")

@app.post("/ads/publish", tags=["Anúncios"], summary="Publicar anúncio no Google Ads")
async def publish_ad(request: AdPublishRequest):
    """
    Publica anúncio no Google Ads.
    
    Cria:
    - Campanha de pesquisa
    - Grupo de anúncios
    - Anúncio responsivo de pesquisa
    - Keywords
    
    Se credenciais não estiverem completas, retorna em modo preview.
    """
    try:
        result = google_ads.publish_ad(
            ad_id=request.ad_id,
            headlines=request.headlines,
            descriptions=request.descriptions,
            keywords=request.keywords,
            budget=request.budget
        )
        
        if result.get('preview_mode'):
            # Retorna 202 (Accepted) se estiver em modo preview
            return {
                **result,
                "status_code": 202,
                "message": result.get('message', 'Modo preview - configure as credenciais para publicar')
            }
        
        if not result.get('success'):
            raise HTTPException(
                status_code=500,
                detail=result.get('message', 'Erro ao publicar anúncio')
            )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao publicar anúncio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ads/performance/{google_ads_id}", tags=["Anúncios"], summary="Métricas de performance")
async def get_ad_performance(google_ads_id: str):
    """
    Busca métricas de performance de um anúncio no Google Ads.
    
    Retorna:
    - Impressões
    - Cliques
    - CTR (Click-Through Rate)
    - Custo
    - Conversões
    - Custo por conversão
    """
    try:
        performance = google_ads.get_ad_performance(google_ads_id)
        
        if performance.get('preview_mode'):
            return {
                **performance,
                "message": "Modo preview - configure credenciais para ver métricas reais"
            }
        
        return performance
    except Exception as e:
        print(f"Erro ao buscar performance: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ads/pause/{ad_resource_name}", tags=["Anúncios"], summary="Pausar anúncio")
async def pause_ad(ad_resource_name: str):
    """Pausa um anúncio ativo no Google Ads"""
    try:
        result = google_ads.pause_ad(ad_resource_name)
        
        if not result.get('success'):
            raise HTTPException(
                status_code=500,
                detail=result.get('message', 'Erro ao pausar anúncio')
            )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao pausar anúncio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ads/resume/{ad_resource_name}", tags=["Anúncios"], summary="Reativar anúncio")
async def resume_ad(ad_resource_name: str):
    """Reativa um anúncio pausado no Google Ads"""
    try:
        result = google_ads.resume_ad(ad_resource_name)
        
        if not result.get('success'):
            raise HTTPException(
                status_code=500,
                detail=result.get('message', 'Erro ao reativar anúncio')
            )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao reativar anúncio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Startup/Shutdown events
@app.on_event("startup")
async def startup_event():
    print("🚀 Bot iniciado com sucesso!")
    print(f"📊 Mistral API: {'✅ Configurada' if os.getenv('MISTRAL_API_KEY') else '❌ Não configurada'}")
    print(f"📢 Google Ads: {'✅ Configurado' if google_ads.has_credentials else '⚠️ Credenciais incompletas'}")
    if google_ads.customer_id:
        print(f"   Customer ID: {google_ads.customer_id}")
    if not google_ads.has_credentials:
        print("   ⏳ Configure: Developer Token, Client ID, Client Secret e Refresh Token")
        print("   📖 Veja: GUIA_CREDENCIAIS_GOOGLE_ADS.md")

@app.on_event("shutdown")
async def shutdown_event():
    print("🛑 Bot encerrando...")
    # db.disconnect()  # Comentado temporariamente

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
