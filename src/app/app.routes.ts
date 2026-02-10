import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { DashboardComponent } from '@features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: '',
    loadComponent: () =>
      import('@features/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('@features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
