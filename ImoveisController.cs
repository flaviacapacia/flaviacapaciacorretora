[HttpPost]
[RequestSizeLimit(20_000_000)]
public async Task<IActionResult> PostImovel([FromForm] ImovelFormDto dto)
{
    // Pasta temporária para uploads
    var tempFolder = Path.Combine(_env.ContentRootPath, "uploads");
    Directory.CreateDirectory(tempFolder);

    var savedPaths = new List<string>();
    if (dto.Files != null && dto.Files.Count > 0)
    {
        foreach (var file in dto.Files)
        {
            if (file.Length == 0) continue;
            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var fullPath = Path.Combine(tempFolder, fileName);
            using (var stream = System.IO.File.Create(fullPath))
            {
                await file.CopyToAsync(stream);
            }
            savedPaths.Add(fullPath);
        }
    }

    var imagemUrlFinal = dto.ImagemUrl;
    if (string.IsNullOrWhiteSpace(imagemUrlFinal) && savedPaths.Count > 0)
    {
        imagemUrlFinal = string.Join(",", savedPaths);
    }

    // Lista de avisos
    var avisos = new List<string>();
    if (string.IsNullOrWhiteSpace(dto.Proprietario))
        avisos.Add("Proprietário não informado.");
    if (string.IsNullOrWhiteSpace(dto.Contato))
        avisos.Add("Contato não informado.");
    if (string.IsNullOrWhiteSpace(dto.VendaOuAluguel))
        avisos.Add("Venda/Aluguel não informado.");
    if (string.IsNullOrWhiteSpace(dto.Tipo))
        avisos.Add("Tipo do imóvel não informado.");
    if (string.IsNullOrWhiteSpace(dto.Valor))
        avisos.Add("Valor não informado.");

    var imovel = new Imovel
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
        ImagemUrl = imagemUrlFinal,
        DataCadastro = DateTime.Now
    };

    _context.Imoveis.Add(imovel);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Imóvel cadastrado com sucesso!",
        id = imovel.Id,
        avisos
    });
}
