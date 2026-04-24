import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IconComponent } from '../../../shared/icon.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users.component.html',
  styleUrls: ['../shared/dash-ui.scss', './users.component.scss'],
})
export class AdminUsersComponent {
  users = signal([
    { name: 'Léa Bernard',     email: 'lea.bernard@medzoon.health',    role: 'coord',  status: 'Active', mfa: true,  last: '2 min',
      avatar: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=120&q=80' },
    { name: 'Camille Dubois',  email: 'camille.dubois@medzoon.health', role: 'doctor', status: 'Active', mfa: true,  last: '14 min',
      avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=120&q=80' },
    { name: 'Idris Okafor',    email: 'idris.okafor@medzoon.health',   role: 'doctor', status: 'Active', mfa: true,  last: '1 h',
      avatar: 'https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?auto=format&fit=crop&w=120&q=80' },
    { name: 'Aria Nakamura',   email: 'aria.nakamura@medzoon.health',  role: 'coord',  status: 'Pending', mfa: false, last: '—',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80' },
    { name: 'Margaux Laurent', email: 'admin@medzoon.health',          role: 'admin',  status: 'Active', mfa: true,  last: '3 j',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80' },
    { name: 'Marc Lefèvre',    email: 'marc.lefevre@medzoon.health',   role: 'admin',  status: 'Suspended', mfa: false, last: '12 j',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80' },
  ]);

  showInvite = signal(false);
  open()  { this.showInvite.set(true); }
  close() { this.showInvite.set(false); }
}
