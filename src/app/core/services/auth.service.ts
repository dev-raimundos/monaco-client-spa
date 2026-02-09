import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LaravelResponse, LoginResponse, UserProfile } from '../../shared/models/auth.model';
import { Observable, map, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly BASE_URL = 'http://localhost:8080/api';

  private _user = signal<UserProfile | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());

  /**
   * Realiza o login e automaticamente busca o perfil completo
   */
  login(credentials: any): Observable<UserProfile> {
    return this.http
      .post<LaravelResponse<LoginResponse>>(`${this.BASE_URL}/authentication/login`, credentials)
      .pipe(
        switchMap(() => this.loadProfile()),
        tap(() => this.router.navigate(['/dashboard'])),
      );
  }

  /**
   * Busca os dados completos do usuário logado
   */
  loadProfile(): Observable<UserProfile> {
    return this.http.get<LaravelResponse<UserProfile>>(`${this.BASE_URL}/user/me`).pipe(
      tap((res) => this._user.set(res.data)),
      map((res) => res.data),
    );
  }

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  hasPermission(permission: string): boolean {
    const user = this._user();
    return user ? user.services.includes(permission) : false;
  }
}
