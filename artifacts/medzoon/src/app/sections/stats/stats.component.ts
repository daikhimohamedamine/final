import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CounterDirective } from '../../shared/counter.directive';
import { RevealDirective } from '../../shared/reveal.directive';

interface Stat { value: number; suffix: string; label: string; }

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CounterDirective, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent {
  stats: Stat[] = [
    { value: 255, suffix: '+',  label: 'Trusted Hospitals'    },
    { value: 17,  suffix: 'K+', label: 'Records Managed'      },
    { value: 410, suffix: '+',  label: 'Certified Clinicians' },
    { value: 33,  suffix: 'K+', label: 'Visits This Year'     },
  ];
}
