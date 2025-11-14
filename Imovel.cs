using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MeuSiteImoveis.api.Models
{
    [Table("Codigos_imoveisFC")]
    public class Imovel
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;   // V440, V441...
        public string Titulo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public decimal Preco { get; set; }
        public string Endereco { get; set; } = string.Empty;
        public int? Quartos { get; set; }
        public int? Banheiros { get; set; }
        public string ImagemUrl { get; set; } = string.Empty;

        // Campos privados (não expostos publicamente)
        public string Proprietario { get; set; } = string.Empty;
        public string Contato { get; set; } = string.Empty;
        public string InfoPrivada { get; set; } = string.Empty;

        // Novas propriedades (se controller espera)
        public string VendaOuAluguel { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public decimal? Valor { get; set; }
        public decimal? ValorCondominio { get; set; }
        public decimal? ValorIPTU { get; set; }
        public string Condominio { get; set; } = string.Empty;

        // Novo campo com valor automático
        public DateTime DataCadastro { get; set; } = DateTime.Now;
    }
}
