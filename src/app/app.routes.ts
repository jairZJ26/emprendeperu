import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { ResetPasswordComponent } from './auth/reset-password/reset-password';
import { DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile').then(m => m.ProfileComponent)
  },

  // 🧩 Nueva ruta para el chatbot
  {
    path: 'chatbot',
    loadComponent: () =>
      import('./chatbot/chatbot').then(m => m.ChatbotComponent)
  },

  { path: '**', redirectTo: 'login' }
];
