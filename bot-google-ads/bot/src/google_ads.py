import os
import secrets
from typing import Dict, Any, Optional
from datetime import datetime

try:
    from google.ads.googleads.client import GoogleAdsClient
    from google.ads.googleads.errors import GoogleAdsException
    GOOGLE_ADS_AVAILABLE = True
except ImportError:
    GOOGLE_ADS_AVAILABLE = False
    print("⚠️ google-ads não instalado. Execute: pip install google-ads")

class GoogleAdsIntegration:
    """
    Integração com Google Ads API
    Permite criar campanhas, grupos de anúncios, anúncios e keywords
    """
    
    def __init__(self):
        self.customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID', '').replace('-', '')
        self.developer_token = os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN')
        self.login_customer_id = os.getenv('GOOGLE_ADS_LOGIN_CUSTOMER_ID', '').replace('-', '')
        self.client_id = os.getenv('GOOGLE_ADS_CLIENT_ID')
        self.client_secret = os.getenv('GOOGLE_ADS_CLIENT_SECRET')
        self.refresh_token = os.getenv('GOOGLE_ADS_REFRESH_TOKEN')
        self.bot_mode = os.getenv('BOT_MODE', 'PRODUCTION')
        
        # Em modo simulação, não precisa da biblioteca real
        if self.bot_mode == 'SIMULATION':
            self.has_credentials = bool(self.customer_id)
            self.client = None
            print("⚠️ Bot em MODO SIMULAÇÃO - anúncios não serão publicados de verdade")
            return
        
        self.has_credentials = all([
            self.customer_id,
            self.developer_token,
            GOOGLE_ADS_AVAILABLE
        ])
        
        self.client = None
        if self.has_credentials:
            self._initialize_client()

        self.client = None
        if self.has_credentials:
            self._initialize_client()

    def _initialize_client(self):
        """Inicializa o cliente Google Ads"""
        try:
            credentials = {
                "developer_token": self.developer_token,
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "refresh_token": self.refresh_token,
                "login_customer_id": self.login_customer_id,
                "use_proto_plus": True
            }
            self.client = GoogleAdsClient.load_from_dict(credentials)
            print("✅ Cliente Google Ads inicializado com sucesso")
        except Exception as e:
            print(f"❌ Erro ao inicializar cliente Google Ads: {e}")
            self.has_credentials = False

    def publish_ad(
        self,
        ad_id: int,
        headlines: list,
        descriptions: list,
        keywords: list,
        budget: float
    ) -> Dict[str, Any]:
        """
        Publica um anúncio no Google Ads
        Cria campanha, ad group, anúncio responsivo de pesquisa e keywords
        """
        
        # Modo simulação
        if self.bot_mode == 'SIMULATION':
            return {
                'success': True,
                'preview_mode': True,
                'simulation_mode': True,
                'google_ads_id': f'simulation_{ad_id}_{secrets.token_hex(4)}',
                'campaign_id': f'campaign_sim_{secrets.token_hex(4)}',
                'ad_group_id': f'adgroup_sim_{secrets.token_hex(4)}',
                'message': '✅ Anúncio criado em MODO SIMULAÇÃO (não foi publicado no Google Ads real)',
                'ad_preview': {
                    'ad_id': ad_id,
                    'headlines': headlines,
                    'descriptions': descriptions,
                    'keywords': keywords,
                    'budget': budget
                },
                'instructions': '💡 Para publicar de verdade, configure as credenciais reais do Google Ads'
            }
        
        if not self.has_credentials:
            return {
                'success': False,
                'preview_mode': True,
                'message': 'Credenciais do Google Ads não configuradas completamente. Anúncio em modo preview.',
                'ad_preview': {
                    'ad_id': ad_id,
                    'headlines': headlines,
                    'descriptions': descriptions,
                    'keywords': keywords,
                    'budget': budget
                },
                'instructions': 'Configure as variáveis GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET e GOOGLE_ADS_REFRESH_TOKEN'
            }
        
        try:
            # 1. Criar campanha
            campaign_id = self._create_campaign(
                f"Imóvel #{ad_id} - {datetime.now().strftime('%Y-%m-%d')}",
                budget
            )
            
            # 2. Criar ad group
            ad_group_id = self._create_ad_group(
                campaign_id,
                f"Ad Group - Imóvel #{ad_id}"
            )
            
            # 3. Criar anúncio responsivo de pesquisa
            google_ad_id = self._create_responsive_search_ad(
                ad_group_id,
                headlines,
                descriptions
            )
            
            # 4. Adicionar keywords
            keyword_ids = self._add_keywords(ad_group_id, keywords)
            
            return {
                'success': True,
                'google_ads_id': google_ad_id,
                'campaign_id': campaign_id,
                'ad_group_id': ad_group_id,
                'keyword_ids': keyword_ids,
                'message': 'Anúncio publicado com sucesso no Google Ads!',
                'preview_mode': False
            }
            
        except GoogleAdsException as ex:
            error_msg = f"Erro Google Ads: {ex.error.code().name}"
            for error in ex.failure.errors:
                error_msg += f"\n- {error.message}"
            
            return {
                'success': False,
                'preview_mode': False,
                'message': error_msg,
                'error_details': str(ex)
            }
        except Exception as e:
            return {
                'success': False,
                'preview_mode': False,
                'message': f'Erro ao publicar anúncio: {str(e)}',
                'error_details': str(e)
            }

    def _create_campaign(self, campaign_name: str, budget: float) -> str:
        """Cria uma campanha de pesquisa"""
        campaign_budget_service = self.client.get_service("CampaignBudgetService")
        campaign_service = self.client.get_service("CampaignService")
        
        # Criar budget
        campaign_budget_operation = self.client.get_type("CampaignBudgetOperation")
        campaign_budget = campaign_budget_operation.create
        campaign_budget.name = f"Budget {campaign_name}"
        campaign_budget.amount_micros = int(budget * 1000000)  # Converte para micros
        campaign_budget.delivery_method = self.client.enums.BudgetDeliveryMethodEnum.STANDARD
        
        budget_response = campaign_budget_service.mutate_campaign_budgets(
            customer_id=self.customer_id,
            operations=[campaign_budget_operation]
        )
        budget_resource_name = budget_response.results[0].resource_name
        
        # Criar campanha
        campaign_operation = self.client.get_type("CampaignOperation")
        campaign = campaign_operation.create
        campaign.name = campaign_name
        campaign.advertising_channel_type = self.client.enums.AdvertisingChannelTypeEnum.SEARCH
        campaign.status = self.client.enums.CampaignStatusEnum.PAUSED  # Começa pausada
        campaign.campaign_budget = budget_resource_name
        campaign.network_settings.target_google_search = True
        campaign.network_settings.target_search_network = True
        
        campaign_response = campaign_service.mutate_campaigns(
            customer_id=self.customer_id,
            operations=[campaign_operation]
        )
        
        return campaign_response.results[0].resource_name

    def _create_ad_group(self, campaign_resource_name: str, ad_group_name: str) -> str:
        """Cria um grupo de anúncios"""
        ad_group_service = self.client.get_service("AdGroupService")
        
        ad_group_operation = self.client.get_type("AdGroupOperation")
        ad_group = ad_group_operation.create
        ad_group.name = ad_group_name
        ad_group.campaign = campaign_resource_name
        ad_group.type_ = self.client.enums.AdGroupTypeEnum.SEARCH_STANDARD
        ad_group.cpc_bid_micros = 1000000  # R$ 1,00 CPC default
        ad_group.status = self.client.enums.AdGroupStatusEnum.ENABLED
        
        ad_group_response = ad_group_service.mutate_ad_groups(
            customer_id=self.customer_id,
            operations=[ad_group_operation]
        )
        
        return ad_group_response.results[0].resource_name

    def _create_responsive_search_ad(
        self,
        ad_group_resource_name: str,
        headlines: list,
        descriptions: list
    ) -> str:
        """Cria um anúncio responsivo de pesquisa"""
        ad_group_ad_service = self.client.get_service("AdGroupAdService")
        
        ad_group_ad_operation = self.client.get_type("AdGroupAdOperation")
        ad_group_ad = ad_group_ad_operation.create
        ad_group_ad.ad_group = ad_group_resource_name
        ad_group_ad.status = self.client.enums.AdGroupAdStatusEnum.ENABLED
        
        # Configurar anúncio responsivo
        ad = ad_group_ad.ad
        ad.final_urls.append(os.getenv('SITE_URL', 'https://www.flaviacapaciacorretora.com'))
        
        # Adicionar headlines (mínimo 3, máximo 15)
        for headline_text in headlines[:15]:
            headline = self.client.get_type("AdTextAsset")
            headline.text = headline_text[:30]  # Máximo 30 caracteres
            ad.responsive_search_ad.headlines.append(headline)
        
        # Adicionar descriptions (mínimo 2, máximo 4)
        for description_text in descriptions[:4]:
            description = self.client.get_type("AdTextAsset")
            description.text = description_text[:90]  # Máximo 90 caracteres
            ad.responsive_search_ad.descriptions.append(description)
        
        ad_response = ad_group_ad_service.mutate_ad_group_ads(
            customer_id=self.customer_id,
            operations=[ad_group_ad_operation]
        )
        
        return ad_response.results[0].resource_name

    def _add_keywords(self, ad_group_resource_name: str, keywords: list) -> list:
        """Adiciona keywords ao ad group"""
        ad_group_criterion_service = self.client.get_service("AdGroupCriterionService")
        operations = []
        
        for keyword_text in keywords[:20]:  # Máximo 20 keywords
            operation = self.client.get_type("AdGroupCriterionOperation")
            criterion = operation.create
            criterion.ad_group = ad_group_resource_name
            criterion.status = self.client.enums.AdGroupCriterionStatusEnum.ENABLED
            criterion.keyword.text = keyword_text
            criterion.keyword.match_type = self.client.enums.KeywordMatchTypeEnum.BROAD
            operations.append(operation)
        
        response = ad_group_criterion_service.mutate_ad_group_criteria(
            customer_id=self.customer_id,
            operations=operations
        )
        
        return [result.resource_name for result in response.results]

    def get_ad_performance(self, google_ads_id: str) -> Dict[str, Any]:
        """
        Busca métricas de performance de um anúncio
        Retorna impressões, cliques, CTR, custo, conversões
        """
        
        if not self.has_credentials:
            return {
                'success': False,
                'preview_mode': True,
                'message': 'Credenciais não configuradas',
                'metrics': {
                    'impressions': 0,
                    'clicks': 0,
                    'ctr': 0,
                    'cost': 0,
                    'conversions': 0
                }
            }
        
        try:
            ga_service = self.client.get_service("GoogleAdsService")
            
            query = f"""
                SELECT
                    ad_group_ad.ad.id,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.ctr,
                    metrics.cost_micros,
                    metrics.conversions,
                    metrics.cost_per_conversion
                FROM ad_group_ad
                WHERE ad_group_ad.ad.id = {google_ads_id}
                AND segments.date DURING LAST_30_DAYS
            """
            
            response = ga_service.search(
                customer_id=self.customer_id,
                query=query
            )
            
            metrics = {
                'impressions': 0,
                'clicks': 0,
                'ctr': 0,
                'cost': 0,
                'conversions': 0,
                'cost_per_conversion': 0
            }
            
            for row in response:
                metrics['impressions'] += row.metrics.impressions
                metrics['clicks'] += row.metrics.clicks
                metrics['ctr'] = row.metrics.ctr
                metrics['cost'] += row.metrics.cost_micros / 1000000  # Converte de micros
                metrics['conversions'] += row.metrics.conversions
                if row.metrics.cost_per_conversion:
                    metrics['cost_per_conversion'] = row.metrics.cost_per_conversion / 1000000
            
            return {
                'success': True,
                'preview_mode': False,
                'metrics': metrics
            }
            
        except GoogleAdsException as ex:
            return {
                'success': False,
                'preview_mode': False,
                'message': f'Erro ao buscar métricas: {ex.error.code().name}',
                'error': str(ex)
            }
        except Exception as e:
            return {
                'success': False,
                'preview_mode': False,
                'message': f'Erro ao buscar métricas: {str(e)}',
                'error': str(e)
            }

    def pause_ad(self, ad_group_ad_resource_name: str) -> Dict[str, Any]:
        """Pausa um anúncio"""
        if not self.has_credentials:
            return {'success': False, 'message': 'Credenciais não configuradas'}
        
        try:
            ad_group_ad_service = self.client.get_service("AdGroupAdService")
            
            ad_group_ad_operation = self.client.get_type("AdGroupAdOperation")
            ad_group_ad = ad_group_ad_operation.update
            ad_group_ad.resource_name = ad_group_ad_resource_name
            ad_group_ad.status = self.client.enums.AdGroupAdStatusEnum.PAUSED
            ad_group_ad_operation.update_mask.paths.append("status")
            
            ad_group_ad_service.mutate_ad_group_ads(
                customer_id=self.customer_id,
                operations=[ad_group_ad_operation]
            )
            
            return {'success': True, 'message': 'Anúncio pausado com sucesso'}
            
        except GoogleAdsException as ex:
            return {
                'success': False,
                'message': f'Erro ao pausar anúncio: {ex.error.code().name}'
            }
        except Exception as e:
            return {'success': False, 'message': f'Erro ao pausar anúncio: {str(e)}'}

    def resume_ad(self, ad_group_ad_resource_name: str) -> Dict[str, Any]:
        """Retoma um anúncio pausado"""
        if not self.has_credentials:
            return {'success': False, 'message': 'Credenciais não configuradas'}
        
        try:
            ad_group_ad_service = self.client.get_service("AdGroupAdService")
            
            ad_group_ad_operation = self.client.get_type("AdGroupAdOperation")
            ad_group_ad = ad_group_ad_operation.update
            ad_group_ad.resource_name = ad_group_ad_resource_name
            ad_group_ad.status = self.client.enums.AdGroupAdStatusEnum.ENABLED
            ad_group_ad_operation.update_mask.paths.append("status")
            
            ad_group_ad_service.mutate_ad_group_ads(
                customer_id=self.customer_id,
                operations=[ad_group_ad_operation]
            )
            
            return {'success': True, 'message': 'Anúncio reativado com sucesso'}
            
        except GoogleAdsException as ex:
            return {
                'success': False,
                'message': f'Erro ao reativar anúncio: {ex.error.code().name}'
            }
        except Exception as e:
            return {'success': False, 'message': f'Erro ao reativar anúncio: {str(e)}'}

# Instância global
google_ads = GoogleAdsIntegration()
