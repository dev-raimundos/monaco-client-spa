import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { LaravelResponse } from '@shared/models/api.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notification = inject(NotificationService);
    const authService = inject(AuthService);

    const isSilent = req.headers.has('X-Silent');

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const laravelError =
                typeof error.error === 'object' && error.error !== null
                    ? (error.error as LaravelResponse<unknown>)
                    : null;

            if (error.status === 0) {
                if (!isSilent) {
                    notification.error('Servidor offline ou erro de rede no Grupo Mônaco.');
                }
                return throwError(() => error);
            }

            switch (error.status) {
                case 401:
                    if (!isSilent) {
                        authService.handleUnauthorized();
                        notification.error('Sessão expirada. Por favor, acesse novamente.');
                    }
                    break;

                case 403:
                    notification.error('Acesso negado: você não tem permissão para esta ação.');
                    break;

                case 404:
                    notification.error('Recurso não encontrado.');
                    break;

                case 422:
                    notification.error(laravelError?.message || 'Dados inválidos. Verifique os campos.');
                    break;

                case 429:
                    notification.error('Muitas tentativas. Aguarde alguns instantes e tente novamente.');
                    break;

                case 500:
                case 502:
                case 503:
                    notification.error('Erro interno no servidor. Tente novamente em instantes.');
                    break;

                default:
                    notification.error(laravelError?.message || 'Ocorreu um erro inesperado no sistema Mônaco.');
            }

            return throwError(() => error);
        }),
    );
};
