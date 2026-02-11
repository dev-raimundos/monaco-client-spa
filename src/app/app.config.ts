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
import { providePrimeNG } from 'primeng/config';
import { MessageService, ConfirmationService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { httpInterceptor } from '@core/interceptors/http.interceptors';
import { AuthService } from '@core/services/auth.service';
import { NAV_ITEMS_TOKEN } from '@shared/models/navigation.model';
import { SISMONACO_NAVIGATION } from '@core/config/navigation';

export const appConfig: ApplicationConfig = {
    providers: [
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.dark',
                },
            },
        }),
        MessageService,
        ConfirmationService,

        provideZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withFetch(), withInterceptors([httpInterceptor])),
        provideAnimationsAsync(),

        {
            provide: NAV_ITEMS_TOKEN,
            useValue: SISMONACO_NAVIGATION,
        },

        provideAppInitializer(() => {
            const authService = inject(AuthService);
            return firstValueFrom(authService.loadProfile().pipe(catchError(() => of(null))));
        }),
    ],
};
