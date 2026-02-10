import {
    ApplicationConfig,
    provideZonelessChangeDetection,
    provideAppInitializer,
    inject,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { routes } from './app.routes';
import { httpInterceptor } from '@core/interceptors/http.interceptors';
import { AuthService } from '@core/services/auth.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withFetch(), withInterceptors([httpInterceptor])),
        provideAnimationsAsync(),
        provideAppInitializer(() => {
            const authService = inject(AuthService);
            return firstValueFrom(authService.loadProfile().pipe(catchError(() => of(null))));
        }),
    ],
};
