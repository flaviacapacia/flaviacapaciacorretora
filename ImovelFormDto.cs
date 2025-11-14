public class Imoveis
{
    public int Id { get; set; }
    public string Proprietario { get; set; }
    public string Contato { get; set; }
    public string VendaOuAluguel { get; set; }
    public string Tipo { get; set; }
    public decimal? Valor { get; set; }
    public decimal? ValorCondominio { get; set; }
    public decimal? ValorIPTU { get; set; }
    public string Endereco { get; set; }
    public string Condominio { get; set; }
    public string Descricao { get; set; }
    public string ImagemUrl { get; set; }
    public DateTime DataCadastro { get; set; }
}
