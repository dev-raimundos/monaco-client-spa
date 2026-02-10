import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, switchMap, tap } from 'rxjs';
import { environment } from '@env';
import { LoginResponse, UserProfile, LoginCredentials } from '@shared/models';
import { LaravelResponse } from '@core/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly BASE_URL = environment.apiUrl;
  private _user = signal<UserProfile | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());

  login(credentials: LoginCredentials): Observable<UserProfile> {
    return this.http
      .post<LaravelResponse<LoginResponse>>(`${this.BASE_URL}/authentication/login`, credentials)
      .pipe(
        switchMap(() => this.loadProfile()),
        tap(() => this.router.navigate(['/dashboard'])),
      );
  }

  loadProfile(): Observable<UserProfile> {
    return this.http.get<LaravelResponse<UserProfile>>(`${this.BASE_URL}/user/me`).pipe(
      map((res: LaravelResponse<UserProfile>) => res.data),
      tap((user: UserProfile) => this._user.set(user)),
    );
  }

  hasPermission(permission: string): boolean {
    const user = this._user();
    return user ? user.services.includes(permission) : false;
  }
}
