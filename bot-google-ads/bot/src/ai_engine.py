import os
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from typing import Dict, Any, List

class AIEngine:
    def __init__(self):
        api_key = os.getenv('MISTRAL_API_KEY')
        if not api_key:
            raise ValueError("MISTRAL_API_KEY não encontrada nas variáveis de ambiente")
        
        self.client = MistralClient(api_key=api_key)
        self.model = "mistral-small-latest"  # Modelo gratuito

    def generate_ads(
        self, 
        imovel: Dict[str, Any], 
        blog_trends: Dict[str, Any],
        campaign_type: str = 'search'
    ) -> Dict[str, Any]:
        """Gera anúncios otimizados usando Mistral AI"""
        
        # Prepara o contexto
        contexto = self._prepare_context(imovel, blog_trends)
        
        # Cria o prompt
        prompt = self._create_prompt(contexto, campaign_type)
        
        try:
            # Chama a API Mistral
            response = self.client.chat(
                model=self.model,
                messages=[
                    ChatMessage(role="system", content="""Você é um especialista em marketing imobiliário e Google Ads. 
                    Sua missão é criar anúncios altamente persuasivos e otimizados para conversão.
                    Responda SEMPRE em formato JSON válido."""),
                    ChatMessage(role="user", content=prompt)
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Processa a resposta
            content = response.choices[0].message.content
            
            # Tenta extrair JSON da resposta
            import json
            import re
            
            # Remove markdown se houver
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                ads_data = json.loads(json_match.group())
            else:
                ads_data = json.loads(content)
            
            return ads_data
            
        except Exception as e:
            print(f"❌ Erro ao gerar anúncios com Mistral: {e}")
            # Fallback: gera anúncios básicos
            return self._generate_fallback_ads(imovel)

    def _prepare_context(self, imovel: Dict[str, Any], blog_trends: Dict[str, Any]) -> str:
        """Prepara o contexto do imóvel para a IA"""
        
        # Extrai informações relevantes
        tipo = imovel.get('tipo', 'Imóvel')
        bairro = imovel.get('bairro', '')
        cidade = imovel.get('cidade', 'Florianópolis')
        preco = imovel.get('preco', 0)
        quartos = imovel.get('quartos', '')
        area = imovel.get('area', '')
        descricao = imovel.get('descricao', '')
        diferenciais = imovel.get('diferenciais', '')
        
        # Formata preço
        preco_formatado = f"R$ {preco:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
        
        # Keywords do blog
        keywords_blog = blog_trends.get('top_keywords', [])[:5]
        keywords_str = ', '.join(keywords_blog)
        
        contexto = f"""
        Imóvel: {tipo}
        Localização: {bairro}, {cidade}
        Preço: {preco_formatado}
        Quartos: {quartos}
        Área: {area} m²
        Descrição: {descricao[:300]}
        Diferenciais: {diferenciais}
        
        Tendências do mercado (do blog): {keywords_str}
        """
        
        return contexto.strip()

    def _create_prompt(self, contexto: str, campaign_type: str) -> str:
        """Cria o prompt para a IA"""
        
        prompt = f"""
        Com base nas informações abaixo, crie anúncios otimizados para Google Ads:

        {contexto}

        Tipo de campanha: {campaign_type}

        Gere um JSON com a seguinte estrutura:
        {{
            "headlines": [
                "5 headlines diferentes de até 30 caracteres cada",
                "Cada headline deve ser persuasivo e único",
                "Use números, benefícios e localização"
            ],
            "descriptions": [
                "3 descrições de até 90 caracteres cada",
                "Foque em benefícios e call-to-action",
                "Seja persuasivo e direto"
            ],
            "keywords": [
                "Lista de 10-15 palavras-chave relevantes",
                "Inclua variações long-tail",
                "Considere intenção de busca"
            ],
            "audience": {{
                "age_range": "faixa etária ideal",
                "interests": ["lista de interesses"],
                "location": "localização geográfica",
                "income_level": "faixa de renda"
            }}
        }}

        IMPORTANTE:
        - Headlines devem ter EXATAMENTE até 30 caracteres
        - Descriptions devem ter EXATAMENTE até 90 caracteres  
        - Seja criativo e persuasivo
        - Use as tendências do blog quando relevante
        - Foque em benefícios, não apenas características
        - Inclua call-to-action forte
        
        Responda APENAS com o JSON, sem texto adicional.
        """
        
        return prompt.strip()

    def _generate_fallback_ads(self, imovel: Dict[str, Any]) -> Dict[str, Any]:
        """Gera anúncios básicos como fallback"""
        
        tipo = imovel.get('tipo', 'Imóvel')
        bairro = imovel.get('bairro', 'Florianópolis')
        quartos = imovel.get('quartos', '')
        
        return {
            "headlines": [
                f"{tipo} {bairro}",
                f"{tipo} {quartos} Quartos",
                f"{tipo} Venda {bairro}",
                f"Seu Novo {tipo} Aqui",
                f"{tipo} Pronto pra Morar"
            ],
            "descriptions": [
                f"{tipo} completo em {bairro}. Agende sua visita hoje mesmo!",
                f"Localização privilegiada, acabamento de primeira. Entre em contato!",
                f"Melhor custo-benefício da região. Venha conhecer agora!"
            ],
            "keywords": [
                f"{tipo.lower()} {bairro.lower()}",
                f"{tipo.lower()} venda florianópolis",
                f"imóvel {bairro.lower()}",
                f"apartamento {bairro.lower()}" if 'apart' in tipo.lower() else f"casa {bairro.lower()}",
                f"comprar {tipo.lower()}",
                f"{tipo.lower()} {quartos} quartos" if quartos else f"{tipo.lower()} quartos",
                "imóveis florianópolis",
                "corretor florianópolis",
                "imobiliária florianópolis"
            ],
            "audience": {
                "age_range": "25-55",
                "interests": ["Imóveis", "Investimento", "Florianópolis", "Moradia"],
                "location": "Florianópolis e região metropolitana",
                "income_level": "Classe B e C"
            }
        }

# Instância global
ai_engine = AIEngine()
