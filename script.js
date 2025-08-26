
/* Negocie */
  
document.getElementById("formNegocie").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const mensagem = document.getElementById("mensagem");
  mensagem.textContent = "Enviando...";
  mensagem.style.color = "black";

  try {
    const resposta = await fetch("https://script.google.com/macros/s/AKfycbzArn5cSSYq2FBIeTWohNn6VE5UlR4OMXn7vSny3ZWnAYmeShg6XEYS9QqCGbDcZJs_/exec", {
      method: "POST",
      body: formData
    });

    const texto = await resposta.text();
    mensagem.textContent = texto;
    mensagem.style.color = resposta.ok ? "green" : "red";

    if (resposta.ok) {
      this.reset();
    }
  } catch (err) {
    mensagem.textContent = "Erro: " + err;
    mensagem.style.color = "red";
  }
});
<script>
document.getElementById('formNegocie').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  fetch('https://seu-endpoint.com/api', {
    method: 'POST',
    body: formData
  }).then(res => res.text())
    .then(msg => document.getElementById('mensagem').innerText = msg)
    .catch(err => console.error(err));
});
</script>


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










































