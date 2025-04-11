using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.DTO;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovimentoEstoqueController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MovimentoEstoqueController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovimentoEstoqueDto>>> GetMovimentosEstoque()
        {
            var movimentos = await _context.MovimentosEstoque
                .Include(m => m.Produto)
                .OrderByDescending(m => m.DataMovimento) 
                .Select(m => new MovimentoEstoqueDto
                {
                    Id = m.Id,
                    ProdutoId = m.ProdutoId,
                    NomeProduto = m.Produto.Nome,
                    Quantidade = m.Quantidade,
                    TipoMovimento = m.TipoMovimento,
                    DataMovimento = m.DataMovimento
                })
                .ToListAsync();

            return Ok(movimentos);
        }

        [HttpPost]
        public IActionResult RegistrarMovimento([FromBody] MovimentoEstoqueDto movimentoDto)
        {
            var produto = _context.Produtos.FirstOrDefault(p => p.Id == movimentoDto.ProdutoId);

            if (produto == null)
            {
                return NotFound("Produto não encontrado.");
            }

            var quantidadeAtual = _context.MovimentosEstoque
                .Where(m => m.ProdutoId == movimentoDto.ProdutoId)
                .Sum(m => m.TipoMovimento.ToLower() == "entrada" ? m.Quantidade : -m.Quantidade);

            if (movimentoDto.TipoMovimento.ToLower() == "saida" && movimentoDto.Quantidade > quantidadeAtual)
            {
                return BadRequest($"Estoque insuficiente. Quantidade: {quantidadeAtual}.");
            }

            var movimento = new MovimentoEstoque
            {
                ProdutoId = movimentoDto.ProdutoId,
                Quantidade = movimentoDto.Quantidade,
                TipoMovimento = movimentoDto.TipoMovimento,
                DataMovimento = movimentoDto.DataMovimento
            };

            _context.MovimentosEstoque.Add(movimento);
            _context.SaveChanges();

            return Ok();
        }

    }
}
