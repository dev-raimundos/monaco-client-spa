import { Routes } from '@angular/router';

export const CLIMATE_SURVEY_ROUTES: Routes = [
    {
        path: 'pillars',
        loadComponent: () =>
            import('@domains/hr/climate-survey/features/pillar-list/pillar-list.component').then(
                (m) => m.PillarListComponent,
            ),
    },
    { path: '', redirectTo: 'pillars', pathMatch: 'full' },
];
