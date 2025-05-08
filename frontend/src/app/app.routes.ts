import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CadastroProdutoComponent } from './cadastro-produto/cadastro-produto.component';
import { LoginComponent } from './login/login.component';
import { MovimentoEstoqueComponent } from './movimento-estoque/movimento-estoque.component';
import { HeaderLayoutComponent } from './layout/header-layout/header-layout.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: HeaderLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'cadastro-produto', component: CadastroProdutoComponent },
      { path: 'movimento-estoque', component: MovimentoEstoqueComponent },
      { path: 'cadastro-usuario', component: CadastroUsuarioComponent },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
