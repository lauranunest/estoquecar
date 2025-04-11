using backend.DTO;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("resumo-completo")]
        public async Task<IActionResult> GetResumoCompleto([FromQuery] DateTime? inicio, [FromQuery] DateTime? fim)
        {
            var movimentosQuery = _context.MovimentosEstoque.AsQueryable();
            if (inicio.HasValue)
                movimentosQuery = movimentosQuery.Where(m => m.DataMovimento >= inicio.Value);
            if (fim.HasValue)
                movimentosQuery = movimentosQuery.Where(m => m.DataMovimento <= fim.Value);

            var totalMovimentacoes = await movimentosQuery.CountAsync();
            var totalEntradas = await movimentosQuery
                .Where(m => m.TipoMovimento == "entrada")
                .SumAsync(m => m.Quantidade);

            var totalSaidas = await movimentosQuery
                .Where(m => m.TipoMovimento == "saida")
                .SumAsync(m => m.Quantidade);

            var produtosQuery = _context.Produtos.AsQueryable();
            if (inicio.HasValue)
                produtosQuery = produtosQuery.Where(p => p.DataCadastro >= inicio.Value);
            if (fim.HasValue)
                produtosQuery = produtosQuery.Where(p => p.DataCadastro <= fim.Value);

            var totalProdutosCadastrados = await produtosQuery.CountAsync();

            var estoqueAtual = await _context.MovimentosEstoque
                .GroupBy(m => m.ProdutoId)
                .Select(g => g.Sum(m => m.TipoMovimento == "entrada" ? m.Quantidade : -m.Quantidade))
                .SumAsync();

            var dto = new DashboardResumoDTO
            {
                TotalProdutosCadastrados = totalProdutosCadastrados,
                QuantidadeTotalEmEstoque = estoqueAtual,
                TotalMovimentacoes = totalMovimentacoes,
                TotalEntradas = totalEntradas,
                TotalSaidas = totalSaidas
            };

            return Ok(dto);
        }
    }
}

