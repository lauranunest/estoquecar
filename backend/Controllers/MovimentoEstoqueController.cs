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
        public async Task<ActionResult<IEnumerable<MovimentoEstoqueDto>>> GetMovimentosEstoque(
    int page = 1,
    int itensPorPagina = 10,
    string? sortColumn = null,
    string? sortOrder = "asc",
    string? nomeProduto = null,
    string? descricao = null,
    string? tipoMovimento = null,
    string? data = null,
    string? quantidade = null,
    string? precoUnitario = null,
    string? precoTotal = null
)
        {

            var fusoBrasil = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");

            var query = _context.MovimentosEstoque
                .Include(m => m.Produto)
                .AsQueryable();

            // 🔍 Filtros (case-insensitive)
            if (!string.IsNullOrWhiteSpace(nomeProduto))
                query = query.Where(m => EF.Functions.ILike(m.Produto.Nome, $"%{nomeProduto}%"));

            if (!string.IsNullOrWhiteSpace(descricao))
                query = query.Where(m => EF.Functions.ILike(m.Produto.Descricao, $"%{descricao}%"));

            if (!string.IsNullOrWhiteSpace(tipoMovimento))
                query = query.Where(m => EF.Functions.ILike(m.TipoMovimento, $"%{tipoMovimento}%"));

            if (!string.IsNullOrWhiteSpace(quantidade))
                query = query.Where(m => m.Quantidade.ToString().Contains(quantidade));

            // Filtro por preço unitário
            if (!string.IsNullOrWhiteSpace(precoUnitario))
            {
                var precoUnitarioFiltro = precoUnitario.Replace(',', '.');
                if (decimal.TryParse(precoUnitarioFiltro, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var precoU))
                    query = query.Where(m => m.Produto.Preco == precoU);
            }

            // Filtro por preço total
            if (!string.IsNullOrWhiteSpace(precoTotal))
            {
                var precoTotalFiltro = precoTotal.Replace(',', '.');
                if (decimal.TryParse(precoTotalFiltro, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var precoT))
                    query = query.Where(m => (m.Produto.Preco * m.Quantidade) == precoT);
            }

            // 🔁 Ordenação dinâmica
            if (!string.IsNullOrEmpty(sortColumn))
            {
                sortOrder = sortOrder?.ToLower() == "desc" ? "desc" : "asc";

                query = sortColumn.ToLower() switch
                {
                    "nomeproduto" => sortOrder == "asc"
                        ? query.OrderBy(m => m.Produto.Nome)
                        : query.OrderByDescending(m => m.Produto.Nome),

                    "descricao" => sortOrder == "asc"
                        ? query.OrderBy(m => m.Produto.Descricao)
                        : query.OrderByDescending(m => m.Produto.Descricao),

                    "quantidade" => sortOrder == "asc"
                        ? query.OrderBy(m => m.Quantidade)
                        : query.OrderByDescending(m => m.Quantidade),

                    "precounitario" => sortOrder == "asc"
                        ? query.OrderBy(m => m.Produto.Preco)
                        : query.OrderByDescending(m => m.Produto.Preco),

                    "precototal" => sortOrder == "asc"
                        ? query.OrderBy(m => m.Produto.Preco * m.Quantidade)
                        : query.OrderByDescending(m => m.Produto.Preco * m.Quantidade),

                    "tipomovimento" => sortOrder == "asc"
                        ? query.OrderBy(m => m.TipoMovimento)
                        : query.OrderByDescending(m => m.TipoMovimento),

                    "datamovimento" => sortOrder == "asc"
                        ? query.OrderBy(m => m.DataMovimento)
                        : query.OrderByDescending(m => m.DataMovimento),

                    _ => query.OrderByDescending(m => m.DataMovimento)
                };
            }
            else
            {
                query = query.OrderByDescending(m => m.DataMovimento);
            }

            // 🔢 Paginação
            var totalMovimentos = await query.CountAsync();
            var movimentosBrutos = await query
                .Skip((page - 1) * itensPorPagina)
                .Take(itensPorPagina)
                .ToListAsync();

            if (!string.IsNullOrWhiteSpace(data))
            {
                movimentosBrutos = movimentosBrutos
                    .Where(m =>
                    {
                        var dataMov = TimeZoneInfo.ConvertTimeFromUtc(m.DataMovimento, fusoBrasil);
                        var strFull = dataMov.ToString("dd/MM/yyyy HH:mm");
                        var strDate = dataMov.ToString("dd/MM/yyyy");
                        var strDayMonth = dataMov.ToString("dd/MM");
                        var strTime = dataMov.ToString("HH:mm");

                        return strFull.Contains(data) ||
                               strDate.Contains(data) ||
                               strDayMonth.Contains(data) ||
                               strTime.Contains(data);
                    })
                    .ToList();
            }

            var movimentos = movimentosBrutos.Select(m => new MovimentoEstoqueDto
            {
                Id = m.Id,
                ProdutoId = m.ProdutoId,
                NomeProduto = m.Produto.Nome,
                DescricaoProduto = m.Produto.Descricao,
                PrecoUnitario = m.Produto.Preco,
                Quantidade = m.Quantidade,
                TipoMovimento = char.ToUpper(m.TipoMovimento[0]) + m.TipoMovimento.Substring(1).ToLower(),
                DataMovimento = TimeZoneInfo.ConvertTimeFromUtc(m.DataMovimento, fusoBrasil)
                     .ToString("dd/MM/yyyy HH:mm")
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
