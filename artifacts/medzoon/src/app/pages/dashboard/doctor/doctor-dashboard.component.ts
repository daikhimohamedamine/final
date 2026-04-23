import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { IconComponent } from '../../../shared/icon.component';

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

  kpis = [
    { label: 'Today\'s consults', value: '8',   delta: '4 completed',         up: true,  icon: 'stethoscope' as const },
    { label: 'Patients followed', value: '312', delta: '+6 this month',       up: true,  icon: 'users' as const },
    { label: 'Reports to sign',   value: '5',   delta: '2 due today',         up: false, icon: 'document' as const },
    { label: 'Vaccine alerts',    value: '11',  delta: '3 overdue',           up: false, icon: 'syringe' as const },
  ];

  agenda = [
    { time: '09:00', patient: 'Pierre Mercier',  type: 'Hire visit',     status: 'Done',     id: 'EMP-1042',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80' },
    { time: '09:45', patient: 'Naima Khelifa',   type: 'Annual check',   status: 'Done',     id: 'EMP-0871',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=80' },
    { time: '10:30', patient: 'Tomas Reyes',     type: 'Vaccine — Tdap', status: 'Now',      id: 'EMP-0322',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
    { time: '11:15', patient: 'Sofia Andersen',  type: 'Return-to-work', status: 'Upcoming', id: 'EMP-0450',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80' },
    { time: '13:30', patient: 'Yara Haddad',     type: 'Hearing test',   status: 'Upcoming', id: 'EMP-0612',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=120&q=80' },
  ];

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
}
