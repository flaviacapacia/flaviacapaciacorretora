document.getElementById("formnegocie").addEventListener("submit", async function(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Debug: ver se as imagens estão indo
  console.log("Arquivos selecionados:", formData.getAll("imagens"));

  try {
    const resposta = await fetch("https://script.google.com/macros/s/AKfycbzV2DMrjU6r8klceqql06Uk1QTd8_KiW8vJFgLb2BWVXRn5n_hTj_ymQodpQUfSM88/exec", {
      method: "POST",
      body: formData // não definir Content-Type manualmente!
    });

    const resultado = await resposta.json();
    document.getElementById("mensagem").innerText = resultado.mensagem;

  } catch (erro) {
    document.getElementById("mensagem").innerText = "Erro: " + erro.message;
  }
});




