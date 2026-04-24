import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { EMPLOYEES } from '../../../data/medical-data';

@Component({
  selector: 'app-coord-employees',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employees.component.html',
  styleUrls: ['../shared/dash-ui.scss', './employees.component.scss'],
})
export class CoordEmployeesComponent {
  query = signal('');
  status = signal<'All' | 'Active' | 'Archived'>('All');
  showCreate = signal(false);

  list = computed(() => {
    const q = this.query().toLowerCase().trim();
    const s = this.status();
    return EMPLOYEES.filter((e) => {
      if (s !== 'All' && e.status !== s) return false;
      if (!q) return true;
      return e.firstName.toLowerCase().includes(q) || e.lastName.toLowerCase().includes(q) ||
             e.id.toLowerCase().includes(q) || e.position.toLowerCase().includes(q);
    });
  });

  open()  { this.showCreate.set(true); }
  close() { this.showCreate.set(false); }
}
