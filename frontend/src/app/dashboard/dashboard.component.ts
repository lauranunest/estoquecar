import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CountUpModule],
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  filtro = {
    inicio: '',
    fim: '',
  };

  resumo: any;

  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo(): void {
    let params: any = {};

    if (this.filtro.inicio) params.inicio = this.filtro.inicio;
    if (this.filtro.fim) params.fim = this.filtro.fim;

    this.http
      .get<any>(
        'https://estoquecar.onrender.com/api/usuario/api/dashboard/resumo-completo',
        {
          params,
        }
      )
      .subscribe((data) => {
        this.resumo = data;
      });
  }

  limparFiltro(): void {
    this.filtro = { inicio: '', fim: '' };
    this.carregarResumo();
  }
}
