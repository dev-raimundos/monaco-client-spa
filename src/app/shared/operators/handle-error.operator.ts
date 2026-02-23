import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, catchError } from 'rxjs';
import { isDevMode } from '@angular/core';
import { LaravelResponse } from '@shared/models/api.model';

export interface HandleHttpErrorOptions {
    /** Mensagem exibida caso o back-end não retorne uma. Default: 'Ocorreu um erro inesperado.' */
    fallback?: string;
    /** Duração do snackbar em ms. Default: 4000 */
    duration?: number;
    /** Callback executado após o erro — ideal para resetar loading signals. */
    onError?: () => void;
}

/**
 * Operador RxJS reutilizável para tratamento padronizado de erros HTTP.
 *
 * Exibe a mensagem do contrato Laravel (`response.error.message`) no snackbar,
 * executa o callback opcional e encerra o fluxo com EMPTY.
 *
 * @example
 * this.service.create(payload).pipe(
 *   handleHttpError(this.snackBar, {
 *     fallback: 'Erro ao salvar o formulário.',
 *     onError: () => this.loading.set(false),
 *   })
 * ).subscribe({ ... })
 */
export function handleHttpError(snackBar: MatSnackBar, options: HandleHttpErrorOptions = {}) {
    const { fallback = 'Ocorreu um erro inesperado.', duration = 4000, onError } = options;

    return <T>(source: Observable<T>): Observable<T> =>
        source.pipe(
            catchError((err: HttpErrorResponse) => {
                const body = err.error as LaravelResponse<unknown> | null;
                const message = body?.message ?? fallback;

                if (isDevMode()) {
                    console.error('[handleHttpError]', {
                        status: err.status,
                        message,
                        url: err.url,
                        body,
                    });
                }

                snackBar.open(message, 'Fechar', { duration });

                onError?.();

                return EMPTY;
            }),
        );
}
