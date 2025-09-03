document.getElementById("formnegocie").addEventListener("submit", async function(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Debug: ver se as imagens estão indo
  console.log("Arquivos selecionados:", formData.getAll("imagens"));

  try {
    const resposta = await fetch("https://script.google.com/macros/s/AKfycbwYBeQd9kxbdCakQK3f8TjM5TXrkvsxhz65dvFPbb7idDF4MYkkBP--qfeuXFEiGVAd/exec", {
      method: "POST",
      body: formData // não definir Content-Type manualmente!
    });

    const resultado = await resposta.json();
    document.getElementById("mensagem").innerText = resultado.mensagem;

  } catch (erro) {
    document.getElementById("mensagem").innerText = "Erro: " + erro.message;
  }
});
