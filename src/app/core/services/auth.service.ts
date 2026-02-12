import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs';
import { environment } from '@env';
import { LaravelResponse } from '@shared/models/api.model';
import { LoginResponse, LoginCredentials, UserProfile } from '@shared/models/auth.model';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly BASE_URL = environment.apiUrl;
    private _user = signal<UserProfile | null>(null);
    readonly user = this._user.asReadonly();
    readonly isAuthenticated = computed(() => !!this._user());
    public loadError = signal(false);
    private notification = inject(NotificationService);

    /**
     * Dado o payload de login, recebe o access_token e e redireciona para a rota /dashboard
     * @param credentials
     * @returns Token JWT
     */
    // No seu AuthService
    login(credentials: LoginCredentials): Observable<UserProfile> {
        return this.http
            .post<LaravelResponse<LoginResponse>>(`${this.BASE_URL}/authentication/login`, credentials)
            .pipe(
                switchMap(() => this.loadProfile()),
                tap(() => {this.router.navigate(['/dashboard']);}),
            );
    }
    /**
     * lê o perfil do usuário logado usando o access_token e armazena no estado local.
     * @returns UserProfile
     */
    loadProfile(): Observable<UserProfile> {
        return this.http.get<LaravelResponse<UserProfile>>(`${this.BASE_URL}/user/me`).pipe(
            map((res) => {
                if (!res.data || !res.data.name || !res.data.id) {
                    throw new Error('Contrato da API quebrado: Dados do perfil são inválidos.');
                }

                const safeUser: UserProfile = {
                    ...res.data,
                    avatar: res.data.avatar ?? '',
                    department: res.data.department ?? 'Não definido',
                    occupation: res.data.occupation ?? 'Não Definido',
                    company: res.data.company ?? 'Não Definido',
                };

                this._user.set(safeUser);
                this.loadError.set(false);
                return safeUser;
            }),
            tap((user) => {
                const firstName = user.name.split(' ')[0];
                this.notification.success(`Bem-vindo de volta, ${firstName}!`);
            }),
            catchError((err) => {
                if (err.status === 0) {
                    this.loadError.set(true);
                }
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
