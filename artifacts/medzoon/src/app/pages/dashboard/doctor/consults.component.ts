import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { CONSULTATIONS, Consultation } from '../../../data/medical-data';

@Component({
  selector: 'app-consults',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './consults.component.html',
  styleUrls: ['../shared/dash-ui.scss', './consults.component.scss'],
})
export class ConsultsComponent {
  type = signal<'All' | Consultation['type']>('All');
  query = signal('');

  types: ('All' | Consultation['type'])[] = ['All','Embauche','Périodique','Reprise','Soin','Spontanée'];

  list = computed(() => {
    const t = this.type();
    const q = this.query().toLowerCase().trim();
    return CONSULTATIONS.filter((c) => {
      if (t !== 'All' && c.type !== t) return false;
      if (!q) return true;
      return c.employeeName.toLowerCase().includes(q) || c.employeeId.toLowerCase().includes(q);
    });
  });
}
