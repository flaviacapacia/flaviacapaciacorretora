#!/usr/bin/env python3
"""
Script para configurar credenciais do Google Ads de forma simples e interativa
"""

import os
import re
from pathlib import Path

def limpar_customer_id(customer_id: str) -> str:
    """Remove hífens e espaços do Customer ID"""
    return customer_id.replace('-', '').replace(' ', '').strip()

def validar_customer_id(customer_id: str) -> bool:
    """Valida se Customer ID tem 10 dígitos"""
    clean_id = limpar_customer_id(customer_id)
    return len(clean_id) == 10 and clean_id.isdigit()

def atualizar_env(credenciais: dict):
    """Atualiza o arquivo .env com as credenciais"""
    env_path = Path('.env')
    
    # Lê o arquivo atual
    if env_path.exists():
        with open(env_path, 'r', encoding='utf-8') as f:
            linhas = f.readlines()
    else:
        linhas = []
    
    # Atualiza as linhas
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
    
    # Salva o arquivo
    with open(env_path, 'w', encoding='utf-8') as f:
        f.writelines(linhas_atualizadas)
    
    print("\n✅ Arquivo .env atualizado com sucesso!")

def mostrar_status_atual():
    """Mostra o status atual das credenciais"""
    env_path = Path('.env')
    
    print("\n" + "="*60)
    print("📊 STATUS ATUAL DAS CREDENCIAIS")
    print("="*60)
    
    if not env_path.exists():
        print("❌ Arquivo .env não encontrado")
        return
    
    credenciais_necessarias = {
        'GOOGLE_ADS_CUSTOMER_ID': 'Customer ID',
        'GOOGLE_ADS_DEVELOPER_TOKEN': 'Developer Token',
        'GOOGLE_ADS_CLIENT_ID': 'Client ID (OAuth2)',
        'GOOGLE_ADS_CLIENT_SECRET': 'Client Secret (OAuth2)',
        'GOOGLE_ADS_REFRESH_TOKEN': 'Refresh Token (OAuth2)',
    }
    
    with open(env_path, 'r', encoding='utf-8') as f:
        conteudo = f.read()
    
    for key, nome in credenciais_necessarias.items():
        # Procura a linha com a credencial
        match = re.search(f"{key}=(.+)", conteudo)
        if match and match.group(1).strip():
            valor = match.group(1).strip()
            # Mascara o valor (mostra apenas primeiros e últimos chars)
            if len(valor) > 10:
                valor_mascarado = f"{valor[:4]}...{valor[-4:]}"
            else:
                valor_mascarado = "***"
            print(f"✅ {nome:30} → {valor_mascarado}")
        else:
            print(f"❌ {nome:30} → NÃO CONFIGURADO")
    
    print("="*60)

def configuracao_rapida():
    """Configuração rápida - apenas cola as credenciais"""
    print("\n" + "="*60)
    print("⚡ CONFIGURAÇÃO RÁPIDA")
    print("="*60)
    print("\nVocê pode colar todas as credenciais de uma vez ou uma por vez.")
    print("Deixe em branco para pular.\n")
    
    credenciais = {}
    
    # Customer ID
    print("1️⃣ Customer ID (formato: 583-642-9998 ou 5836429998)")
    customer_id = input("   → ").strip()
    if customer_id:
        customer_id_limpo = limpar_customer_id(customer_id)
        if validar_customer_id(customer_id):
            credenciais['GOOGLE_ADS_CUSTOMER_ID'] = customer_id_limpo
            print(f"   ✅ Customer ID configurado: {customer_id_limpo}")
        else:
            print(f"   ⚠️ Customer ID inválido (deve ter 10 dígitos)")
    
    # Developer Token
    print("\n2️⃣ Developer Token")
    print("   (obtenha em: https://ads.google.com/ → Ferramentas → Central de API)")
    dev_token = input("   → ").strip()
    if dev_token:
        credenciais['GOOGLE_ADS_DEVELOPER_TOKEN'] = dev_token
        print(f"   ✅ Developer Token configurado")
    
    # Client ID
    print("\n3️⃣ Client ID (OAuth2)")
    print("   (termina com .apps.googleusercontent.com)")
    client_id = input("   → ").strip()
    if client_id:
        credenciais['GOOGLE_ADS_CLIENT_ID'] = client_id
        print(f"   ✅ Client ID configurado")
    
    # Client Secret
    print("\n4️⃣ Client Secret (OAuth2)")
    client_secret = input("   → ").strip()
    if client_secret:
        credenciais['GOOGLE_ADS_CLIENT_SECRET'] = client_secret
        print(f"   ✅ Client Secret configurado")
    
    # Refresh Token
    print("\n5️⃣ Refresh Token (OAuth2)")
    print("   (começa com 1//)")
    refresh_token = input("   → ").strip()
    if refresh_token:
        credenciais['GOOGLE_ADS_REFRESH_TOKEN'] = refresh_token
        print(f"   ✅ Refresh Token configurado")
    
    if credenciais:
        atualizar_env(credenciais)
    else:
        print("\n⚠️ Nenhuma credencial foi informada")

