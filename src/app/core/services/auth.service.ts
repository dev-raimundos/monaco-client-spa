import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs';
import { environment } from '@env';
import { UserProfile, LoginCredentials, LaravelResponse, LoginResponse } from '@shared/models';

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
            .post<
                LaravelResponse<LoginResponse>
            >(`${this.BASE_URL}/authentication/login`, credentials)
            .pipe(
                switchMap(() => this.loadProfile()),
                tap(() => this.router.navigate(['/dashboard'])),
            );
    }

    /**
     * Carrega os dados do usuário logado via Cookie.
     * Útil para o login e para o APP_INITIALIZER.
     */
    loadProfile(): Observable<UserProfile> {
        return this.http.get<LaravelResponse<UserProfile>>(`${this.BASE_URL}/user/me`).pipe(
            map((res) => {

                if (!res.data) throw new Error('Dados do perfil ausentes.');
                this._user.set(res.data);
                return res.data;
            }),
            catchError((err) => {
                this._user.set(null);
                return throwError(() => err);
            }),
        );
    }

    /**
     * Limpa o estado local e chama o backend para invalidar o cookie.
     */
    logout(): void {
        this.http.post(`${this.BASE_URL}/authentication/logout`, {}).subscribe({
            next: () => this.handleUnauthorized(),
            error: () => this.handleUnauthorized(),
        });
    }

    /**
     * Reseta o estado do app sem necessariamente chamar a API.
     */
    handleUnauthorized(): void {
        this._user.set(null);
        if (this.router.url !== '/login') {
            this.router.navigate(['/login']);
        }
    }

    hasPermission(permission: string): boolean {
        return this._user()?.services?.includes(permission) ?? false;
    }
}
