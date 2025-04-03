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
    preco: 0,
    quantidade: 0,
  };

  constructor(private http: HttpClient) {}

  onSubmit() {
    const url = 'http://localhost:5245/api/produtos';
    this.http.post(url, this.produto).subscribe(
      (response) => {
        alert('Produto cadastrado com sucesso!');
        this.produto = { nome: '', descricao: '', preco: 0, quantidade: 0 };
      },
      (error) => {
        alert('Erro ao cadastrar produto.');
      }
    );
  }
}
