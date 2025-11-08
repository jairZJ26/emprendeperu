import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth';
import { GoogleDataDialog } from '../google-data-dialog'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // 🔹 Registro normal (Firebase + MySQL)
  async onRegister(): Promise<void> {
    if (!this.registerForm.valid) {
      this.snack.open('⚠️ Completa todos los campos obligatorios', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const { name, lastname, email, password } = this.registerForm.value;

    try {
      // 1️⃣ Registrar usuario en Firebase
      await this.authService.register(name, lastname, email, password);

      // 2️⃣ Guardar en MySQL (vía backend)
      const userData = { nombre: name, apellidos: lastname, email };
      await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      // 3️⃣ Guardar en localStorage para el perfil
      localStorage.setItem('userData', JSON.stringify(userData));

      // 4️⃣ Mostrar mensaje de éxito
      this.snack.open('✅ Registro exitoso. Ahora inicia sesión.', 'Cerrar', { duration: 4000 });
      setTimeout(() => this.router.navigate(['/login']), 500);
    } catch (err: any) {
      console.error('❌ Error en el registro:', err);
      this.snack.open('❌ Error: ' + err.message, 'Cerrar', { duration: 4000 });
    } finally {
      this.isLoading = false;
    }
  }

  // 🔹 Registro/Login con Google
  async registerWithGoogle(): Promise<void> {
    try {
      const { cred, newUser } = await this.authService.loginWithGoogle();
      const email = cred.user?.email || '';

      if (newUser) {
        const dialogRef = this.dialog.open(GoogleDataDialog, {
          width: '400px',
          data: { email }
        });

        dialogRef.afterClosed().subscribe(async (result) => {
          if (result) {
            const { nombre, apellidos } = result;
            const userData = { nombre, apellidos, email };

            // 🔹 Guarda en MySQL también
            await fetch('http://localhost:3000/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData)
            });

            localStorage.setItem('userData', JSON.stringify(userData));
            this.snack.open('✅ Registro completado 🎉', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/dashboard']);
          } else {
            this.snack.open('⚠️ No se completaron los datos del perfil', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        this.snack.open('✅ Bienvenido nuevamente 🎉', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      }
    } catch (err: any) {
      console.error('❌ Error con Google:', err);
      this.snack.open('❌ Error con Google: ' + err.message, 'Cerrar', { duration: 4000 });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
