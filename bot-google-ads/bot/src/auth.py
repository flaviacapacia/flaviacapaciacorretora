import os
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import json

security = HTTPBearer()

class SimpleAuth:
    """
    Sistema de autenticação simples baseado em arquivo JSON
    Para produção, migre para banco de dados
    """
    
    def __init__(self):
        self.users_file = "users.json"
        self.tokens_file = "tokens.json"
        self._ensure_files()
        self._create_default_admin()
    
    def _ensure_files(self):
        """Garante que os arquivos existem"""
        if not os.path.exists(self.users_file):
            with open(self.users_file, 'w') as f:
                json.dump({}, f)
        
        if not os.path.exists(self.tokens_file):
            with open(self.tokens_file, 'w') as f:
                json.dump({}, f)
    
    def _create_default_admin(self):
        """Cria usuário admin padrão se não existir"""
        users = self._load_users()
        if 'admin' not in users:
            admin_user = {
                'username': 'admin',
                'password_hash': self._hash_password('admin123'),
                'email': 'admin@flaviacapacia.com',
                'role': 'admin',
                'created_at': datetime.now().isoformat(),
                'active': True
            }
            users['admin'] = admin_user
            self._save_users(users)
            print("👤 Usuário admin criado!")
            print("   Username: admin")
            print("   Password: admin123")
            print("   ⚠️ MUDE A SENHA APÓS PRIMEIRO LOGIN!")
    
    def _load_users(self) -> Dict:
        """Carrega usuários do arquivo"""
        try:
            with open(self.users_file, 'r') as f:
                return json.load(f)
        except:
            return {}
    
    def _save_users(self, users: Dict):
        """Salva usuários no arquivo"""
        with open(self.users_file, 'w') as f:
            json.dump(users, f, indent=2)
    
    def _load_tokens(self) -> Dict:
        """Carrega tokens do arquivo"""
        try:
            with open(self.tokens_file, 'r') as f:
                return json.load(f)
        except:
            return {}
    
    def _save_tokens(self, tokens: Dict):
        """Salva tokens no arquivo"""
        with open(self.tokens_file, 'w') as f:
            json.dump(tokens, f, indent=2)
    
    def _hash_password(self, password: str) -> str:
        """Cria hash da senha"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def _generate_token(self) -> str:
        """Gera token aleatório"""
        return secrets.token_urlsafe(32)
    
    def register_user(
        self,
        username: str,
        password: str,
        email: str,
        role: str = 'user'
    ) -> Dict[str, Any]:
        """Registra novo usuário"""
        users = self._load_users()
        
        # Valida username
        if username in users:
            raise HTTPException(status_code=400, detail="Usuário já existe")
        
        if len(username) < 3:
            raise HTTPException(status_code=400, detail="Username deve ter pelo menos 3 caracteres")
        
        # Valida senha
        if len(password) < 6:
            raise HTTPException(status_code=400, detail="Senha deve ter pelo menos 6 caracteres")
        
        # Cria usuário
        user = {
            'username': username,
            'password_hash': self._hash_password(password),
            'email': email,
            'role': role,
            'created_at': datetime.now().isoformat(),
            'active': True
        }
        
        users[username] = user
        self._save_users(users)
        
        return {
            'success': True,
            'message': 'Usuário registrado com sucesso',
            'username': username,
            'email': email
        }
    
    def login(self, username: str, password: str) -> Dict[str, Any]:
        """Faz login e retorna token"""
        users = self._load_users()
        
        # Verifica se usuário existe
        if username not in users:
            raise HTTPException(status_code=401, detail="Usuário ou senha inválidos")
        
        user = users[username]
        
        # Verifica se está ativo
        if not user.get('active', True):
            raise HTTPException(status_code=403, detail="Usuário desativado")
        
        # Verifica senha
        password_hash = self._hash_password(password)
        if password_hash != user['password_hash']:
            raise HTTPException(status_code=401, detail="Usuário ou senha inválidos")
        
        # Gera token
        token = self._generate_token()
        tokens = self._load_tokens()
        
        tokens[token] = {
            'username': username,
            'created_at': datetime.now().isoformat(),
            'expires_at': (datetime.now() + timedelta(days=7)).isoformat()
        }
        
        self._save_tokens(tokens)
        
        return {
            'success': True,
            'token': token,
            'username': username,
            'email': user['email'],
            'role': user['role'],
            'expires_in': '7 dias'
        }
    
    def logout(self, token: str) -> Dict[str, Any]:
        """Remove token (logout)"""
        tokens = self._load_tokens()
        
        if token in tokens:
            del tokens[token]
            self._save_tokens(tokens)
        
        return {
            'success': True,
            'message': 'Logout realizado com sucesso'
        }
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verifica se token é válido e retorna dados do usuário"""
        tokens = self._load_tokens()
        
        if token not in tokens:
            raise HTTPException(status_code=401, detail="Token inválido ou expirado")
        
        token_data = tokens[token]
        
        # Verifica expiração
        expires_at = datetime.fromisoformat(token_data['expires_at'])
        if datetime.now() > expires_at:
            del tokens[token]
            self._save_tokens(tokens)
            raise HTTPException(status_code=401, detail="Token expirado")
        
        # Busca dados do usuário
        users = self._load_users()
        username = token_data['username']
        
        if username not in users:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        
        user = users[username]
        
        return {
            'username': username,
            'email': user['email'],
            'role': user['role']
        }
    
    def reset_password_request(self, email: str) -> Dict[str, Any]:
        """Solicita reset de senha (gera código)"""
        users = self._load_users()
        
        # Busca usuário por email
        user_found = None
        username_found = None
        for username, user in users.items():
            if user.get('email') == email:
                user_found = user
                username_found = username
                break
        
        if not user_found:
            # Retorna sucesso mesmo se não encontrar (segurança)
            return {
                'success': True,
                'message': 'Se o email existir, você receberá o código de reset'
            }
        
        # Gera código de 6 dígitos
        reset_code = secrets.randbelow(900000) + 100000
        
        # Salva código no usuário (expira em 30 minutos)
        user_found['reset_code'] = str(reset_code)
        user_found['reset_code_expires'] = (datetime.now() + timedelta(minutes=30)).isoformat()
        users[username_found] = user_found
        self._save_users(users)
        
        # Em produção, enviaria por email
        # Por enquanto, mostra no console
        print(f"\n🔐 CÓDIGO DE RESET DE SENHA")
        print(f"   Usuário: {username_found}")
        print(f"   Email: {email}")
        print(f"   Código: {reset_code}")
        print(f"   Válido por: 30 minutos\n")
        
        return {
            'success': True,
            'message': 'Código de reset enviado (verifique o console do servidor)',
            'code_for_dev': reset_code  # Remover em produção
        }
    
    def reset_password(
        self,
        email: str,
        reset_code: str,
        new_password: str
    ) -> Dict[str, Any]:
        """Reseta senha usando código"""
        users = self._load_users()
        
        # Busca usuário por email
        user_found = None
        username_found = None
        for username, user in users.items():
            if user.get('email') == email:
                user_found = user
                username_found = username
                break
        
        if not user_found:
            raise HTTPException(status_code=400, detail="Email não encontrado")
        
        # Verifica se tem código de reset
        if 'reset_code' not in user_found:
            raise HTTPException(status_code=400, detail="Código de reset não solicitado")
        
        # Verifica expiração
        expires_at = datetime.fromisoformat(user_found['reset_code_expires'])
        if datetime.now() > expires_at:
            raise HTTPException(status_code=400, detail="Código expirado. Solicite um novo")
        
        # Verifica código
        if user_found['reset_code'] != reset_code:
            raise HTTPException(status_code=400, detail="Código inválido")
        
        # Valida nova senha
        if len(new_password) < 6:
            raise HTTPException(status_code=400, detail="Senha deve ter pelo menos 6 caracteres")
        
        # Atualiza senha
        user_found['password_hash'] = self._hash_password(new_password)
        del user_found['reset_code']
        del user_found['reset_code_expires']
        users[username_found] = user_found
        self._save_users(users)
        
        return {
            'success': True,
            'message': 'Senha alterada com sucesso'
        }
    
    def change_password(
        self,
        username: str,
        old_password: str,
        new_password: str
    ) -> Dict[str, Any]:
        """Muda senha (com senha antiga)"""
        users = self._load_users()
        
        if username not in users:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        user = users[username]
        
        # Verifica senha antiga
        old_hash = self._hash_password(old_password)
        if old_hash != user['password_hash']:
            raise HTTPException(status_code=401, detail="Senha antiga incorreta")
        
        # Valida nova senha
        if len(new_password) < 6:
            raise HTTPException(status_code=400, detail="Senha deve ter pelo menos 6 caracteres")
        
        # Atualiza senha
        user['password_hash'] = self._hash_password(new_password)
        users[username] = user
        self._save_users(users)
        
        return {
            'success': True,
            'message': 'Senha alterada com sucesso'
        }
    
    def get_current_user(
        self,
        credentials: HTTPAuthorizationCredentials = Security(security)
    ) -> Dict[str, Any]:
        """Dependency para proteger rotas"""
        token = credentials.credentials
        return self.verify_token(token)

# Instância global
auth = SimpleAuth()

# Dependency function
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> Dict[str, Any]:
    """Use como dependência em rotas protegidas"""
    return auth.verify_token(credentials.credentials)
