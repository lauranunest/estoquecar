import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CadastroProdutoComponent } from './cadastro-produto/cadastro-produto.component';
import { LoginComponent } from './login/login.component';
import { MovimentoEstoqueComponent } from './movimento-estoque/movimento-estoque.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cadastro-produto', component: CadastroProdutoComponent },
  { path: 'movimento-estoque', component: MovimentoEstoqueComponent },
];
