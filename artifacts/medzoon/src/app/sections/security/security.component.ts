import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent, IconName } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';

interface Pillar { icon: IconName; title: string; body: string; }

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
})
export class SecurityComponent {
  pillars: Pillar[] = [
    { icon: 'lock',     title: 'End-to-end Encryption', body: 'AES-256 at rest, TLS 1.3 in transit. Field-level encryption for the most sensitive PHI.' },
    { icon: 'users',    title: 'Role-Based Access',     body: 'Médecin du travail and coordinatrice profiles with granular per-record permissions.' },
    { icon: 'document', title: 'Audit Trail',           body: 'Every read, write, and export is logged immutably and exportable for inspections.' },
    { icon: 'sparkles', title: 'GDPR + HIPAA Ready',    body: 'Data residency, right-to-be-forgotten, and BAAs available for every customer.' },
  ];

  roles = [
    { role: 'Médecin du Travail', records: true,  edit: true,  export: true,  audit: true  },
    { role: 'Coordinatrice',      records: true,  edit: true,  export: true,  audit: false },
    { role: 'HR Manager',         records: false, edit: false, export: true,  audit: false },
    { role: 'Auditor',            records: true,  edit: false, export: true,  audit: true  },
  ];
}
