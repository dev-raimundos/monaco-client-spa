import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { LaravelResponse } from '@shared/models/api.model';
import { environment } from '@env';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);

    const trustedDomains = ['localhost:8080', 'monaco-api.grupomonaco.com.br'];

    let url = req.url;
    if (url.startsWith('/api')) {
        url = `${environment.apiUrl}${url.replace('/api', '')}`;
    }

    const isTrustedDomain = trustedDomains.some((domain) => url.includes(domain));

    const secureReq = req.clone({
        url,
        withCredentials: isTrustedDomain,
    });

    return next(secureReq).pipe(
        catchError((error: HttpErrorResponse) => {
            const notification = injector.get(NotificationService);
            const authService = injector.get(AuthService);

            if (!isTrustedDomain) {
                return throwError(() => error);
            }

            const laravelError = error.error as LaravelResponse<any>;
            let errorMessage = 'Ocorreu um erro inesperado no sistema Mônaco.';

            if (laravelError?.message) {
                errorMessage = laravelError.message;
            } else {
                switch (error.status) {
                    case 401:
                        errorMessage = 'Sessão expirada ou inválida.';
                        authService.handleUnauthorized();
                        break;
                    case 403:
                        errorMessage = 'Acesso negado: você não tem permissão.';
                        break;
                    case 422:
                        errorMessage = 'Dados inválidos. Verifique os campos.';
                        break;
                    case 0:
                        errorMessage = 'Servidor offline ou erro de rede.';
                        break;
                }
            }

            notification.error(errorMessage);

            return throwError(() => error);
        }),
    );
};
