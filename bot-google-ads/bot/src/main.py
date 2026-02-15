import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

from .ai_engine import ai_engine
from .blog_scraper import scraper
from .google_ads import google_ads
from .database import db

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
    imovel: Dict[str, Any]
    campaign_type: str = 'search'
    budget: Optional[float] = None

class AdPublishRequest(BaseModel):
    ad_id: int
    headlines: list
    descriptions: list
    keywords: list
    budget: float

# Rotas
@app.get("/")
async def root():
    return {
        "service": "Flavia Capacia Ads Bot",
        "version": "1.0.0",
        "status": "online"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mistral_api": bool(os.getenv('MISTRAL_API_KEY')),
        "google_ads": google_ads.has_credentials,
        "database": True  # Simplified check
    }

@app.get("/blog/scrape")
async def scrape_blog():
    """Faz scraping do blog e retorna posts"""
    try:
        posts = scraper.scrape_posts()
        return {
            "success": True,
            "total": len(posts),
            "posts": posts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/blog/trends")
async def get_blog_trends():
    """Retorna tendências e análise do blog"""
    try:
        trends = scraper.get_trends()
        return {
            "success": True,
            "trends": trends
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ads/generate")
async def generate_ads(request: AdGenerateRequest):
    """
    Gera anúncios otimizados usando IA
    """
    try:
        # Busca tendências do blog
        blog_trends = scraper.get_trends()
        
        # Gera anúncios com IA
        ads = ai_engine.generate_ads(
            imovel=request.imovel,
            blog_trends=blog_trends,
            campaign_type=request.campaign_type
        )
        
        return {
            "success": True,
            "ads": ads,
            "blog_insights": {
                "top_keywords": blog_trends.get('top_keywords', [])[:5],
                "trending_themes": blog_trends.get('trending_themes', [])[:3]
            }
        }
    except Exception as e:
        print(f"Erro ao gerar anúncios: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ads/publish")
async def publish_ad(request: AdPublishRequest):
    """
    Publica anúncio no Google Ads
    Se não houver credenciais, retorna em modo preview
    """
    try:
        result = google_ads.publish_ad(
            ad_id=request.ad_id,
            headlines=request.headlines,
            descriptions=request.descriptions,
            keywords=request.keywords,
            budget=request.budget
        )
        
        if not result.get('success'):
            # Retorna 501 (Not Implemented) se não tiver credenciais
            raise HTTPException(
                status_code=501,
                detail="Google Ads credentials not configured. Ad saved in preview mode."
            )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ads/performance/{google_ads_id}")
async def get_ad_performance(google_ads_id: str):
    """Busca performance de um anúncio no Google Ads"""
    try:
        performance = google_ads.get_ad_performance(google_ads_id)
        return performance
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Startup/Shutdown events
@app.on_event("startup")
async def startup_event():
    print("🚀 Bot iniciado com sucesso!")
    print(f"📊 Mistral API: {'✅ Configurada' if os.getenv('MISTRAL_API_KEY') else '❌ Não configurada'}")
    print(f"📢 Google Ads: {'✅ Configurado' if google_ads.has_credentials else '⏸️ Modo preview'}")

@app.on_event("shutdown")
async def shutdown_event():
    print("🛑 Bot encerrando...")
    db.disconnect()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
