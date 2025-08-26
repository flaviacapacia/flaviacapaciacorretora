
/* Negocie */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formNegocie");
  const mensagem = document.getElementById("mensagem");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // evita recarregar a página

    mensagem.textContent = "Enviando...";

    const formData = new FormData(form);

    fetch("https://script.google.com/macros/s/AKfycbw9hIq2LF02pnTXrG01CzjcsnhGbFUxWQHPoH4NTg38o-N2sGVEf7ravnVlMLFD6Hhm/exec", {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(texto => {
        mensagem.textContent = texto;
        mensagem.style.color = "green";
        form.reset();
      })
      .catch(error => {
        console.error("Erro no envio:", error);
        mensagem.textContent = "Ocorreu um erro ao enviar. Tente novamente.";
        mensagem.style.color = "red";
      });
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













































