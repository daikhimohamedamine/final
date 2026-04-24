import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { AUDIT_EVENTS } from '../../../data/medical-data';

@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './audit.component.html',
  styleUrls: ['../shared/dash-ui.scss', './audit.component.scss'],
})
export class AdminAuditComponent {
  level = signal<'All' | 'ok' | 'warn' | 'danger'>('All');
  query = signal('');

  list = computed(() => {
    const l = this.level();
    const q = this.query().toLowerCase().trim();
    return AUDIT_EVENTS.filter((e) => {
      if (l !== 'All' && e.level !== l) return false;
      if (!q) return true;
      return e.actor.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || e.target.toLowerCase().includes(q);
    });
  });
}
