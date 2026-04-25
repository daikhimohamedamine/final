import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ROLE_HOMES, User, UserRole } from './auth.types';
import { BackendApiService } from '../core/api/backend-api.service';
import { firstValueFrom } from 'rxjs';

interface DemoAccount extends User {
  password: string;
}

const STORAGE_KEY = 'medzoon.session.v1';
const TOKEN_KEY = 'medzoon.auth.token';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private api = inject(BackendApiService);
  private _user = signal<User | null>(this.loadFromStorage());

  user = this._user.asReadonly();
  isAuthenticated = computed(() => this._user() !== null);
  role = computed<UserRole | null>(() => this._user()?.role ?? null);

  async signIn(email: string, password: string): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
    try {
      const res = await firstValueFrom(this.api.login({ email, password }));
      const user: User = {
        id: email,
        email,
        firstName: res.prenom ?? '',
        lastName: res.nom ?? '',
        role: res.role === 'ADMIN' ? 'admin' : res.role === 'COORDINATRICE' ? 'coordinatrice' : 'doctor',
        title: res.role === 'ADMIN' ? 'Platform Administrator' : res.role === 'COORDINATRICE' ? 'Coordinatrice Santé' : 'Médecin du Travail',
        organization: 'Medzoon',
        avatar: '',
        token: res.accessToken,
      };
      this.setUser(user);
      localStorage.setItem(TOKEN_KEY, res.accessToken);
      return { ok: true, user };
    } catch (err: any) {
      const msg = err?.error?.message || 'Invalid email or password.';
      return { ok: false, error: msg };
    }
  }

  signOut(): void {
    this._user.set(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
    this.router.navigateByUrl('/');
  }

  private setUser(user: User) {
    this._user.set(user);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch { /* ignore */ }
  }

  homeForRole(role: UserRole): string {
    return ROLE_HOMES[role];
  }

  private loadFromStorage(): User | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
