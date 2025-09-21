using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsuarioController(ApplicationDbContext context)
        {
            _context = context;
        }

        // CREATE
        [HttpPost]
        public IActionResult Criar([FromBody] CadastroUsuarioDto cadastroDto)
        {
            if (_context.Usuarios.Any(u => u.Username == cadastroDto.Username))
                return BadRequest(new { mensagem = "Nome de usuário já existe." });

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

        // READ - Buscar usuário por Id
        [HttpGet("{id}")]
        public IActionResult Buscar(int id)
        {
            var usuario = _context.Usuarios
                .Where(u => u.Id == id)
                .Select(u => new { u.Id, u.Name, u.Email, u.Username, u.DataCadastro })
                .FirstOrDefault();

            if (usuario == null)
                return NotFound(new { mensagem = "Usuário não encontrado." });

            return Ok(usuario);
        }

        // UPDATE
        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, [FromBody] CadastroUsuarioDto dto)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == id);
            if (usuario == null)
                return NotFound(new { mensagem = "Usuário não encontrado." });

            usuario.Name = dto.Nome;
            usuario.Email = dto.Email;
            usuario.Username = dto.Username;
            usuario.Password = dto.Senha;

            _context.SaveChanges();

            return Ok(new { mensagem = "Usuário atualizado com sucesso!" });
        }

        // DELETE
        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == id);
            if (usuario == null)
                return NotFound(new { mensagem = "Usuário não encontrado." });

            _context.Usuarios.Remove(usuario);
            _context.SaveChanges();

            return Ok(new { mensagem = "Usuário deletado com sucesso!" });
        }

        [HttpGet]
        public IActionResult Listar([FromQuery] string? nome = null)
        {
            var query = _context.Usuarios.AsQueryable();

            if (!string.IsNullOrEmpty(nome))
            {
                string nomeLower = nome.ToLower();
                query = query.Where(u => u.Name.ToLower().Contains(nomeLower));
            }

            var usuarios = query
                .Select(u => new { u.Id, u.Name, u.Email, u.Username, u.DataCadastro })
                .ToList();

            return Ok(usuarios);
        }
    }
}
