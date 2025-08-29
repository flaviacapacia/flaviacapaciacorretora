const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzAKSip6WvNxspXSYZ2Hd9ymTtQX0d9RgzSdNsGEYRvSaMXlYZXZD0RBhj-7vH2oNPN/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formNegocie");
  const btn = form.querySelector('button[type="submit"]');

  const tiposValidos = [
    "Apartamento",
    "Casa",
    "Terreno",
    "Sala comercial",
    "Loja comercial"
  ];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipo = form.querySelector('[name="Tipo"]').value;
    if (!tiposValidos.includes(tipo)) {
      alert("Selecione um tipo de imóvel válido.");
      return;
    }

    // Preenche campos ocultos
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

      const texto = await resp.text();
      document.getElementById("mensagem").innerText = texto || "Cadastro enviado com sucesso!";
      form.reset();
    } catch (err) {
      console.error("Erro no envio:", err);
      document.getElementById("mensagem").innerText = "Erro ao enviar. Verifique os campos.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Cadastrar Imóvel";
    }
  });
});

