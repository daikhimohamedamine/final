import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../../shared/icon.component';

@Component({
  selector: 'app-coord-reminders',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reminders.component.html',
  styleUrls: ['../shared/dash-ui.scss', './reminders.component.scss'],
})
export class CoordRemindersComponent {
  upcoming = [
    { id: 1, employee: 'Marc Lefèvre',     reason: 'Visite périodique annuelle', due: 'Dans 3 jours',  level: 'warn' },
    { id: 2, employee: 'Camille Beaulieu', reason: 'Annual check overdue',       due: '5 jours de retard', level: 'danger' },
    { id: 3, employee: 'Hugo Martin',      reason: 'Audiométrie recommandée',    due: 'Dans 12 jours', level: 'ok' },
    { id: 4, employee: 'Elena Rossi',      reason: 'Spirométrie programmée',     due: 'Demain',        level: 'ok' },
    { id: 5, employee: 'Tomas Reyes',      reason: 'Visite de reprise',          due: 'Dans 2 jours',  level: 'warn' },
    { id: 6, employee: 'Sofia Andersen',   reason: 'Vaccination Hep B',          due: 'Dans 8 jours',  level: 'ok' },
  ];

  history = [
    { date: '23/04 14:05', who: '12 employés', subject: 'Rappel Tdap',          channel: 'Email', status: 'Envoyé' },
    { date: '22/04 09:18', who: 'Marc Lefèvre',subject: 'Visite périodique',    channel: 'Email', status: 'Envoyé' },
    { date: '21/04 16:42', who: 'Naima Khelifa',subject: 'Convocation spontanée',channel: 'Email', status: 'Échec' },
    { date: '20/04 10:00', who: '8 employés',  subject: 'Rappel Hépatite B',    channel: 'Email', status: 'Envoyé' },
  ];
}
