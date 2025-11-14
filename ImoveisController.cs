[HttpPost]
[Route("api/imoveis")]
public async Task<IActionResult> CadastrarImovel([FromForm] ImovelDto dto)
{
    var imovel = new Imoveis
    {
        Proprietario = dto.Proprietario,
        Contato = dto.Contato,
        VendaOuAluguel = dto.VendaOuAluguel,
        Tipo = dto.Tipo,
        Valor = dto.Valor,
        ValorCondominio = dto.ValorCondominio,
        ValorIPTU = dto.ValorIPTU,
        Endereco = dto.Endereco,
        Condominio = dto.Condominio,
        Descricao = dto.Descricao,
        ImagemUrl = dto.ImagemUrl,
        DataCadastro = DateTime.Now
    };

    _context.Imoveis.Add(imovel);
    await _context.SaveChangesAsync();

    return Ok("✅ Imóvel cadastrado com sucesso!");
}
