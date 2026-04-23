import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ROLE_HOMES, User, UserRole } from './auth.types';

interface DemoAccount extends User {
  password: string;
}

const STORAGE_KEY = 'medzoon.session.v1';

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'u-admin',
    email: 'admin@medzoon.health',
    password: 'demo123',
    firstName: 'Margaux',
    lastName: 'Laurent',
    role: 'admin',
    title: 'Platform Administrator',
    organization: 'GroupeIndus SA',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u-coord',
    email: 'coord@medzoon.health',
    password: 'demo123',
    firstName: 'Léa',
    lastName: 'Bernard',
    role: 'coordinatrice',
    title: 'Coordinatrice Santé',
    organization: 'GroupeIndus SA',
    avatar: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u-doctor',
    email: 'doctor@medzoon.health',
    password: 'demo123',
    firstName: 'Camille',
    lastName: 'Dubois',
    role: 'doctor',
    title: 'Médecin du Travail',
    organization: 'GroupeIndus SA',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80',
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private _user = signal<User | null>(this.loadFromStorage());

  user = this._user.asReadonly();
  isAuthenticated = computed(() => this._user() !== null);
  role = computed<UserRole | null>(() => this._user()?.role ?? null);

  demoAccounts(): Pick<DemoAccount, 'email' | 'password' | 'role' | 'firstName' | 'lastName' | 'title'>[] {
    return DEMO_ACCOUNTS.map(({ password, ...rest }) => ({ ...rest, password }));
  }

  signIn(email: string, password: string): { ok: true; user: User } | { ok: false; error: string } {
    const acct = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
    );
    if (!acct) return { ok: false, error: 'Invalid email or password.' };
    const { password: _pw, ...user } = acct;
    this.setUser(user);
    return { ok: true, user };
  }

  signOut(): void {
    this._user.set(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
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
