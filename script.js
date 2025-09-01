document.getElementById("formnegocie").addEventListener("submit", async function(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Adiciona a data atual
  const agora = new Date();
  formData.append("Data", agora.toLocaleString("pt-BR"));

  try {
    const resposta = await fetch(
      "https://script.google.com/macros/s/AKfycbxJfXxoGNAV9gwP265OiL90iv3cBtiVE-mMhewMFE4oYDZoTvKZaFagR1WT9igo4LcQ/exec",
      {
        method: "POST",
        body: formData
      }
    );

    let resultado;
    try {
      resultado = await resposta.json();
    } catch {
      throw new Error("Resposta inválida do servidor");
    }

    if (resultado.status === "sucesso") {
      document.getElementById("mensagem").innerHTML =
        `<p style="color:green">✅ Imóvel cadastrado com sucesso!<br>Código: <strong>${resultado.codigo}</strong></p>`;
      form.reset();
    } else {
      document.getElementById("mensagem").innerHTML =
        `<p style="color:red">❌ Erro: ${resultado.mensagem || "Erro desconhecido"}</p>`;
    }
  } catch (erro) {
    document.getElementById("mensagem").innerHTML =
      `<p style="color:red">❌ Falha na conexão: ${erro.message}</p>`;
  }
});






