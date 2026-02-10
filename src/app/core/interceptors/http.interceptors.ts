import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { LaravelResponse } from '@shared/models';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const authService = inject(AuthService);
  const secureReq = req.clone({ withCredentials: true });

  return next(secureReq).pipe(
    catchError((error: HttpErrorResponse) => {
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
            // Erros de validação do Laravel (ex: senha incorreta)
            errorMessage = laravelError?.message || 'Dados inválidos.';
            break;
          case 0:
            errorMessage = 'Servidor offline. Verifique a API no porto 8080/8000.';
            break;
        }
      }

      notification.error(errorMessage);
      return throwError(() => error);
    }),
  );
};
