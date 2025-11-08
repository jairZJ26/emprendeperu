import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  UserCredential
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';
import { UserService } from '../services/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private userService: UserService // 👈 nuevo: para conectar con MySQL
  ) {}

  // 🔹 Registrar usuario con nombre y apellidos
  async register(nombre: string, apellidos: string, email: string, password: string): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);

    // ✅ Guardar en Firestore
    await setDoc(doc(this.firestore, 'users', cred.user.uid), {
      uid: cred.user.uid,
      nombre,
      apellidos,
      email
    });

    // ✅ Guardar en MySQL también
    this.userService.createUser({ nombre, apellidos, email }).subscribe({
      next: () => console.log('🧩 Usuario guardado en MySQL'),
      error: (err) => console.error('❌ Error guardando usuario en MySQL:', err)
    });

    return cred;
  }

  // 🔹 Login con email y contraseña
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // 🔹 Recuperar contraseña
  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  // 🔹 Login con Google (detecta si es nuevo o existente)
  async loginWithGoogle(): Promise<{ cred: UserCredential; newUser: boolean }> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.auth, provider);

    const userRef = doc(this.firestore, 'users', cred.user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // ✅ Usuario ya registrado
      const data = userSnap.data();
      localStorage.setItem('userData', JSON.stringify({
        nombre: data['nombre'] || cred.user.displayName || '',
        apellidos: data['apellidos'] || '',
        email: data['email'] || cred.user.email
      }));
      return { cred, newUser: false };
    } else {
      // 🆕 Nuevo usuario
      const nombre = cred.user.displayName?.split(' ')[0] || '';
      const apellidos = cred.user.displayName?.split(' ').slice(1).join(' ') || '';
      const email = cred.user.email || '';

      await setDoc(userRef, { uid: cred.user.uid, nombre, apellidos, email });

      // ✅ También guardar en MySQL
      this.userService.createUser({ nombre, apellidos, email }).subscribe({
        next: () => console.log('🧩 Usuario Google guardado en MySQL'),
        error: (err) => console.error('❌ Error guardando Google en MySQL:', err)
      });

      localStorage.setItem('userData', JSON.stringify({ nombre, apellidos, email }));
      return { cred, newUser: true };
    }
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
