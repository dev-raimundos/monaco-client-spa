import { Routes } from '@angular/router';

export const MAIN_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./calendar-dashboard/calendar-dashboard').then((m) => m.CalendarDashboard),
    },
];
