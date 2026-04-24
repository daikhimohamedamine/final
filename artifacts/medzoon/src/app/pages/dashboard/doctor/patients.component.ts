import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { EMPLOYEES } from '../../../data/medical-data';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './patients.component.html',
  styleUrls: ['../shared/dash-ui.scss', './patients.component.scss'],
})
export class PatientsComponent {
  query = signal('');
  dept = signal<'All' | string>('All');

  departments = computed(() => ['All', ...Array.from(new Set(EMPLOYEES.map((e) => e.department)))]);

  patients = computed(() => {
    const q = this.query().toLowerCase().trim();
    const d = this.dept();
    return EMPLOYEES.filter((e) => {
      if (d !== 'All' && e.department !== d) return false;
      if (!q) return true;
      return (
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
      );
    });
  });
}
