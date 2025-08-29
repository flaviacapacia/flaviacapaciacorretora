document.addEventListener("DOMContentLoaded", () => {
  // 🔗 URL do seu Apps Script publicado
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9JgoW81hG9med2wInUPdx5mo5OMgsEK9cgnr8Uizvipd0agbGuVX3sVyu5r7FiIgB/exec";
tp
  const form = document.getElementById("formNegocie");
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Preenche Data e Código automaticamente
    form.querySelector('[name="Data"]').value = new Date().toLocaleDateString("pt-BR");
    form.querySelector('[name="Codigo"]').value = "IMV-" + Date.now();

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
        document.getElementById("mensagem").innerHTML = `
          ✅ ${dados.mensagem}<br>
          Código do imóvel: <strong>${dados.codigo}</strong><br>
          <a href="${dados.pastaImagens}" target="_blank">📂 Pasta com todas as imagens</a><br>
          ${dados.imagens.map(link => `<a href="${link}" target="_blank">📷 Ver imagem</a>`).join(" | ")}
        `;
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

