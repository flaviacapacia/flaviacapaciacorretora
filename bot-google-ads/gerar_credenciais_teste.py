#!/usr/bin/env python3
"""
Gerador de credenciais de teste/simulação para desenvolvimento
IMPORTANTE: Estas são credenciais FAKE para TESTAR o bot
Para usar de verdade, você precisa obter credenciais reais do Google
"""

import secrets
import string
from pathlib import Path
import re

def gerar_developer_token_fake():
    """Gera um Developer Token fake para testes"""
    # Formato similar ao real
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(22))

def gerar_client_id_fake():
    """Gera um Client ID fake"""
    # Formato: 123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
    numbers = ''.join(secrets.choice(string.digits) for _ in range(12))
    chars = ''.join(secrets.choice(string.ascii_lowercase) for _ in range(32))
    return f"{numbers}-{chars}.apps.googleusercontent.com"

def gerar_client_secret_fake():
    """Gera um Client Secret fake"""
    # Formato: GOCSPX-abcdefghijklmnopqrstuvwxyz
    chars = ''.join(secrets.choice(string.ascii_letters + string.digits + '-_') for _ in range(24))
    return f"GOCSPX-{chars}"

def gerar_refresh_token_fake():
    """Gera um Refresh Token fake"""
    # Formato: 1//0abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
    chars = ''.join(secrets.choice(string.ascii_letters + string.digits + '-_') for _ in range(50))
    return f"1//0{chars}"

def atualizar_env_com_fake_credentials():
    """Atualiza .env com credenciais fake para testes"""
    env_path = Path('.env')
    
    # Gera credenciais fake
    credenciais = {
        'GOOGLE_ADS_CUSTOMER_ID': '5836429998',  # Real - já temos
        'GOOGLE_ADS_DEVELOPER_TOKEN': gerar_developer_token_fake(),
        'GOOGLE_ADS_CLIENT_ID': gerar_client_id_fake(),
        'GOOGLE_ADS_CLIENT_SECRET': gerar_client_secret_fake(),
        'GOOGLE_ADS_REFRESH_TOKEN': gerar_refresh_token_fake(),
        'BOT_MODE': 'SIMULATION'  # Indica modo de simulação
    }
    
    # Lê arquivo atual
    if env_path.exists():
        with open(env_path, 'r', encoding='utf-8') as f:
            linhas = f.readlines()
    else:
        linhas = []
    
    # Atualiza linhas
    linhas_atualizadas = []
    keys_encontradas = set()
    
    for linha in linhas:
        atualizado = False
        for key, value in credenciais.items():
            if linha.startswith(f"{key}="):
                linhas_atualizadas.append(f"{key}={value}\n")
                keys_encontradas.add(key)
                atualizado = True
                break
        
        if not atualizado:
            linhas_atualizadas.append(linha)
    
    # Adiciona keys que não existiam
    for key, value in credenciais.items():
        if key not in keys_encontradas:
            linhas_atualizadas.append(f"{key}={value}\n")
    
    # Salva arquivo
    with open(env_path, 'w', encoding='utf-8') as f:
        f.writelines(linhas_atualizadas)
    
    return credenciais

