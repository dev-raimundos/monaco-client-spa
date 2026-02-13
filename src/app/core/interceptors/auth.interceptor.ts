import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { LaravelResponse } from '@shared/models/api.model';

/**
 * @description Captura falhas HTTP e centraliza a lógica de feedback e autenticação.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const notification = injector.get(NotificationService);
            const authService = injector.get(AuthService);

            const laravelError = error.error as LaravelResponse<any>;
            let errorMessage = 'Ocorreu um erro inesperado no sistema Mônaco.';

            switch (error.status) {
                case 401:
                    errorMessage = 'Sessão expirada. Por favor, acesse novamente.';
                    authService.handleUnauthorized();
                    break;
                case 403:
                    errorMessage = 'Acesso negado: você não tem permissão para esta ação.';
                    break;
                case 422:
                    errorMessage = laravelError?.message || 'Dados inválidos. Verifique os campos.';
                    break;
                case 0:
                    errorMessage = 'Servidor offline ou erro de rede no Grupo Mônaco.';
                    break;
                default:
                    errorMessage = laravelError?.message || errorMessage;
            }

            notification.error(errorMessage);
            return throwError(() => error);
        }),
    );
};
