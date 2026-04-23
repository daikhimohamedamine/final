import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent, IconName } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';

interface Dept {
  id: string;
  name: string;
  icon: IconName;
  description: string;
}

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss',
})
export class DepartmentsComponent {
  departments: Dept[] = [
    { id: '01', name: 'Medical Records', icon: 'document', description: 'Centralized employee files with full clinical history, allergies, and treatments — searchable in seconds.' },
    { id: '02', name: 'Periodic Visits', icon: 'calendar', description: 'Automated reminders for annual visits, return-to-work exams, and onboarding check-ups.' },
    { id: '03', name: 'Vaccinations', icon: 'syringe', description: 'Track immunization status across your workforce with timeline views and overdue alerts.' },
    { id: '04', name: 'Cardiology', icon: 'cardio', description: 'Capture vitals, ECGs, blood pressure, and pulse with structured templates.' },
    { id: '05', name: 'Neurology', icon: 'brain', description: 'Document reflexes, equilibrium, and neuro-psychic exams with rich clinical fields.' },
    { id: '06', name: 'Ophthalmology', icon: 'eye', description: 'Vision screenings — near and far, both eyes — built into every embauche workflow.' },
    { id: '07', name: 'Treatments', icon: 'pill', description: 'Prescriptions, observations, and recommendations attached to every consultation.' },
    { id: '08', name: 'Reporting', icon: 'chart', description: 'PDF & Excel exports for compliance reports, periodic visit lists, and HR audits.' },
  ];
}
