import { Routes } from '@angular/router';
import { ClimateSurveyLayoutComponent } from './ui/layout/climate-survey-layout/climate-survey-layout.component';

export const CLIMATE_SURVEY_ROUTES: Routes = [
    {
        path: '',
        component: ClimateSurveyLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
            },
            {
                path: 'pillars',
                loadComponent: () =>
                    import('./features/pillar-list/pillar-list.component').then((m) => m.PillarListComponent),
            },
            {
                path: 'form-builder',
                loadComponent: () =>
                    import('./features/form-builder/form-builder.component').then((m) => m.FormBuilderComponent),
            },
            {
                path: 'answer',
                loadComponent: () =>
                    import('./features/answer/answer.component').then((m) => m.AnswerComponent),
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },
];