def gerar_refresh_token():
    """Ajuda a gerar o Refresh Token"""
    print("\n" + "="*60)
    print("🔑 GERAR REFRESH TOKEN")
    print("="*60)
    
    # Verifica se tem Client ID e Secret
    env_path = Path('.env')
    if not env_path.exists():
        print("❌ Arquivo .env não encontrado")
        return
    
    with open(env_path, 'r', encoding='utf-8') as f:
        conteudo = f.read()
    
    client_id_match = re.search(r"GOOGLE_ADS_CLIENT_ID=(.+)", conteudo)
    client_secret_match = re.search(r"GOOGLE_ADS_CLIENT_SECRET=(.+)", conteudo)
    
    if not client_id_match or not client_id_match.group(1).strip():
        print("❌ Client ID não configurado. Configure primeiro.")
        return
    
    if not client_secret_match or not client_secret_match.group(1).strip():
        print("❌ Client Secret não configurado. Configure primeiro.")
        return
    
    client_id = client_id_match.group(1).strip()
    client_secret = client_secret_match.group(1).strip()
    
    print("\n📝 Para gerar o Refresh Token, execute este comando:")
    print("\n" + "-"*60)
    print(f"python -m google.ads.googleads.oauth2.generate_refresh_token ^")
    print(f"  --client_id={client_id} ^")
    print(f"  --client_secret={client_secret}")
    print("-"*60)
    
    print("\n💡 O navegador abrirá automaticamente para autorização.")
    print("   Após autorizar, copie o Refresh Token gerado.\n")
    
    executar = input("Deseja executar este comando agora? (s/n): ").lower()
    
    if executar == 's':
        try:
            import subprocess
            cmd = [
                'python', '-m', 'google.ads.googleads.oauth2.generate_refresh_token',
                f'--client_id={client_id}',
                f'--client_secret={client_secret}'
            ]
            subprocess.run(cmd)
        except Exception as e:
            print(f"\n❌ Erro ao executar: {e}")
            print("Execute o comando manualmente no terminal.")

def menu_principal():
    """Menu principal"""
    while True:
        print("\n" + "="*60)
        print("🔧 CONFIGURADOR DE CREDENCIAIS - BOT GOOGLE ADS")
        print("="*60)
        print("\n1. Ver status atual das credenciais")
        print("2. Configuração rápida (adicionar todas)")
        print("3. Gerar Refresh Token (requer Client ID e Secret)")
        print("4. Abrir guia de credenciais (navegador)")
        print("5. Sair")
        print("\n" + "="*60)
        
        opcao = input("\nEscolha uma opção (1-5): ").strip()
        
        if opcao == '1':
            mostrar_status_atual()
        elif opcao == '2':
            configuracao_rapida()
        elif opcao == '3':
            gerar_refresh_token()
        elif opcao == '4':
            print("\n📖 Abrindo guia no navegador...")
            guia_path = Path('GUIA_CREDENCIAIS_GOOGLE_ADS.md')
            if guia_path.exists():
                import webbrowser
                webbrowser.open(str(guia_path.absolute()))
            else:
                print("❌ Arquivo GUIA_CREDENCIAIS_GOOGLE_ADS.md não encontrado")
        elif opcao == '5':
            print("\n👋 Até logo!")
            break
        else:
            print("\n❌ Opção inválida")

if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     🤖 CONFIGURADOR DE CREDENCIAIS - BOT GOOGLE ADS              ║
║                                                                  ║
║     Configure suas credenciais do Google Ads de forma fácil     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    """)
    
    menu_principal()
