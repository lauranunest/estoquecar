// usuario.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = [];
  usuarioSelecionado: any = null;

  nome: string = '';
  email: string = '';
  username: string = '';
  senha: string = '';
  mensagem: string = '';

  nomeInvalido: boolean = false;
  emailInvalido: boolean = false;
  usuariosFiltrados: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listarUsuarios();
  }

  validarNome(): void {
    this.nomeInvalido = /\d/.test(this.nome);
  }

  validarEmail(): void {
    this.emailInvalido = !this.email.includes('@');
  }

  // CREATE
  criar(): void {
    const usuario = {
      nome: this.nome,
      email: this.email,
      username: this.username,
      senha: this.senha,
    };
    this.http
      .post('https://estoquecar.onrender.com/api/usuario', usuario)
      .subscribe(
        (res: any) => {
          this.mensagem = res.mensagem;
          this.listarUsuarios();
        },
        (erro) =>
          (this.mensagem = erro.error?.mensagem || 'Erro ao cadastrar usuário.')
      );
  }

  // READ
  listarUsuarios(): void {
    this.http
      .get<any[]>('https://estoquecar.onrender.com/api/usuario')
      .subscribe((res) => {
        this.usuarios = res;
      });
  }

  buscarPorNome(nome: string): void {
    if (!nome) {
      this.usuariosFiltrados = [];
      return;
    }

    // Faz requisição GET para o backend passando o nome como query
    this.http
      .get<any[]>(`https://estoquecar.onrender.com/api/usuario?nome=${nome}`)
      .subscribe(
        (res) => {
          this.usuariosFiltrados = res;
        },
        (erro) => {
          console.error('Erro ao buscar usuários', erro);
          this.usuariosFiltrados = [];
        }
      );
  }

  // Quando o usuário clica em um resultado
  selecionarUsuario(usuario: any): void {
    this.usuarioSelecionado = usuario;
    this.nome = usuario.name;
    this.email = usuario.email;
    this.username = usuario.username;
    this.senha = usuario.password; // ou deixar em branco se não quiser mostrar
    this.usuariosFiltrados = [];
  }

  buscar(id: number): void {
    this.http
      .get(`https://estoquecar.onrender.com/api/usuario/${id}`)
      .subscribe((res) => {
        this.usuarioSelecionado = res;
      });
  }

  // UPDATE
  atualizar(id: number): void {
    const usuario = {
      nome: this.nome,
      email: this.email,
      username: this.username,
      senha: this.senha,
    };
    this.http
      .put(`https://estoquecar.onrender.com/api/usuario/${id}`, usuario)
      .subscribe((res: any) => {
        this.mensagem = res.mensagem;
        this.listarUsuarios();
      });
  }

  // DELETE
  deletar(id: number): void {
    this.http
      .delete(`https://estoquecar.onrender.com/api/usuario/${id}`)
      .subscribe((res: any) => {
        this.mensagem = res.mensagem;
        this.listarUsuarios();
      });
  }
}
