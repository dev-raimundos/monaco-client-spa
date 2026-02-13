import { Routes } from '@angular/router';

export const DEMO_ROUTES: Routes = [
    {
        path: 'material-demo',
        loadComponent: () =>
            import('@domains/it/demo/material-demo/material-demo.component').then(
                (m) => m.DemoComponent,
            ),
    },
    { path: '', redirectTo: 'pillars', pathMatch: 'full' },
];
