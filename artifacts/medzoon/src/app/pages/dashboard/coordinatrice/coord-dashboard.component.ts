import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { IconComponent } from '../../../shared/icon.component';

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

  kpis = [
    { label: 'Visits this week', value: '47',  delta: '+8 vs last week',  up: true,  icon: 'calendar' as const },
    { label: 'Pending records',  value: '12',  delta: '4 require signature', up: false, icon: 'document' as const },
    { label: 'Reminders sent',   value: '156', delta: '93% open rate',    up: true,  icon: 'bell' as const },
    { label: 'Compliance rate',  value: '98%', delta: '+2pts this month', up: true,  icon: 'shield' as const },
  ];

  schedule = [
    { time: '09:00', employee: 'Pierre Mercier',  type: 'Hire visit',     doctor: 'Dr. Dubois',  status: 'Confirmed' },
    { time: '09:45', employee: 'Naima Khelifa',   type: 'Annual check',   doctor: 'Dr. Okafor',  status: 'Confirmed' },
    { time: '10:30', employee: 'Tomas Reyes',     type: 'Vaccine — Tdap', doctor: 'Dr. Dubois',  status: 'Pending' },
    { time: '11:15', employee: 'Sofia Andersen',  type: 'Return-to-work', doctor: 'Dr. Okafor',  status: 'Confirmed' },
    { time: '13:30', employee: 'Liam O\'Connor',  type: 'Follow-up',      doctor: 'Dr. Dubois',  status: 'Cancelled' },
    { time: '14:15', employee: 'Yara Haddad',     type: 'Hearing test',   doctor: 'Dr. Okafor',  status: 'Confirmed' },
  ];

  reminders = [
    { who: 'Marc Lefèvre',   what: 'Tdap booster due',          when: 'in 3 days',  level: 'warn' },
    { who: 'Camille Beaulieu', what: 'Annual check overdue',    when: '5 days late', level: 'danger' },
    { who: 'Hugo Martin',    what: 'Audiometry recommended',    when: 'in 12 days', level: 'ok' },
    { who: 'Elena Rossi',    what: 'Spirometry scheduled',      when: 'tomorrow',   level: 'ok' },
  ];
}
