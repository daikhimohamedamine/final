import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../../shared/icon.component';

@Component({
  selector: 'app-vaccines',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vaccines.component.html',
  styleUrls: ['../shared/dash-ui.scss', './vaccines.component.scss'],
})
export class VaccinesComponent {
  vaccineList = [
    { name: 'Tétanos (Tdap)',  coverage: 92, total: 245, due: 18 },
    { name: 'Hépatite B',       coverage: 88, total: 235, due: 24 },
    { name: 'DTP',              coverage: 95, total: 252, due: 11 },
    { name: 'Tuberculose (BCG)',coverage: 78, total: 207, due: 38 },
    { name: 'Diphtérie',        coverage: 91, total: 240, due: 16 },
    { name: 'Grippe saisonnière', coverage: 64, total: 170, due: 95 },
  ];

  alerts = [
    { id: 'EMP-1188', name: 'Marc Lefèvre',     vaccine: 'Tdap booster',     due: 'Dans 3 jours',   level: 'warn',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80' },
    { id: 'EMP-0907', name: 'Camille Beaulieu', vaccine: 'Hep B (3ème dose)', due: 'En retard 5j',  level: 'danger',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80' },
    { id: 'EMP-0654', name: 'Hugo Martin',      vaccine: 'MMR catch-up',      due: 'Dans 12 jours', level: 'ok',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80' },
    { id: 'EMP-0233', name: 'Elena Rossi',      vaccine: 'Grippe saisonnière',due: 'Demain',        level: 'ok',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=80' },
    { id: 'EMP-0322', name: 'Tomas Reyes',      vaccine: 'Tétanos rappel',    due: 'En retard 12j', level: 'danger',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
  ];
}