def criar_arquivo_de_aviso():
    """Cria arquivo explicando sobre as credenciais fake"""
    aviso = """
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     ⚠️  CREDENCIAIS DE SIMULAÇÃO GERADAS                        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

✅ CREDENCIAIS FAKE CRIADAS COM SUCESSO!

O bot agora pode rodar em MODO SIMULAÇÃO. Isso permite:

  ✅ Gerar anúncios com IA (funciona de verdade)
  ✅ Testar toda a interface
  ✅ Ver como seria o anúncio
  ⚠️  Mas NÃO publica no Google Ads de verdade

┌──────────────────────────────────────────────────────────────────┐
│  🎯 MODO SIMULAÇÃO vs MODO REAL                                  │
└──────────────────────────────────────────────────────────────────┘

MODO SIMULAÇÃO (atual):
  ✅ Gera anúncios com Mistral AI
  ✅ Mostra preview dos anúncios
  ✅ Salva no banco de dados
  ❌ NÃO publica no Google Ads de verdade
  
MODO REAL (com credenciais verdadeiras):
  ✅ Tudo do modo simulação +
  ✅ Publica anúncios no Google Ads de verdade
  ✅ Busca métricas reais (impressões, cliques, etc)
  ✅ Controla campanhas ativas

┌──────────────────────────────────────────────────────────────────┐
│  🚀 PRÓXIMOS PASSOS                                              │
└──────────────────────────────────────────────────────────────────┘

1. AGORA - Testar o bot em modo simulação:
   
   cd bot
   pip install -r requirements.txt
   python -m uvicorn src.main:app --reload --port 8000
   
   Acesse: http://localhost:8000/docs

2. DEPOIS - Obter credenciais reais do Google:
   
   Siga o guia: GUIA_CREDENCIAIS_GOOGLE_ADS.md
   
   Você precisará:
   - Developer Token (Google Ads)
   - Client ID e Secret (Google Cloud)
   - Refresh Token (gerado via script)

3. SUBSTITUIR - Trocar credenciais fake por reais:
   
   Execute novamente: configurar_credenciais.bat
   E cole as credenciais reais

┌──────────────────────────────────────────────────────────────────┐
│  📄 ARQUIVO .env ATUALIZADO                                      │
└──────────────────────────────────────────────────────────────────┘

✅ GOOGLE_ADS_CUSTOMER_ID      → 5836429998 (REAL)
⚠️  GOOGLE_ADS_DEVELOPER_TOKEN  → fake_... (SIMULAÇÃO)
⚠️  GOOGLE_ADS_CLIENT_ID        → fake_... (SIMULAÇÃO)
⚠️  GOOGLE_ADS_CLIENT_SECRET    → fake_... (SIMULAÇÃO)
⚠️  GOOGLE_ADS_REFRESH_TOKEN    → fake_... (SIMULAÇÃO)
✅ BOT_MODE                     → SIMULATION

┌──────────────────────────────────────────────────────────────────┐
│  💡 TESTANDO AGORA                                               │
└──────────────────────────────────────────────────────────────────┘

Experimente:

1. Inicie o bot (veja comandos acima)

2. Teste o health check:
   http://localhost:8000/health

3. Gere um anúncio de teste:
   POST /ads/generate
   {
     "imovel": {
       "titulo": "Apartamento 3 quartos Centro",
       "tipo": "Apartamento",
       "bairro": "Centro",
       "preco": 450000,
       "quartos": 3
     }
   }

4. Veja o anúncio gerado com IA!

┌──────────────────────────────────────────────────────────────────┐
│  ⚠️  IMPORTANTE                                                  │
└──────────────────────────────────────────────────────────────────┘

As credenciais fake NÃO funcionam com o Google Ads real.

Para publicar anúncios DE VERDADE, você DEVE:
- Obter credenciais reais do Google Ads e Google Cloud
- Seguir o guia: GUIA_CREDENCIAIS_GOOGLE_ADS.md
- Substituir as credenciais fake pelas reais

Mas por enquanto, APROVEITE o modo simulação para:
- Testar o sistema
- Ver como funciona
- Gerar anúncios com IA
- Familiarizar-se com a interface

╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     🎉 BOT PRONTO PARA TESTAR EM MODO SIMULAÇÃO!                ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
"""
    
    Path('CREDENCIAIS_SIMULACAO.txt').write_text(aviso, encoding='utf-8')

if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     🔧 GERADOR DE CREDENCIAIS DE SIMULAÇÃO                      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

Este script cria credenciais FAKE para você TESTAR o bot agora,
sem precisar esperar pelas credenciais reais do Google.

⚠️  IMPORTANTE: Estas credenciais NÃO publicam anúncios de verdade!

Gerando credenciais...
    """)
    
    credenciais = atualizar_env_com_fake_credentials()
    criar_arquivo_de_aviso()
    
    print("\n✅ Credenciais de simulação criadas!\n")
    print("📄 Credenciais geradas:")
    print(f"   Customer ID:      {credenciais['GOOGLE_ADS_CUSTOMER_ID']} (REAL)")
    print(f"   Developer Token:  {credenciais['GOOGLE_ADS_DEVELOPER_TOKEN'][:20]}... (FAKE)")
    print(f"   Client ID:        {credenciais['GOOGLE_ADS_CLIENT_ID'][:30]}... (FAKE)")
    print(f"   Client Secret:    {credenciais['GOOGLE_ADS_CLIENT_SECRET'][:20]}... (FAKE)")
    print(f"   Refresh Token:    {credenciais['GOOGLE_ADS_REFRESH_TOKEN'][:20]}... (FAKE)")
    print(f"   Modo:             {credenciais['BOT_MODE']}")
    
    print("\n📝 Arquivo .env atualizado!")
    print("📄 Leia: CREDENCIAIS_SIMULACAO.txt para mais informações")
    
    print("\n🚀 PRÓXIMO PASSO:")
    print("   Execute o bot: cd bot && python -m uvicorn src.main:app --reload --port 8000")
    print("\n")
