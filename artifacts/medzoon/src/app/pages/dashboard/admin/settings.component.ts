import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrls: ['../shared/dash-ui.scss', './settings.component.scss'],
})
export class AdminSettingsComponent {
  org = signal({ name: 'Medzoon Health', siret: '812 345 678 00012', address: '14 rue de la Santé, 75013 Paris', tz: 'Europe/Paris' });
  retention = signal({ medical: 50, audit: 6, attachments: 25 });
  security  = signal({ mfa: true, sso: false, ipFilter: false, lockoutMin: 15 });
}
