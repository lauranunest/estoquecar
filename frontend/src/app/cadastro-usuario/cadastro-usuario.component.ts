import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.scss'],
})
export class CadastroUsuarioComponent {
  nome: string = '';
  email: string = '';
  username: string = '';
  senha: string = '';
  mensagem: string = '';

  nomeInvalido: boolean = false;
  emailInvalido: boolean = false;

  constructor(private http: HttpClient) {}

  validarNome(): void {
    this.nomeInvalido = /\d/.test(this.nome);
  }

  validarEmail(): void {
    this.emailInvalido = !this.email.includes('@');
  }

  cadastrar(): void {
    const usuario = {
      nome: this.nome,
      email: this.email,
      username: this.username,
      senha: this.senha,
    };

    this.http
      .post('http://localhost:5245/api/cadastrousuario', usuario)
      .subscribe(
        (res: any) => {
          this.mensagem = res.mensagem;
        },
        (erro) => {
          this.mensagem = erro.error?.mensagem || 'Erro ao cadastrar usuário.';
          console.error(erro);
        }
      );
  }
}
