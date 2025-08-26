
/* Negocie */
// URL do seu Google Apps Script publicado como Web App
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzocfd5qO4Ggotu5Rw3wBquBTyjdazXbfnGTVMy2YhBdSQ7KW14W5wm1gpJgphvDDVG/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formNegocie");

  if (!form) {
    console.error("Formulário #formNegocie não encontrado.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Monta os dados do formulário
    const formData = new FormData(form);

    // Log para debug (opcional)
    console.log("Enviando dados:", [...formData.entries()]);

    try {
      // Envia via fetch
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.text(); // ou .json() se o Apps Script retornar JSON
      console.log("Resposta do servidor:", result);

      alert("✅ Cadastro enviado com sucesso!");
      form.reset();

    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("❌ Ocorreu um erro ao enviar. Tente novamente.");
    }
  });
});



fetch('https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/integrations/5b33fb35-31ad-48a1-9ad7-78e3918ca78f/casa-mineira.xml')
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

















































