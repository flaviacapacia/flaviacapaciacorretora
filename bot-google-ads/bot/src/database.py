import os
import pyodbc
from typing import Optional, List, Dict, Any

class Database:
    def __init__(self):
        self.connection_string = (
            f"DRIVER={{{os.getenv('DB_DRIVER', 'ODBC Driver 17 for SQL Server')}}};"
            f"SERVER={os.getenv('DB_HOST', 'localhost')},{os.getenv('DB_PORT', '1433')};"
            f"DATABASE={os.getenv('DB_NAME', 'flaviacapacia')};"
            f"UID={os.getenv('DB_USER', 'sa')};"
            f"PWD={os.getenv('DB_PASSWORD', '')};"
            f"TrustServerCertificate=yes;"
        )
        self.connection: Optional[pyodbc.Connection] = None

    def connect(self):
        """Estabelece conexão com o banco de dados"""
        try:
            self.connection = pyodbc.connect(self.connection_string, timeout=30)
            print("✅ Conectado ao SQL Server")
            return self.connection
        except Exception as e:
            print(f"❌ Erro ao conectar ao SQL Server: {e}")
            raise

    def disconnect(self):
        """Fecha a conexão com o banco de dados"""
        if self.connection:
            self.connection.close()
            print("🔌 Conexão com SQL Server fechada")

    def execute_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """Executa uma query SELECT e retorna os resultados"""
        try:
            if not self.connection:
                self.connect()
            
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            
            columns = [column[0] for column in cursor.description]
            results = []
            
            for row in cursor.fetchall():
                results.append(dict(zip(columns, row)))
            
            cursor.close()
            return results
        except Exception as e:
            print(f"❌ Erro ao executar query: {e}")
            raise

    def execute_non_query(self, query: str, params: tuple = ()) -> int:
        """Executa uma query INSERT/UPDATE/DELETE"""
        try:
            if not self.connection:
                self.connect()
            
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            self.connection.commit()
            
            affected_rows = cursor.rowcount
            cursor.close()
            
            return affected_rows
        except Exception as e:
            print(f"❌ Erro ao executar non-query: {e}")
            if self.connection:
                self.connection.rollback()
            raise

    def get_imovel(self, imovel_id: int) -> Optional[Dict[str, Any]]:
        """Busca dados de um imóvel específico"""
        query = "SELECT * FROM Imoveis WHERE id = ?"
        results = self.execute_query(query, (imovel_id,))
        return results[0] if results else None

    def save_blog_post(self, titulo: str, url: str, conteudo: str, keywords: List[str]):
        """Salva um post do blog no cache"""
        query = """
            INSERT INTO BlogPosts (titulo, url, conteudo, keywords, scraped_at)
            VALUES (?, ?, ?, ?, GETDATE())
        """
        keywords_str = ','.join(keywords)
        return self.execute_non_query(query, (titulo, url, conteudo, keywords_str))

# Instância global
db = Database()
