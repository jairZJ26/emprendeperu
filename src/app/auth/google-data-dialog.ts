import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-google-data-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Completa tu perfil</h2>
    <form [formGroup]="form" (ngSubmit)="onSave()" style="padding: 10px;">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre" type="text" placeholder="Tu nombre">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Apellidos</mat-label>
        <input matInput formControlName="apellidos" type="text" placeholder="Tus apellidos">
      </mat-form-field>

      <div mat-dialog-actions align="end">
        <button mat-stroked-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 12px; }
    h2 { text-align: center; }
  `]
})
export class GoogleDataDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GoogleDataDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
