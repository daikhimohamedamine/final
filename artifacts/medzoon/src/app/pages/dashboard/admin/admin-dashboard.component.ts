import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { IconComponent } from '../../../shared/icon.component';

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

  kpis = [
    { label: 'Active Users',     value: '128',   delta: '+12 this month',  up: true,  icon: 'users' as const },
    { label: 'Records Stored',   value: '17,402',delta: '+842 this week',  up: true,  icon: 'document' as const },
    { label: 'Open Audit Items', value: '3',     delta: '−2 since Monday', up: true,  icon: 'shield' as const },
    { label: 'Storage Used',     value: '64%',   delta: 'of 1.0 TB plan',  up: false, icon: 'chart' as const },
  ];

  users = [
    { name: 'Léa Bernard',    email: 'lea.bernard@medzoon.health',    role: 'coord',  status: 'Active', last: '2m ago',
      avatar: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=120&q=80' },
    { name: 'Camille Dubois', email: 'camille.dubois@medzoon.health', role: 'doctor', status: 'Active', last: '14m ago',
      avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=120&q=80' },
    { name: 'Idris Okafor',   email: 'idris.okafor@medzoon.health',   role: 'doctor', status: 'Active', last: '1h ago',
      avatar: 'https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?auto=format&fit=crop&w=120&q=80' },
    { name: 'Aria Nakamura',  email: 'aria.nakamura@medzoon.health',  role: 'coord',  status: 'Pending', last: 'never',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80' },
    { name: 'Marc Lefèvre',   email: 'marc.lefevre@medzoon.health',   role: 'admin',  status: 'Active', last: '3d ago',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80' },
  ];

  audit = [
    { actor: 'Camille Dubois', action: 'Viewed record',    target: 'EMP-1042 Pierre M.',  time: '2 min ago',  level: 'ok' },
    { actor: 'Léa Bernard',    action: 'Edited visit',     target: 'EMP-0871 Naima K.',   time: '14 min ago', level: 'ok' },
    { actor: 'System',         action: 'Permission denied', target: 'Export attempt',     time: '1 hr ago',   level: 'warn' },
    { actor: 'Idris Okafor',   action: 'Created vaccine record', target: 'EMP-0322 Tom R.', time: '2 hr ago', level: 'ok' },
    { actor: 'Margaux Laurent',action: 'Invited user',     target: 'aria.nakamura@…',     time: '5 hr ago',   level: 'ok' },
  ];

  rolesDist = [
    { label: 'Doctors',         pct: 45 },
    { label: 'Coordinatrices',  pct: 32 },
    { label: 'HR Managers',     pct: 15 },
    { label: 'Administrators',  pct: 8  },
  ];
}
