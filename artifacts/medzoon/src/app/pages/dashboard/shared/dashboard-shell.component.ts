import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ROLE_LABELS, UserRole } from '../../../auth/auth.types';
import { IconComponent, IconName } from '../../../shared/icon.component';

interface NavItem {
  label: string;
  route: string;
  icon: IconName;
}

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss',
})
export class DashboardShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  ROLE_LABELS = ROLE_LABELS;
  user = this.auth.user;
  menuOpen = signal(false);
  sidebarOpen = signal(false);

  navItems = computed<NavItem[]>(() => {
    const role = this.user()?.role;
    if (!role) return [];
    return NAV_BY_ROLE[role];
  });

  toggleMenu() { this.menuOpen.update((v) => !v); }
  closeMenu()  { this.menuOpen.set(false); }
  toggleSidebar() { this.sidebarOpen.update((v) => !v); }
  closeSidebar()  { this.sidebarOpen.set(false); }

  signOut() {
    this.closeMenu();
    this.auth.signOut();
  }
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Overview',     route: '/dashboard/admin',          icon: 'chart' },
    { label: 'Users & Roles',route: '/dashboard/admin/users',    icon: 'users' },
    { label: 'Audit Log',    route: '/dashboard/admin/audit',    icon: 'document' },
    { label: 'Settings',     route: '/dashboard/admin/settings', icon: 'sparkles' },
  ],
  coordinatrice: [
    { label: 'Overview',     route: '/dashboard/coordinatrice',           icon: 'chart' },
    { label: 'Employees',    route: '/dashboard/coordinatrice/employees', icon: 'users' },
    { label: 'Schedule',     route: '/dashboard/coordinatrice/schedule',  icon: 'calendar' },
    { label: 'Reminders',    route: '/dashboard/coordinatrice/reminders', icon: 'bell' },
  ],
  doctor: [
    { label: 'Today',        route: '/dashboard/doctor',           icon: 'stethoscope' },
    { label: 'My Patients',  route: '/dashboard/doctor/patients',  icon: 'users' },
    { label: 'Consultations',route: '/dashboard/doctor/consults',  icon: 'document' },
    { label: 'Vaccinations', route: '/dashboard/doctor/vaccines',  icon: 'syringe' },
  ],
};
