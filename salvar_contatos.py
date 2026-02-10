from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Permite requisições do frontend

# Arquivo CSV para armazenar contatos
CSV_FILE = "contatos.csv"
CSV_HEADERS = ["Nome", "Telefone", "Email", "Mensagem", "Data"]

# Criar arquivo CSV se não existir
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(CSV_HEADERS)

@app.route("/salvar-contato", methods=["POST"])
def salvar_contato():
    try:
        data = request.json or {}

        # timestamp
        ts = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

        # Se payload tem campos básicos de contato, salvar em contatos.csv (compatibilidade)
        if data.get("nome") and data.get("email") and data.get("telefone"):
            with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow([
                    data.get("nome"),
                    data.get("telefone"),
                    data.get("email"),
                    data.get("mensagem", ""),
                    data.get("data", ts)
                ])
            return jsonify({"sucesso": True, "mensagem": "Contato salvo em contatos.csv"}), 200

        # Caso contrário, salvar o payload genérico em registros.csv (JSON)
        registros_file = "registros.csv"
        if not os.path.exists(registros_file):
            with open(registros_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(["payload_json", "data"])

        with open(registros_file, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([json.dumps(data, ensure_ascii=False), ts])

        return jsonify({"sucesso": True, "mensagem": "Registro salvo em registros.csv"}), 200
    
    except Exception as e:
        print(f"Erro ao salvar contato: {e}")
        return jsonify({"erro": str(e)}), 500

@app.route("/listar-contatos", methods=["GET"])
def listar_contatos():
    """Listar todos os contatos (apenas para admin)"""
    try:
        contatos = []
        if os.path.exists(CSV_FILE):
            with open(CSV_FILE, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                contatos = list(reader)
        
        return jsonify({"contatos": contatos}), 200
    
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == "__main__":
    print("🚀 Servidor rodando em http://localhost:5000")
    print(f"💾 Contatos sendo salvos em: {CSV_FILE}")
    app.run(debug=True, port=5000)
