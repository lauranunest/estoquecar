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
        public async Task<ActionResult<IEnumerable<MovimentoEstoqueDto>>> GetMovimentosEstoque(int page = 1, int itensPorPagina = 10)
        {
            var totalMovimentos = await _context.MovimentosEstoque.CountAsync();

            var movimentosBrutos = await _context.MovimentosEstoque
                .Include(m => m.Produto)
                .OrderByDescending(m => m.DataMovimento)
                .Skip((page - 1) * itensPorPagina)
                .Take(itensPorPagina)
                .ToListAsync();

            var fusoBrasil = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");

            var movimentos = movimentosBrutos.Select(m => new MovimentoEstoqueDto
            {
                Id = m.Id,
                ProdutoId = m.ProdutoId,
                NomeProduto = m.Produto.Nome,
                DescricaoProduto = m.Produto.Descricao,
                PrecoUnitario = m.Produto.Preco,
                Quantidade = m.Quantidade,
                TipoMovimento = char.ToUpper(m.TipoMovimento[0]) + m.TipoMovimento.Substring(1).ToLower(),
                DataMovimento = TimeZoneInfo.ConvertTimeFromUtc(m.DataMovimento, fusoBrasil).ToString("dd/MM/yyyy HH:mm")
            }).ToList();

            return Ok(new
            {
                totalItems = totalMovimentos,
                currentPage = page,
                totalPages = (int)Math.Ceiling(totalMovimentos / (double)itensPorPagina),
                data = movimentos
            });
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
                DataMovimento = DateTime.UtcNow
            };

            _context.MovimentosEstoque.Add(movimento);
            _context.SaveChanges();

            return Ok();
        }

    }
}
