import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  id?: number;
  uid?: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  dni?: string;
  edad?: string;
  foto?: string;
  negocio?: {
    nombreNegocio?: string;
    rubro?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    ubigeo?: string;
  };
  vision?: string;
  mision?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.BACKEND_URL}/api/users`;

  constructor(private http: HttpClient) {}

  // 🔹 Obtener usuario por ID
  getUser(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Obtener usuario por email
  getUserByEmail(email: string): Observable<UserProfile | null> {
    return this.http.get<UserProfile | null>(`${this.apiUrl}/email/${email}`);
  }

  // 🔹 Crear usuario nuevo
  createUser(user: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, user);
  }

  // 🔹 Actualizar usuario por ID
  updateUser(id: number, user: UserProfile): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  // 🔹 Actualizar usuario por email
  updateUserByEmail(email: string, user: UserProfile): Observable<any> {
    return this.http.put(`${this.apiUrl}/email/${email}`, user);
  }
}
