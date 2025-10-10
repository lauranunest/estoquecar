using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProdutosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] Produto produto)
        {
            if (produto == null) return BadRequest(new { mensagem = "Dados inválidos." });

            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Produto cadastrado com sucesso!" });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Buscar(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return NotFound(new { mensagem = "Produto não encontrado." });

            return Ok(produto);
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var produtos = await _context.Produtos.ToListAsync();
            return Ok(produtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] Produto dto)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return NotFound(new { mensagem = "Produto não encontrado." });

            produto.Nome = dto.Nome;
            produto.Descricao = dto.Descricao;
            produto.Preco = dto.Preco;

            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Produto atualizado com sucesso!" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return NotFound(new { mensagem = "Produto não encontrado." });

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Produto deletado com sucesso!" });
        }

        [HttpGet("buscar")]
        public async Task<IActionResult> BuscarPorNome([FromQuery] string nome)
        {
            if (string.IsNullOrWhiteSpace(nome))
                return BadRequest(new { mensagem = "O nome do produto é obrigatório." });

            // Busca sensitiva (case-sensitive)
            var produtos = await _context.Produtos
                .Where(p => p.Nome.Contains(nome))
                .ToListAsync();

            if (produtos.Count == 0)
                return NotFound(new { mensagem = "Nenhum produto encontrado com esse nome." });

            return Ok(produtos);
        }


    }
}
