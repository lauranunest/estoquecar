using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.DTO;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LoginController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            var user = _context.Usuarios.FirstOrDefault(u => u.Username == loginDto.Username);

            if (user == null)
            {
                return Unauthorized(new { message = "Usuário não encontrado" });
            }

            if (user.Password != loginDto.Password)
            {
                return Unauthorized(new { message = "Senha incorreta" });
            }

            return Ok(new { message = "Login bem-sucedido" });
        }
    }
}
