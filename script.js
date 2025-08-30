document.addEventListener("DOMContentLoaded", () => {
  // 🔗 URL do seu Apps Script publicado
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwj_hGYEyrwPwf7hszqQOVbpx0jhzCZ_BLxE4CfsFqVH6qlH5mNDrSZim4x2noJKMTb/exec";

  const form = document.getElementById("formNegocie");
  const btn = form.querySelector('button[type="submit"]');
  const msgBox = document.getElementById("mensagem");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Limpa mensagens anteriores
    msgBox.textContent = "";

    // Preenche Data automaticamente (se o campo existir)
    const dataField = form.querySelector('[name="Data"]');
    if (dataField) {
      dataField.value = new Date().toLocaleDateString("pt-BR");
    }

    const formData = new FormData(form);

    try {
      btn.disabled = true;
      btn.textContent = "Enviando...";

      const resp = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
      });

      let dados;
      try {
        dados = await resp.json();
      } catch {
        throw new Error("Resposta inválida do servidor");
      }

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

