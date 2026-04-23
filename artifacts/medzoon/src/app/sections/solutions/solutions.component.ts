import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.scss',
})
export class SolutionsComponent {
  bullets = [
    'Centralize personal info, antécédents, and habits — searchable in seconds.',
    'Capture every consultation type: embauche, périodique, soin, reprise.',
    'Automated annual reminders with email & in-app notifications.',
    'Granular role-based access for médecins du travail and coordinatrices.',
  ];

  hours = [
    { day: 'Mon — Fri', time: '9:00 AM – 12:00 PM' },
    { day: 'Sat',       time: '9:00 AM – 6:00 PM'  },
    { day: 'Sun',       time: '7:00 AM – 8:00 PM'  },
  ];
}
