import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movimento-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './movimento-estoque.component.html',
  styleUrls: ['./movimento-estoque.component.scss'],
})
export class MovimentoEstoqueComponent implements OnInit {
  produtos: any[] = [];
  movimentos: any[] = [];
  novoMovimento = {
    produtoId: '',
    tipoMovimento: '',
    quantidade: null,
  };
  descricaoAberta = false;
  descricaoSelecionada: string | null = null;

  paginaAtual: number = 1;
  totalPaginas: number = 1;
  itensPorPagina: number = 5;
  paginasVisiveis: number[] = [];

  filtros = {
    nomeProduto: '',
    descricao: '',
    tipoMovimento: '',
    data: '',
    quantidade: '',
    precoUnitario: '',
    precoTotal: '',
  };

  sortColumn: string = '';
  sortOrder: string = 'asc';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarMovimentos();
  }

  carregarProdutos() {
    this.http
      .get<any[]>('https://estoquecar.onrender.com/api/produtos')
      .subscribe((data) => (this.produtos = data));
  }

  aplicarFiltros() {
    this.paginaAtual = 1;
    this.carregarMovimentos();
  }

  ordenarPor(coluna: string) {
    if (this.sortColumn === coluna) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = coluna;
      this.sortOrder = 'asc';
    }
    this.carregarMovimentos();
  }

  carregarMovimentos() {
    const params = new URLSearchParams({
      page: this.paginaAtual.toString(),
      itensPorPagina: this.itensPorPagina.toString(),
      sortColumn: this.sortColumn,
      sortOrder: this.sortOrder,
      nomeProduto: this.filtros.nomeProduto,
      descricao: this.filtros.descricao,
      tipoMovimento: this.filtros.tipoMovimento,
      data: this.filtros.data,
      quantidade: this.filtros.quantidade,
      precoUnitario: this.filtros.precoUnitario,
      precoTotal: this.filtros.precoTotal,
    });

    this.http
      .get<any>(
        `https://estoquecar.onrender.com/api/movimentoestoque?${params.toString()}`
      )
      .subscribe((data) => {
        this.movimentos = data.data;
        this.totalPaginas = data.totalPages;
        this.atualizarPaginas();
      });
  }

  registrarMovimento() {
    if (
      !this.novoMovimento.produtoId ||
      !this.novoMovimento.quantidade ||
      this.novoMovimento.quantidade < 1 ||
      !this.novoMovimento.tipoMovimento
    ) {
      alert(
        'Preencha todos os campos corretamente. A quantidade deve ser maior que 0.'
      );
      return;
    }

    this.http
      .post(
        'https://estoquecar.onrender.com/api/movimentoestoque',
        this.novoMovimento
      )
      .subscribe({
        next: () => {
          this.carregarMovimentos();
          this.novoMovimento = {
            produtoId: '',
            tipoMovimento: '',
            quantidade: null,
          };
        },
        error: (error) => alert(error.error),
      });
  }

  alterarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      this.carregarMovimentos();
    }
  }

  atualizarPaginas() {
    const paginas: number[] = [];
    const inicio = Math.max(1, this.paginaAtual - 1);
    const fim = Math.min(this.totalPaginas, this.paginaAtual + 1);

    for (let i = inicio; i <= fim; i++) paginas.push(i);
    if (fim < this.totalPaginas) {
      paginas.push(-1);
      paginas.push(this.totalPaginas);
    }
    if (inicio > 2) {
      paginas.unshift(-1);
      paginas.unshift(1);
    } else if (inicio === 2) paginas.unshift(1);

    this.paginasVisiveis = paginas;
  }

  abrirDescricao(descricao: string) {
    this.descricaoSelecionada = descricao;
    this.descricaoAberta = true;
  }

  fecharDescricao() {
    this.descricaoAberta = false;
    this.descricaoSelecionada = '';
  }

  formatarPreco(valor: number): string {
    return valor.toFixed(2).replace('.', ',');
  }
}
