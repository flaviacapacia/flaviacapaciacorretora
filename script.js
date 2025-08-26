
/* Negocie */
// URL do seu Google Apps Script publicado como Web App
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbye270bAH5WZhye9zNwVZ7UKW-a-AYCPY7rDeC-agLIpR5MlDSMHkgdNaDbYEP-n1pj/exec"; // atualize com a URL vigente

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


/* fetch('https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/integrations/5b33fb35-31ad-48a1-9ad7-78e3918ca78f/casa-mineira.xml')
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    const imoveis = data.querySelectorAll("imovel");
    const container = document.getElementById("lista-imoveis-tecimob");

    imoveis.forEach(imovel => {
      const titulo = imovel.querySelector("titulo")?.textContent || "Sem título";
      const descricao = imovel.querySelector("descricao")?.textContent || "";
      const preco = imovel.querySelector("valor")?.textContent || "Sob consulta";
      const imagem = imovel.querySelector("fotos foto")?.textContent || "img/imovel-default.jpg";

      const card = document.createElement("div");
      card.className = "imovel-card";
      card.innerHTML = `
        <img src="${imagem}" alt="${titulo}">
        <h3>${titulo}</h3>
        <p>${descricao}</p>
        <strong>Valor: R$ ${preco}</strong>
      `;
      container.appendChild(card);
    });
  })
  .catch(error => console.error("Erro ao carregar imóveis:", error));




















































