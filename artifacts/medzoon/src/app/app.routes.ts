import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardShellComponent } from './pages/dashboard/shared/dashboard-shell.component';
import { AdminDashboardComponent } from './pages/dashboard/admin/admin-dashboard.component';
import { CoordDashboardComponent } from './pages/dashboard/coordinatrice/coord-dashboard.component';
import { DoctorDashboardComponent } from './pages/dashboard/doctor/doctor-dashboard.component';
import { authGuard, dashboardRedirectGuard, roleGuard } from './auth/auth.guards';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardShellComponent,
    children: [
      { path: '', canActivate: [dashboardRedirectGuard], children: [] },
      { path: 'admin',         canActivate: [roleGuard('admin')],         component: AdminDashboardComponent },
      { path: 'coordinatrice', canActivate: [roleGuard('coordinatrice')], component: CoordDashboardComponent },
      { path: 'doctor',        canActivate: [roleGuard('doctor')],        component: DoctorDashboardComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
