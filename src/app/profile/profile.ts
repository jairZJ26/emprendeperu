import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { UserService, UserProfile } from '../services/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  photoPreview: string | ArrayBuffer | null = 'assets/default-avatar.png';
  userExists = false;
  userEmail: string | null = null;
  isBrowser = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private auth: Auth,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.profileForm = this.fb.group({
      foto: [''],
      nombre: [{ value: '', disabled: true }, Validators.required],
      apellidos: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      dni: [''],
      edad: [''],
      negocio: this.fb.group({
        nombreNegocio: [''],
        rubro: [''],
        departamento: [''],
        provincia: [''],
        distrito: [''],
        ubigeo: ['']
      }),
      vision: [''],
      mision: ['']
    });
  }

  async ngOnInit(): Promise<void> {
    if (!this.isBrowser) return; // Evita ejecutar en SSR

    const user = this.auth.currentUser;

    if (!user?.email) {
      alert('⚠️ No hay sesión activa. Por favor inicia sesión.');
      this.router.navigate(['/login']);
      return;
    }

    this.userEmail = user.email;

    const storedData = JSON.parse(localStorage.getItem('userData') || '{}');
    const baseData = {
      nombre: storedData.nombre || user.displayName?.split(' ')[0] || '',
      apellidos: storedData.apellidos || user.displayName?.split(' ').slice(1).join(' ') || '',
      email: user.email
    };
    this.profileForm.patchValue(baseData);

    this.loadUserFromMySQL(user.email, baseData);
  }

  private loadUserFromMySQL(email: string, baseData: any): void {
    this.userService.getUserByEmail(email).subscribe({
      next: (data: UserProfile | null) => {
        if (data) {
          this.userExists = true;
          this.profileForm.patchValue({
            ...data,
            nombre: baseData.nombre || data.nombre,
            apellidos: baseData.apellidos || data.apellidos,
            email: data.email
          });
          if (data.foto) this.photoPreview = data.foto;
        }
      },
      error: (err: any) => console.error('❌ Error al cargar datos MySQL:', err)
    });
  }

  onFileSelected(event: Event): void {
    if (!this.isBrowser) return;

    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.profileForm.patchValue({ foto: file.name });

      const reader = new FileReader();
      reader.onload = () => (this.photoPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.isBrowser) return;

    const formData: UserProfile = this.profileForm.getRawValue();

    if (!this.userEmail) {
      alert('❌ No se pudo identificar el usuario.');
      return;
    }

    if (this.profileForm.valid) {
      this.userService.updateUserByEmail(this.userEmail, formData).subscribe({
        next: () => alert('✅ Perfil actualizado correctamente'),
        error: (err) => console.error('❌ Error al actualizar perfil:', err)
      });

      localStorage.setItem('userData', JSON.stringify(formData));
    } else {
      alert('⚠️ Por favor completa los campos obligatorios');
    }
  }

  goToDashboard(): void {
    if (this.isBrowser) this.router.navigate(['/dashboard']);
  }

  async logout() {
    if (!this.isBrowser) return;

    try {
      await signOut(this.auth);
      localStorage.clear();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }
}
