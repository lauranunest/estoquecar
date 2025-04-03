using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.DTO;
using System.Linq;
using System.Collections.Generic;

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
        public ActionResult<IEnumerable<MovimentoEstoqueDto>> GetMovimentosEstoque()
        {
            var movimentos = _context.MovimentosEstoque.Select(m => new MovimentoEstoqueDto
            {
                Id = m.Id,
                ProdutoId = m.ProdutoId,
                NomeProduto = m.Produto.Nome,
                Quantidade = m.Quantidade,
                TipoMovimento = m.TipoMovimento,
                DataMovimento = m.DataMovimento
            }).ToList();

            return Ok(movimentos);
        }
    }
}
