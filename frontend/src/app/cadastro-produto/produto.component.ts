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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarProdutos();
  }

  // CREATE
  criar(): void {
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
          this.listarProdutos();
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

  buscarPorId(id: number): void {
    this.http
      .get(`https://estoquecar.onrender.com/api/produtos/${id}`)
      .subscribe((res) => {
        this.produtoSelecionado = res;
        this.nome = (res as any).nome;
        this.descricao = (res as any).descricao;
        this.preco = 'R$ ' + (res as any).preco.toFixed(2).replace('.', ',');
      });
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

  selecionarProduto(produto: any): void {
    this.produtoSelecionado = produto;
    this.nome = produto.nome;
    this.descricao = produto.descricao;
    this.preco = 'R$ ' + produto.preco.toFixed(2).replace('.', ',');
  }

  limparFormulario(): void {
    this.produtoSelecionado = null;
    this.nome = '';
    this.descricao = '';
    this.preco = '';
  }
}
