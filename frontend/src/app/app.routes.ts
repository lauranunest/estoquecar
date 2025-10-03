import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProdutoComponent } from './cadastro-produto/produto.component';
import { LoginComponent } from './login/login.component';
import { MovimentoEstoqueComponent } from './movimento-estoque/movimento-estoque.component';
import { HeaderLayoutComponent } from './layout/header-layout/header-layout.component';
import { UsuarioComponent } from './usuario/usuario.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: HeaderLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'produto', component: ProdutoComponent },
      { path: 'movimento-estoque', component: MovimentoEstoqueComponent },
      { path: 'usuario', component: UsuarioComponent },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
