﻿namespace backend.DTO
{
    public class MovimentoEstoqueDto
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public string NomeProduto { get; set; }
        public int Quantidade { get; set; }
        public string TipoMovimento { get; set; }
        public DateTime DataMovimento { get; set; }
    }
}
