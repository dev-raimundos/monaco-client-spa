import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { LaravelResponse } from '@shared/models';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  const secureReq = req.clone({ withCredentials: true });

  return next(secureReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const laravelError = error.error as LaravelResponse;

      let errorMessage = 'Ocorreu um erro inesperado';

      if (laravelError && laravelError.message) {
        errorMessage = laravelError.message;
      } else {
        switch (error.status) {
          case 401:
            errorMessage = 'Sessão expirada. Faça login novamente.';
            break;
          case 403:
            errorMessage = 'Você não tem permissão para realizar esta ação.';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado no servidor.';
            break;
          case 0:
            errorMessage = 'Não foi possível conectar ao servidor. Verifique sua internet.';
            break;
        }
      }

      notification.error(errorMessage);

      return throwError(() => error);
    }),
  );
};
