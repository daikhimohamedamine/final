import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { IconComponent } from '../../../shared/icon.component';
import { BackendApiService } from '../../../core/api/backend-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['../shared/dash-ui.scss', './admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  user = inject(AuthService).user;
  private router = inject(Router);
  private api = inject(BackendApiService);
  usersList = signal<any[]>([]);
  auditList = signal<any[]>([]);

  kpis = [
    { label: 'Active Users',     value: '...',   delta: 'Loading',  up: true,  icon: 'users' as const },
    { label: 'Records Stored',   value: '...',   delta: 'Loading',  icon: 'document' as const },
    { label: 'Open Audit Items', value: '...',   delta: 'Loading',  up: true,  icon: 'shield' as const },
    { label: 'Storage Used',     value: '...',   delta: 'Loading',  up: false, icon: 'chart' as const },
  ];

  constructor() {
    this.load();
  }

  async load() {
    try {
      const [users, logs] = await Promise.all([
        firstValueFrom(this.api.adminUsers()),
        firstValueFrom(this.api.adminAuditLogs())
      ]);
      this.usersList.set(users.map((u: any) => ({
        name: `${u.prenom} ${u.nom}`,
        email: u.email,
        role: u.role?.toLowerCase(),
        status: u.enabled ? 'Active' : 'Disabled',
        last: '-',
        avatar: ''
      })));
      this.auditList.set(logs.slice(0, 5).map((l: any) => ({
        actor: `User #${l.userId}`,
        action: l.action,
        target: `${l.entityType}#${l.entityId}`,
        time: l.timestamp,
        level: 'ok'
      })));
    } catch {}
  }

  rolesDist = [
    { label: 'Doctors',         pct: 45 },
    { label: 'Coordinatrices',  pct: 32 },
    { label: 'HR Managers',     pct: 15 },
    { label: 'Administrators',  pct: 8  },
  ];

  goUsers() { this.router.navigateByUrl('/dashboard/admin/users'); }
  goAudit() { this.router.navigateByUrl('/dashboard/admin/audit'); }
  exportReport() { this.router.navigateByUrl('/dashboard/admin/audit'); }
}
