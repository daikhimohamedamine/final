import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent, IconName } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';

interface Step { num: string; title: string; description: string; icon: IconName; }

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss',
})
export class ProcessComponent {
  steps: Step[] = [
    { num: '01', title: 'Onboard',          icon: 'users',        description: 'Add an employee with full identification and antécédents in one form.' },
    { num: '02', title: 'Examine',          icon: 'stethoscope',  description: 'Capture embauche, périodique or reprise visits with structured templates.' },
    { num: '03', title: 'Track Vaccines',   icon: 'syringe',      description: 'Schedule and track immunizations with automatic overdue alerts.' },
    { num: '04', title: 'Stay Compliant',   icon: 'shield',       description: 'Generate audit-ready reports for HIPAA, GDPR and your internal HR.' },
  ];
}
