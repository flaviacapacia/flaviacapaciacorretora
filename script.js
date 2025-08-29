document.addEventListener("DOMContentLoaded", () => {
  // 🔗 URL do seu Apps Script publicado
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyR6KCKnr59EmdRTmZ7YeWkS6waaLxT2wq_Asyx-HTKE16LAFIoGZcaWnquWvRaudNn/exec";

  const form = document.getElementById("formNegocie");
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Preenche Data automaticamente
    form.querySelector('[name="Data"]').value = new Date().toLocaleDateString("pt-BR");

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
        document.getElementById("mensagem").innerHTML = `✅ ${dados.mensagem}`;
        form.reset();
      } else {
        document.getElementById("mensagem").innerText = "❌ Erro: " + dados.mensagem;
      }

    } catch (err) {
      console.error("Erro no envio:", err);
      document.getElementById("mensagem").innerText = "❌ Erro na conexão: " + err;
    } finally {
      btn.disabled = false;
      btn.textContent = "Cadastrar Imóvel";
    }
  });
});

