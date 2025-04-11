import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
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
      .get<any[]>('http://localhost:5245/api/movimentoestoque')
      .subscribe((data) => {
        this.movimentos = data;
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
}
