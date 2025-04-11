import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, formatCurrency } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CadastroProdutoComponent {
  produto = {
    nome: '',
    descricao: '',
    preco: '',
  };

  constructor(private http: HttpClient) {}

  formatarPreco() {
    let valor = this.produto.preco.replace(/\D/g, '');

    let centavos = (parseInt(valor, 10) / 100).toFixed(2);

    this.produto.preco = 'R$ ' + centavos.replace('.', ',');
  }

  permitirSomenteNumeros(event: KeyboardEvent) {
    const tecla = event.key;

    if (!/^\d$/.test(tecla)) {
      event.preventDefault();
    }
  }

  onSubmit() {
    const precoNumerico = parseFloat(
      this.produto.preco
        .replace('R$', '')
        .replace('.', '')
        .replace(',', '.')
        .trim()
    );

    if (isNaN(precoNumerico) || precoNumerico <= 1) {
      alert('O preço deve ser maior que R$1,00');
      return;
    }

    const produtoParaSalvar = {
      nome: this.produto.nome,
      descricao: this.produto.descricao,
      preco: precoNumerico,
    };

    this.http
      .post('http://localhost:5245/api/produtos', produtoParaSalvar)
      .subscribe({
        next: () => {
          alert('Produto cadastrado com sucesso!');
          this.produto = { nome: '', descricao: '', preco: '' };
        },
        error: (err) => {
          alert('Erro ao cadastrar produto: ' + err.message);
        },
      });
  }
}
