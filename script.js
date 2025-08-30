document.addEventListener("DOMContentLoaded", () => {
  // 🔗 URL do seu Apps Script publicado
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyWkSnUNYFU5VwCNZcbQhMo56wns1EyhYWg4b20ylkZwd0B6OCCl7DCNCMziPhhOnjm/exec";

  const form = document.getElementById("formNegocie");
  const btn = form.querySelector('button[type="submit"]');
  const msgBox = document.getElementById("mensagem");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgBox.textContent = "";

    // Captura todos os campos e arquivos
    const formData = new FormData(form);

    try {
      btn.disabled = true;
      btn.textContent = "Enviando...";

      const resp = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
      });

      const dados = await resp.json();

      if (dados.status === "sucesso") {
        msgBox.innerHTML = `<span style="color:green">✅ ${dados.mensagem}</span>`;
        form.reset();
      } else {
        msgBox.innerHTML = `<span style="color:red">❌ Erro: ${dados.mensagem}</span>`;
      }
    } catch (err) {
      console.error("Erro no envio:", err);
      msgBox.innerHTML = `<span style="color:red">❌ Erro na conexão: ${err.message}</span>`;
    } finally {
      btn.disabled = false;
      btn.textContent = "Cadastrar Imóvel";
    }
  });
});
