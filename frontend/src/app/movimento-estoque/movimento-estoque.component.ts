import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface MovimentoEstoque {
  id: number;
  produtoId: number;
  nomeProduto: string;
  quantidade: number;
  tipoMovimento: string;
  dataMovimento: string;
}

@Component({
  selector: 'app-movimento-estoque',
  standalone: true,
  templateUrl: './movimento-estoque.component.html',
  styleUrls: ['./movimento-estoque.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class MovimentoEstoqueComponent implements OnInit {
  movimentos: MovimentoEstoque[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMovimentos();
  }

  loadMovimentos() {
    this.http
      .get<MovimentoEstoque[]>('http://localhost:5245/api/movimentoestoque')
      .subscribe((data) => (this.movimentos = data));
  }
}
