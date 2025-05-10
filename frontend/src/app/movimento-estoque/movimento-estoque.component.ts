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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarMovimentos();
  }

  carregarProdutos() {
    this.http
      .get<any[]>('http://localhost:5245/api/produtos')
      .subscribe((data) => {
        this.produtos = data;
      });
  }

  carregarMovimentos() {
    this.http
      .get<any[]>(
        `http://localhost:5245/api/movimentoestoque?page=${this.paginaAtual}&itensPorPagina=${this.itensPorPagina}`
      )
      .subscribe((data: any) => {
        this.movimentos = data.data.map((movimento: any) => {
          movimento.dataMovimento = this.formatarDataMovimento(
            movimento.dataMovimento
          );
          return movimento;
        });
        this.totalPaginas = data.totalPages;
      });
  }

  registrarMovimento() {
    if (
      !this.novoMovimento.produtoId ||
      Number(this.novoMovimento.produtoId) <= 0 ||
      !this.novoMovimento.quantidade ||
      this.novoMovimento.quantidade < 1 ||
      !this.novoMovimento.tipoMovimento
    ) {
      alert(
        'Preencha todos os campos corretamente. A quantidade deve ser maior que 0.'
      );
      return;
    }

    const movimentoParaRegistrar = {
      produtoId: this.novoMovimento.produtoId,
      quantidade: this.novoMovimento.quantidade,
      tipoMovimento: this.novoMovimento.tipoMovimento,
    };

    this.http
      .post(
        'http://localhost:5245/api/movimentoestoque',
        movimentoParaRegistrar
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
        error: (error) => {
          alert(error.error);
        },
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

    const mostrarPaginas = 3;
    const inicio = Math.max(1, this.paginaAtual - 1);
    const fim = Math.min(this.totalPaginas, this.paginaAtual + 1);

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    if (fim < this.totalPaginas) {
      paginas.push(-1);
      paginas.push(this.totalPaginas);
    }

    if (inicio > 2) {
      paginas.unshift(-1);
      paginas.unshift(1);
    } else if (inicio === 2) {
      paginas.unshift(1);
    }

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

  formatarDataMovimento(data: string): string {
    const [mes, dia, ano, hora, minuto] = data.split(/[\/ :]/);

    return ` ${mes}/${dia}/${ano} ${hora}:${minuto}`;
  }
}
