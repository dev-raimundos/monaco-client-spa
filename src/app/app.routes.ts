import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
    /**
     * ROTAS PÚBLICAS
     */
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },

    /**
     * ROTAS PRIVADAS
     */
    {
        path: '',
        loadComponent: () =>
            import('@shared/layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
        canActivate: [authGuard], // Barreira de segurança
        children: [
            // Main
            {
                path: '',
                loadChildren: () => import('@features/main/main.routes').then((m) => m.MAIN_ROUTES),
            },
            // Pesquisa de Clima
            {
                path: 'rh/pesquisa-clima',
                loadChildren: () =>
                    import('@features/hr/climate-survey/cimate-survey.routes').then(
                        (m) => m.CLIMATE_SURVEY_ROUTES,
                    ),
            },
            // Redirecionamento padrão para rota interna
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },

    /**
     * FALLBACK
     * Captura qualquer URL inválida e redireciona para o login.
     */
    {
        path: '**',
        redirectTo: 'auth/login',
    },
];
