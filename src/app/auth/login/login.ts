import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snack: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // 🔹 Iniciar sesión con email y contraseña
  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password)
        .then(() => {
          this.snack.open('✅ Sesión iniciada correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        })
        .catch(err => {
          console.error(err);
          this.snack.open('❌ Error al iniciar sesión: ' + err.message, 'Cerrar', { duration: 4000 });
        });
    }
  }

  // 🔹 Iniciar sesión con Google
  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then(({ newUser }) => {
        if (newUser) {
          this.snack.open('Bienvenido, completa tu perfil 📝', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/profile']);
        } else {
          this.snack.open('✅ Sesión con Google exitosa 🎉', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        }
      })
      .catch(err => {
        console.error(err);
        this.snack.open('❌ Error con Google: ' + err.message, 'Cerrar', { duration: 4000 });
      });
  }

  goToReset() {
    this.router.navigate(['/reset-password']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
