using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("movimentosestoque")]
    public class MovimentoEstoque
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("produto_id")]
        public int ProdutoId { get; set; } 

        [ForeignKey("ProdutoId")]
        public Produto Produto { get; set; } 

        [Column("quantidade")]
        public int Quantidade { get; set; }

        [Column("tipo_movimento")] 
        public string TipoMovimento { get; set; }

        [Column("data_movimento")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime DataMovimento { get; set; } = DateTime.UtcNow;
    }
}
