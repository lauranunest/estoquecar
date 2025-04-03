using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Usuarios")]
    public class Usuario
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("nome")]
        public string Name { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("senha")]
        public string Password { get; set; }

        [Column("username")]
        public string Username { get; set; }

        [Column("data_cadastro")]
        public DateTime DataCadastro { get; set; }
    }
}
