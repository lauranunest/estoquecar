import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss'],
})
export class ProdutoComponent implements OnInit {
  produtos: any[] = [];
  produtoSelecionado: any = null;

  nome: string = '';
  descricao: string = '';
  preco: string = '';
  mensagem: string = '';
  nomeBusca: string = '';
  produtosFiltrados: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarProdutos();
  }

  formatarMoeda(event: any) {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, '');
    valor = (Number(valor) / 100).toFixed(2);
    valor = valor.replace('.', ',');
    event.target.value = 'R$ ' + valor;
    this.preco = event.target.value;
  }

  // CREATE
  criar(): void {
    console.log(this.preco);
    const precoNumerico = parseFloat(
      this.preco.replace('R$', '').replace('.', '').replace(',', '.').trim()
    );

    if (isNaN(precoNumerico) || precoNumerico <= 1) {
      alert('O preço deve ser maior que R$1,00');
      return;
    }

    const produto = {
      nome: this.nome,
      descricao: this.descricao,
      preco: precoNumerico,
    };

    this.http
      .post('https://estoquecar.onrender.com/api/produtos', produto)
      .subscribe({
        next: (res: any) => {
          this.mensagem = res.mensagem;
          this.limparFormulario();
        },
        error: (err) =>
          (this.mensagem = err.error?.mensagem || 'Erro ao cadastrar produto.'),
      });
  }

  // READ
  listarProdutos(): void {
    this.http
      .get<any[]>('https://estoquecar.onrender.com/api/produtos')
      .subscribe((res) => {
        this.produtos = res;
      });
  }

  buscarPorNome(nome: string) {
    console.log('preco' + this.preco);
    console.log('descricao' + this.descricao);
    console.log('nome' + this.nome);
    this.nomeBusca = nome;

    if (!nome) {
      this.produtosFiltrados = [];
      this.produtoSelecionado = null;
      return;
    }

    this.http
      .get<any[]>(
        `https://estoquecar.onrender.com/api/produtos/buscar?nome=${nome}`
      )
      .subscribe({
        next: (res) => {
          this.produtosFiltrados = res;
          this.produtoSelecionado = null;

          const produtoExato = res.find((p) => p.nome === nome);
          if (produtoExato) {
            this.selecionarProduto(produtoExato);
          } else {
            this.produtoSelecionado = null;
          }
        },
        error: (err) => {
          this.produtosFiltrados = [];
          this.produtoSelecionado = null;
        },
      });
  }

  selecionarProduto(produto: any) {
    this.produtoSelecionado = produto;
    this.nome = produto.nome;
    this.descricao = produto.descricao;
    this.preco = 'R$ ' + produto.preco.toFixed(2).replace('.', ',');
    this.produtosFiltrados = []; // fecha a dropdown
  }

  // UPDATE
  atualizar(id: number): void {
    const precoNumerico = parseFloat(
      this.preco.replace('R$', '').replace('.', '').replace(',', '.')
    );
    const produto = {
      nome: this.nome,
      descricao: this.descricao,
      preco: precoNumerico,
    };

    this.http
      .put(`https://estoquecar.onrender.com/api/produtos/${id}`, produto)
      .subscribe({
        next: (res: any) => {
          this.mensagem = res.mensagem;
          this.limparFormulario();
          this.listarProdutos();
        },
        error: (err) =>
          (this.mensagem = err.error?.mensagem || 'Erro ao atualizar produto.'),
      });
  }

  // DELETE
  deletar(id: number): void {
    this.http
      .delete(`https://estoquecar.onrender.com/api/produtos/${id}`)
      .subscribe({
        next: (res: any) => {
          this.mensagem = res.mensagem;
          this.limparFormulario();
          this.listarProdutos();
        },
        error: (err) =>
          (this.mensagem = err.error?.mensagem || 'Erro ao deletar produto.'),
      });
  }

  limparFormulario(): void {
    this.produtoSelecionado = null;
    this.nome = '';
    this.descricao = '';
    this.preco = '';
  }
}
