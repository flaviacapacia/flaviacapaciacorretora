
/* Negocie */
// URL do seu Google Apps Script publicado como Web App
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUmtr3qCNKhudgCzfYdScdA48iZZWIELZ2kpxFDMrMuit9lUzdK3NWiw169wUCSf0A/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formNegocie");
  const btn = form?.querySelector('button[type="submit"]');

  if (!form) {
    console.error("Formulário #formNegocie não encontrado.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      btn && (btn.disabled = true);
      btn && (btn.textContent = "Enviando...");

      const resp = await fetch(SCRIPT_URL, { method: "POST", body: formData });
      const texto = await resp.text();

      if (!resp.ok) throw new Error(`Falha HTTP ${resp.status}`);

      alert(texto || "Cadastro enviado com sucesso!");
      form.reset();
    } catch (err) {
      console.error("Erro no envio:", err);
      alert("Ocorreu um erro ao enviar. Verifique os campos e tente novamente.");
    } finally {
      btn && (btn.disabled = false);
      btn && (btn.textContent = "Enviar Cadastro");
    }
  });
});


    });
  })
  .catch(error => console.error("Erro ao carregar imóveis:", error));






















































