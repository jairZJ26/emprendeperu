import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../auth'; // 👈 Importamos AuthService

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snack: MatSnackBar,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // 🔹 Enviar correo de restablecimiento
  onReset() {
    if (this.resetForm.valid) {
      const { email } = this.resetForm.value;

      this.authService.resetPassword(email)
        .then(() => {
          this.snack.open('📩 Se envió un correo para restablecer tu contraseña ✅', 'Cerrar', { duration: 4000 });
          this.router.navigate(['/login']);
        })
        
        .catch(err => {
          console.error(err);
          this.snack.open('❌ Error: ' + err.message, 'Cerrar', { duration: 4000 });
        });
    }
  }

  // 🔹 Ir al login (para el link del HTML)
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
