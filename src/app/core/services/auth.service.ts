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
    private readonly LOGIN_APP_ROUTE = '/auth/login';

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
    login(credentials: LoginCredentials): Observable<UserProfile> {
        return this.http
            .post<
                LaravelResponse<LoginResponse>
            >(`${this.BASE_URL}/authentication/login`, credentials)
            .pipe(
                switchMap(() => this.loadProfile()),
                tap(() => {
                    this.router.navigate(['/dashboard']);
                }),
            );
    }

    loadProfile(): Observable<UserProfile> {
        return this.http.get<LaravelResponse<UserProfile>>(`${this.BASE_URL}/user/me`).pipe(
            map((res) => {
                if (!res.data || !res.data.name || !res.data.id) {
                    throw new Error('Contrato da API quebrado.');
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
            catchError((err) => {
                if (err.status === 0) this.loadError.set(true);
                return throwError(() => err);
            }),
        );
    }

    logout(): void {
        this.handleUnauthorized();

        this.http.post(`${this.BASE_URL}/authentication/logout`, {}).subscribe({
            next: () => console.log('Sessão encerrada no backend.'),
            error: () => console.warn('Aviso: Falha ao invalidar cookie no servidor.'),
        });
    }


    handleUnauthorized(): void {
        this._user.set(null);

        if (this.router.url !== this.LOGIN_APP_ROUTE) {
            this.router.navigateByUrl(this.LOGIN_APP_ROUTE);
        }
    }

    hasPermission(permission: string): boolean {
        return this._user()?.services?.includes(permission) ?? false;
    }
}
