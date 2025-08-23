
/* Negocie */
.negocie-section {
  padding: 40px 20px;
}
const form = document.getElementById("formulario");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const dados = new FormData(form);

 fetch(https://script.google.com/macros/s/AKfycbwkuOcAaaqfaIfRNE8dpKcPjvf-oAlKrR2UD_5QJPSo4LBUe0Tths3fb9lNrfUxdSyINw/exec", {
  method: "POST",
  body: dados,
})

    .then(() => {
      mensagem.innerHTML = "<p style='color:green;'>Imóvel cadastrado com sucesso!</p>";
      form.reset();
    })
    .catch(() => {
      mensagem.innerHTML = "<p style='color:red;'>Erro ao cadastrar o imóvel.</p>";
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











