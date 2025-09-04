
/* Negocie */
document.getElementById("formnegocie").addEventListener("submit", async function(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Debug: ver se as imagens estão indo
  console.log("Arquivos selecionados:", formData.getAll("file"));

  try {
    const resposta = await fetch("https://script.google.com/macros/s/AKfycbzYnkrVlNkPIKre_0tsoZIou_7txJnUTDBYY-3VWZ4elEzyQfmtzN-cmqopG69-vFLg/exec", {
      method: "POST",
      body: formData // não definir Content-Type manualmente!
    });

    const resultado = await resposta.json();
    document.getElementById("mensagem").innerText = resultado.mensagem;

  } catch (erro) {
    document.getElementById("mensagem").innerText = "Erro: " + erro.message;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formNegocie");
  const mensagem = document.getElementById("mensagem");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // evita recarregar a página

    mensagem.textContent = "Enviando...";

    const formData = new FormData(form);

    fetch("https://script.google.com/macros/s/AKfycbxA9eOU9q8kIzqSDdOft7y0MgXQmvW1XABhdXiQ6Frb4K8qdrh3SqbwBOCQgO0mG8E/exec", {
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













































