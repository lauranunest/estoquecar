import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    const loginData = {
      username: this.username,
      password: this.password,
    };

    this.http.post('https://localhost:7024/api/Login', loginData).subscribe(
      (response: any) => {
        console.log('Resposta do login:', response);
        this.successMessage = 'Login bem-sucedido!';
        this.errorMessage = '';
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.errorMessage =
          'Erro ao fazer login. Verifique o usuário e a senha.';
        this.successMessage = '';
        console.error(error);
      }
    );
  }
}
