import { Routes } from '@angular/router';

export const CLIMATE_SURVEY_ROUTES: Routes = [
    {
        path: 'pilares',
        loadComponent: () =>
            import('./features/pillar-list/pillar-list.component').then(
                (m) => m.PillarListComponent,
            ),
    },
    // Aqui você adicionará as rotas de 'answers', 'forms', etc futuramente.
    { path: '', redirectTo: 'pilares', pathMatch: 'full' },
];
