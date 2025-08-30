document.getElementById("formNegocie").addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  // Adiciona a data atual
  const agora = new Date();
  formData.set("Data", agora.toLocaleString("pt-BR"));

  try {
    const resposta = await fetch("https://script.google.com/macros/s/AKfycbxsysfVWUTyrd5IWyxxd1-pTUDUypbromfAv2ZA2g8DdJgZdmfbyoPTrIux0_cyNPXI/exec", { // <-- troque pelo URL implantado do Apps Script
      method: "POST",
      body: formData
    });

    const resultado = await resposta.json();
    if (resultado.status === "sucesso") {
      document.getElementById("mensagem").innerHTML =
        `<p style="color:green">Imóvel cadastrado com sucesso! Código: ${resultado.codigo}</p>`;
      form.reset();
    } else {
      document.getElementById("mensagem").innerHTML =
        `<p style="color:red">Erro: ${resultado.mensagem}</p>`;
    }
  } catch (erro) {
    document.getElementById("mensagem").innerHTML =
      `<p style="color:red">Falha na conexão: ${erro.message}</p>`;
  }
});
