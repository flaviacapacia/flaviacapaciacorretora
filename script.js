document.getElementById("formnegocie").addEventListener("submit", async function(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Debug: ver se as imagens estão indo
  console.log("Arquivos selecionados:", formData.getAll("file"));

  try {
    const resposta = await fetch("https://script.google.com/macros/s/AKfycbzK4ObCpEJorR9uHydeN1CwSF6wh4Q5i6YxVXK6FdonxiJ4aq2Z8_JMzX0vPTFMkZQ/exec", {
      method: "POST",
      body: formData // não definir Content-Type manualmente!
    });

    const resultado = await resposta.json();
    document.getElementById("mensagem").innerText = resultado.mensagem;

  } catch (erro) {
    document.getElementById("mensagem").innerText = "Erro: " + erro.message;
  }
});







