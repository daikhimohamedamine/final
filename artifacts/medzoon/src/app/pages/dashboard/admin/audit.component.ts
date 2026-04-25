import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { AuditEvent } from '../../../core/models/models';
import { BackendApiService } from '../../../core/api/backend-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './audit.component.html',
  styleUrls: ['../shared/dash-ui.scss', './audit.component.scss'],
})
export class AdminAuditComponent {
  private api = inject(BackendApiService);
  level = signal<'All' | 'ok' | 'warn' | 'danger'>('All');
  query = signal('');
  source = signal<AuditEvent[]>([]);

  constructor() {
    this.load();
  }

  async load() {
    try {
      const rows = await firstValueFrom(this.api.adminAuditLogs());
      if (Array.isArray(rows) && rows.length) {
        this.source.set(rows.map((e: any) => ({
          id: e.id,
          time: e.timestamp ?? '',
          actor: `User #${e.userId ?? '-'}`,
          actorRole: 'system',
          action: e.action ?? '',
          target: `${e.entityType ?? ''}#${e.entityId ?? ''}`,
          ip: e.ipAddress ?? '-',
          level: 'ok',
        })));
      }
    } catch {}
  }

  exportCsv() {
    const rows = this.list();
    const csv = ['time,actor,action,target,ip,level', ...rows.map((r) => [r.time, r.actor, r.action, r.target, r.ip, r.level].join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  list = computed(() => {
    const l = this.level();
    const q = this.query().toLowerCase().trim();
    return this.source().filter((e) => {
      if (l !== 'All' && e.level !== l) return false;
      if (!q) return true;
      return e.actor.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || e.target.toLowerCase().includes(q);
    });
  });
}
