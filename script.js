
/* Negocie */

const form = document.getElementById("formulario");
const mensagem = document.getElementById("mensagem");

const form = document.getElementById("formulario");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Coleta os dados do formulário manualmente
  const dados = {
    proprietario: form.proprietario.value,
    contato: form.contato.value,
    vendaOuAluguel: form.vendaOuAluguel.value,
    tipo: form.tipo.value,
    valor: form.valor.value,
    valorCondominio: form.valorCondominio.value,
    valorIPTU: form.valorIPTU.value,
    endereco: form.endereco.value,
    condominio: form.condominio.value,
    descricao: form.descricao.value,
    imagem: form.imagem.value,
    codigo: form.codigo.value,
    link: form.link.value,
    informacoesPrivadas: form.informacoesPrivadas.value,
    documento: form.documento.value
  };

  fetch("https://script.google.com/macros/s/AKfycbx3cIMrLPUzHjar69-lXygNtkM83YLE6_CLTncqdnV2tZ8wnpq3Qr2LRAA_rXKHFW1V9g/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  })
  .then(() => {
    mensagem.innerHTML = "<p style='color:green;'>Imóvel cadastrado com sucesso!</p>";
    form.reset();
  })
  .catch(() => {
    mensagem.innerHTML = "<p style='color:red;'>Erro ao cadastrar o imóvel.</p>";
  });
});

  

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const form = document.querySelector("form");

  // Preenche os campos
  for (const [key, value] of params.entries()) {
    const field = document.querySelector(`[name="${key}"]`);
    if (field) field.value = decodeURIComponent(value);
  }

  // Se todos os campos obrigatórios estiverem preenchidos, envia automaticamente
  const requiredFields = ["proprietario", "contato", "vendaOuAluguel", "tipo", "valor", "endereco"];
  const allFilled = requiredFields.every(name => {
    const field = document.querySelector(`[name="${name}"]`);
    return field && field.value.trim() !== "";
  });

  if (allFilled) {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  }
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


























