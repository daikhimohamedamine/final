import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { IconComponent } from '../../../shared/icon.component';
import { BackendApiService } from '../../../core/api/backend-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-coord-dashboard',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coord-dashboard.component.html',
  styleUrls: ['../shared/dash-ui.scss', './coord-dashboard.component.scss'],
})
export class CoordDashboardComponent {
  user = inject(AuthService).user;
  private router = inject(Router);
  private api = inject(BackendApiService);
  scheduleList = signal<any[]>([]);

  kpis = [
    { label: 'Visits this week', value: '...',  delta: 'Loading',  up: true,  icon: 'calendar' as const },
    { label: 'Pending records',  value: '...',  delta: 'Loading',  up: false, icon: 'document' as const },
    { label: 'Reminders sent',   value: '...',  delta: 'Loading',  up: true,  icon: 'bell' as const },
    { label: 'Compliance rate',  value: '...',  delta: 'Loading',  up: true,  icon: 'shield' as const },
  ];

  constructor() {
    this.load();
  }

  async load() {
    try {
      const today = new Date();
      today.setHours(0,0,0,0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const rows = await firstValueFrom(this.api.appointments(today.toISOString(), tomorrow.toISOString()));
      if (Array.isArray(rows)) {
        this.scheduleList.set(rows.map((a: any) => ({
          time: a.dateDebut.substring(11, 16),
          employee: `Employee #${a.employeeId}`,
          type: a.typeVisite ?? '-',
          doctor: `Dr. #${a.medecinId ?? '-'}`,
          status: a.statut
        })));
      }
    } catch {}
  }

  reminders = [
    { who: 'Marc Lefèvre',   what: 'Tdap booster due',          when: 'in 3 days',  level: 'warn' },
    { who: 'Camille Beaulieu', what: 'Annual check overdue',    when: '5 days late', level: 'danger' },
    { who: 'Hugo Martin',    what: 'Audiometry recommended',    when: 'in 12 days', level: 'ok' },
    { who: 'Elena Rossi',    what: 'Spirometry scheduled',      when: 'tomorrow',   level: 'ok' },
  ];

  openReminders() { this.router.navigateByUrl('/dashboard/coordinatrice/reminders'); }
  openSchedule() { this.router.navigateByUrl('/dashboard/coordinatrice/schedule'); }
}
