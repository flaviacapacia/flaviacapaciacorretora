  document.addEventListener("DOMContentLoaded", () => {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbweWucNc6iglGYoQRtLWWBMjpnZs5apWWr0djTT8_Hr_1RPh6x9SzoCpKwQmqFCeZp4/exe";
  const form = document.getElementById("formNegocie");
  const btn = form.querySelector('button[type="submit"]');

  const tiposValidos = ["Apartamento", "Casa", "Terreno", "Sala comercial", "Loja comercial"];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipo = form.querySelector('[name="Tipo"]').value;
    if (!tiposValidos.includes(tipo)) {
      alert("Selecione um tipo de imóvel válido.");
      return;
    }

    form.querySelector('[name="Data"]').value = new Date().toLocaleDateString("pt-BR");
    form.querySelector('[name="Codigo"]').value = "IMV-" + Date.now();

    const formData = new FormData(form);

    try {
      btn.disabled = true;
      btn.textContent = "Enviando...";

      const resp = await fetch(SCRIPT_URL, { method: "POST", body: formData });
      const dados = await resp.json();

      document.getElementById("mensagem").innerText =
        dados.status === "sucesso"
          ? `Cadastro enviado com sucesso! Código: ${dados.codigo}`
          : "Erro ao enviar. Verifique os campos.";

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
