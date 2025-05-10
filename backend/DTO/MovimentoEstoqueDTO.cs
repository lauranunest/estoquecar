namespace backend.DTO
{
    public class MovimentoEstoqueDto
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public string? NomeProduto { get; set; }
        public string? DescricaoProduto { get; set; }
        public decimal? PrecoUnitario { get; set; }
        public decimal? PrecoTotal => PrecoUnitario * Quantidade;
        public int Quantidade { get; set; }
        public string TipoMovimento { get; set; }
        public string? DataMovimento { get; set; }
    }
}
