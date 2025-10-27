using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ImoveisController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ImoveisController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpPost]
    [RequestSizeLimit(20_000_000)] // até 20MB
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

        return Ok(new { message = "Imóvel cadastrado com sucesso!", id = imovel.Id });
    }

    [HttpGet]
    public async Task<IActionResult> GetImoveis()
    {
        var lista = await _context.Imoveis.OrderByDescending(i => i.DataCadastro).ToListAsync();
        return Ok(lista);
    }
}
