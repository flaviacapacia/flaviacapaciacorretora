const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9STtitG_T2l05tSDgRv9O65dPALVFRhBe2LBvckVZKHL8BJM6c2Zz3qnycDGULec/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formularioImovel");
  const btn = form?.querySelector('button[type="submit"]');

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

    // Preenche campos automáticos
    const agora = new Date();
    form.appendChild(createHiddenInput("Data", agora.toLocaleDateString("pt-BR")));
    form.appendChild(createHiddenInput("Codigo", "IMV-" + Date.now()));

    const formData = new FormData(form);

    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Enviando...";
      }

      const resp = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
      });

      const texto = await resp.text();
      alert(texto || "Cadastro enviado com sucesso!");
      form.reset();
    } catch (err) {
      console.error("Erro no envio:", err);
      alert("Erro ao enviar. Verifique os campos.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Cadastrar Imóvel";
      }
    }
  });

  function createHiddenInput(name, value) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }
});
