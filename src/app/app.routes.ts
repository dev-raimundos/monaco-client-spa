import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
    /**
     * ROTAS PÚBLICAS
     */
    {
        path: 'auth',
        loadChildren: () =>
            import('@domains/auth/auth.routes')
                .then(
                    (m) => m.AUTH_ROUTES
                ),
    },

    /**
     * ROTAS PRIVADAS
     */
    {
        path: '',
        loadComponent: () =>
            import('@shared/layout/main-layout/main-layout.component').then(
                (m) => m.MainLayoutComponent,
            ),
        canActivate: [authGuard], // Barreira de segurança
        children: [
            // Calendário
            {
                path: '',
                loadChildren: () =>
                    import('@domains/main/main.routes').then(
                        (m) => m.MAIN_ROUTES
                    ),
            },
            // Pesquisa de Clima
            {
                path: 'hr/climate-survey',
                loadChildren: () =>
                    import('@domains/hr/climate-survey/climate-survey.routes').then(
                        (m) => m.CLIMATE_SURVEY_ROUTES,
                    ),
            },
            // Demos
            {
                path: 'it/demo',
                loadChildren: () =>
                    import('@domains/it/demo/demo.routes').then(
                        (m) => m.DEMO_ROUTES,
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
        redirectTo: 'dashboard',
    },
];
