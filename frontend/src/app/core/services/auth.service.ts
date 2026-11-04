import { environment } from '../../../environments/environment';
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { User } from '../models';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'propvest_auth_token';

  currentUser = signal<User | null>(null);
  token = signal<string | null>(this.getStoredToken());

  isAuthenticated = computed(() => !!this.token() && !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {
    if (this.token()) {
      this.fetchMe().subscribe();
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.token.set(token);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.token.set(null);
    this.currentUser.set(null);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setToken(res.data.token);
          this.currentUser.set(res.data.user);
          this.toast.success('Welcome back!', `Signed in as ${res.data.user.name}`);
        }
      })
    );
  }

  register(userData: { name: string; email: string; password: string; phone?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setToken(res.data.token);
          this.currentUser.set(res.data.user);
          this.toast.success('Registration successful!', `Welcome to PropVest, ${res.data.user.name}`);
        }
      })
    );
  }

  fetchMe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.currentUser.set(res.data);
        }
      }),
      catchError(() => {
        this.clearToken();
        return of(null);
      })
    );
  }

  updateProfile(data: { name?: string; phone?: string; avatarUrl?: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, data).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.currentUser.update((user) => (user ? { ...user, ...res.data } : null));
          this.toast.success('Profile updated');
        }
      })
    );
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/change-password`, data).pipe(
      tap((res) => {
        if (res.success) {
          this.toast.success('Password changed successfully');
        }
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  logout(): void {
    this.clearToken();
    this.toast.info('Signed out', 'You have been logged out of your account.');
    this.router.navigate(['/login']);
  }
}

