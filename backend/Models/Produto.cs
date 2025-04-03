using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Produtos")]
    public class Produto
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; }

        [Column("descricao")]
        public string Descricao { get; set; }

        [Column("quantidade")]
        public int Quantidade { get; set; }

        [Column("preco")]
        public decimal Preco { get; set; }

        [Column("data_cadastro")]
        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
    }
}
