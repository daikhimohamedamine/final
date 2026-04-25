import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { IconComponent } from '../../../shared/icon.component';
import { BackendApiService } from '../../../core/api/backend-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['../shared/dash-ui.scss', './doctor-dashboard.component.scss'],
})
export class DoctorDashboardComponent {
  user = inject(AuthService).user;
  private router = inject(Router);
  private api = inject(BackendApiService);
  agendaList = signal<any[]>([]);

  kpis = [
    { label: 'Today\'s consults', value: '...',   delta: 'Loading',         up: true,  icon: 'stethoscope' as const },
    { label: 'Patients followed', value: '...', delta: 'Loading',       up: true,  icon: 'users' as const },
    { label: 'Reports to sign',   value: '...',   delta: 'Loading',         up: false, icon: 'document' as const },
    { label: 'Vaccine alerts',    value: '...',  delta: 'Loading',           up: false, icon: 'syringe' as const },
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
        this.agendaList.set(rows.map((a: any) => ({
          time: a.dateDebut.substring(11, 16),
          patient: `Employee #${a.employeeId}`,
          type: a.typeVisite ?? '-',
          status: a.statut,
          id: String(a.employeeId),
          avatar: ''
        })));
      }
    } catch {}
  }

  alerts = [
    { patient: 'Marc Lefèvre',     vaccine: 'Tdap booster',     due: 'Due in 3 days',   level: 'warn' },
    { patient: 'Camille Beaulieu', vaccine: 'Hep B (3rd dose)', due: 'Overdue 5 days',  level: 'danger' },
    { patient: 'Hugo Martin',      vaccine: 'MMR catch-up',     due: 'Due in 12 days',  level: 'ok' },
  ];

  vitals = [
    { label: 'Avg. consult time',  pct: 78, value: '14 min' },
    { label: 'Reports completed',  pct: 92, value: '92%' },
    { label: 'Patient satisfaction', pct: 96, value: '4.8/5' },
  ];

  openConsults() { this.router.navigateByUrl('/dashboard/doctor/consults'); }
  openPatients() { this.router.navigateByUrl('/dashboard/doctor/patients'); }
  openVaccines() { this.router.navigateByUrl('/dashboard/doctor/vaccines'); }
}
