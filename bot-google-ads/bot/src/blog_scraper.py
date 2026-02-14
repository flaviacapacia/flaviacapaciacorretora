import os
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any
from collections import Counter
import re

class BlogScraper:
    def __init__(self):
        self.blog_url = os.getenv('BLOG_URL', 'https://www.flaviacapaciacorretora.com/blog')
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    def scrape_posts(self) -> List[Dict[str, Any]]:
        """Faz scraping dos posts do blog"""
        try:
            response = requests.get(self.blog_url, headers=self.headers, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            posts = []

            # Procura por artigos/posts no blog
            # Adapte os seletores conforme a estrutura real do blog
            articles = soup.find_all(['article', 'div'], class_=re.compile(r'post|article|blog-item', re.I))
            
            if not articles:
                # Fallback: procura por links de artigos
                articles = soup.find_all('a', href=re.compile(r'artigo-|blog/'))

            for article in articles[:10]:  # Limita a 10 posts
                try:
                    # Tenta extrair título
                    title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                    title = title_elem.get_text(strip=True) if title_elem else ''
                    
                    # Tenta extrair URL
                    link_elem = article.find('a') if article.name != 'a' else article
                    url = link_elem.get('href', '') if link_elem else ''
                    
                    if url and not url.startswith('http'):
                        url = f"{os.getenv('SITE_URL', '')}/{url.lstrip('/')}"
                    
                    # Tenta extrair conteúdo/preview
                    content = article.get_text(strip=True)[:500]
                    
                    if title and url:
                        posts.append({
                            'titulo': title,
                            'url': url,
                            'preview': content,
                            'keywords': self._extract_keywords(content)
                        })
                except Exception as e:
                    print(f"Erro ao processar artigo: {e}")
                    continue

            return posts
        except Exception as e:
            print(f"❌ Erro ao fazer scraping do blog: {e}")
            return []

    def _extract_keywords(self, text: str) -> List[str]:
        """Extrai palavras-chave relevantes do texto"""
        # Remove pontuação e converte para minúsculas
        text = re.sub(r'[^\w\s]', ' ', text.lower())
        words = text.split()
        
        # Remove palavras muito curtas e stopwords comuns
        stopwords = {
            'o', 'a', 'de', 'da', 'do', 'em', 'para', 'com', 'por', 
            'uma', 'um', 'os', 'as', 'dos', 'das', 'no', 'na', 'ao',
            'e', 'ou', 'que', 'se', 'é', 'são', 'mais', 'como', 'pelo'
        }
        
        words = [w for w in words if len(w) > 3 and w not in stopwords]
        
        # Conta frequência e retorna top 10
        counter = Counter(words)
        return [word for word, _ in counter.most_common(10)]

    def get_trends(self) -> Dict[str, Any]:
        """Analisa tendências do blog"""
        posts = self.scrape_posts()
        
        all_keywords = []
        for post in posts:
            all_keywords.extend(post.get('keywords', []))
        
        keyword_counts = Counter(all_keywords)
        
        # Identifica temas
        temas = {
            'investimento': ['investimento', 'investir', 'retorno', 'valorização'],
            'localização': ['localização', 'região', 'bairro', 'centro', 'praia'],
            'mercado': ['mercado', 'imobiliário', 'preço', 'venda', 'compra'],
            'lifestyle': ['vida', 'família', 'conforto', 'lazer', 'qualidade']
        }
        
        tema_scores = {}
        for tema, palavras in temas.items():
            score = sum(keyword_counts.get(palavra, 0) for palavra in palavras)
            tema_scores[tema] = score
        
        return {
            'top_keywords': [word for word, _ in keyword_counts.most_common(15)],
            'trending_themes': sorted(tema_scores.items(), key=lambda x: x[1], reverse=True),
            'total_posts': len(posts),
            'posts': posts
        }

# Instância global
scraper = BlogScraper()
