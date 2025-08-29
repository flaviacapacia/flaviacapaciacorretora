const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzO4QZJmVoWniOC9-SdQ9oQGRFZ-agVTIzam8_aMJoaU_cir4cOt2d6WQyNKNK6fhcz/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formNegocie");
  const btn = form?.querySelector('button[type="submit"]');

  if (!form) {
    console.error("Formulário #formNegocie não encontrado.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Preenche Data e Codigo automaticamente
    const agora = new Date();
    form.querySelector('[name="Data"]').value = agora.toLocaleDateString("pt-BR");
    form.querySelector('[name="Codigo"]').value = "IMV-" + Date.now();

    // Se não quiser que o cliente veja Informações Privada, remova do HTML ou use hidden
    // form.querySelector('[name="Informaçoes Privada"]').value = "Somente uso interno";

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
      if (!resp.ok) throw new Error(`Falha HTTP ${resp.status}`);

      alert(texto || "Cadastro enviado com sucesso!");
      form.reset();

    } catch (err) {
      console.error("Erro no envio:", err);
      alert("Ocorreu um erro ao enviar. Verifique os campos e tente novamente.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Enviar Cadastro";
      }
    }
  });
});
