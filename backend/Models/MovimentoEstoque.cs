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
        public DateTime DataMovimento { get; set; } = GetBrasiliaTime();

        private static DateTime GetBrasiliaTime()
        {
            try
            {
                return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow,
                    TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time"));
            }
            catch
            {
                return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow,
                    TimeZoneInfo.FindSystemTimeZoneById("America/Sao_Paulo"));
            }
        }
    }
}
