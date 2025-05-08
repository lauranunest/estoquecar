using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CadastroUsuarioController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CadastroUsuarioController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CadastrarUsuario([FromBody] CadastroUsuarioDto cadastroDto)
        {
            if (_context.Usuarios.Any(u => u.Username == cadastroDto.Username))
            {
                return BadRequest(new { mensagem = "Nome de usuário já existe." });
            }

            var novoUsuario = new Usuario
            {
                Name = cadastroDto.Nome,
                Email = cadastroDto.Email,
                Password = cadastroDto.Senha,
                Username = cadastroDto.Username,
                DataCadastro = DateTime.UtcNow
            };

            _context.Usuarios.Add(novoUsuario);
            _context.SaveChanges();

            return Ok(new { mensagem = "Usuário cadastrado com sucesso!" });
        }
    }
}
