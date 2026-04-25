import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { EmployeeListItem } from '../../../core/models/models';
import { BackendApiService } from '../../../core/api/backend-api.service';
import { FeedbackService } from '../../../core/ui/feedback.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-coord-employees',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employees.component.html',
  styleUrls: ['../shared/dash-ui.scss', './employees.component.scss'],
})
export class CoordEmployeesComponent {
  private api = inject(BackendApiService);
  private feedback = inject(FeedbackService);
  query = signal('');
  status = signal<'All' | 'Active' | 'Archived'>('All');
  showCreate = signal(false);
  source = signal<EmployeeListItem[]>([]);
  form = signal({
    dossierNumber: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    departement: '',
    posteTravail: '',
    email: '',
  });

  constructor() {
    this.load();
  }

  async load() {
    try {
      const res = await firstValueFrom(this.api.employees());
      const rows = Array.isArray(res?.content) ? res.content : Array.isArray(res) ? res : [];
      if (rows.length) {
        this.source.set(rows.map((e: any) => ({
          id: e.dossierNumber ?? String(e.id),
          firstName: e.prenom ?? '',
          lastName: e.nom ?? '',
          position: e.posteTravail ?? '',
          department: e.departement ?? '',
          birthDate: e.dateNaissance ?? '',
          hireDate: e.dateEmbauche ?? '-',
          lastVisit: '-',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
          status: e.statut === 'ARCHIVE' ? 'Archived' : 'Active',
        })));
      }
    } catch {
      this.feedback.error('Unable to load employees.');
    }
  }

  list = computed(() => {
    const q = this.query().toLowerCase().trim();
    const s = this.status();
    return this.source().filter((e) => {
      if (s !== 'All' && e.status !== s) return false;
      if (!q) return true;
      return e.firstName.toLowerCase().includes(q) || e.lastName.toLowerCase().includes(q) ||
             e.id.toLowerCase().includes(q) || (e.position ?? '').toLowerCase().includes(q);
    });
  });

  open()  { this.showCreate.set(true); }
  close() { this.showCreate.set(false); }

  exportCsv() {
    const rows = this.list();
    const csv = ['id,firstName,lastName,position,department,status', ...rows.map((e: any) =>
      [e.id, e.firstName, e.lastName, e.position, e.department ?? '', e.status].join(','),
    )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async createEmployee() {
    const payload = this.form();
    if (!payload.nom || !payload.prenom || !payload.dossierNumber || !payload.dateNaissance) return;
    try {
      await firstValueFrom(this.api.createEmployee(payload));
      this.close();
      await this.load();
      this.feedback.success('Employee record created.');
    } catch {
      this.feedback.error('Failed to create employee.');
    }
  }

  viewEmployee(e: any) {
    window.alert(`Employee ${e.id}: ${e.firstName} ${e.lastName}`);
  }

  editEmployee(e: any) {
    this.form.set({
      dossierNumber: e.id ?? '',
      nom: e.lastName ?? '',
      prenom: e.firstName ?? '',
      dateNaissance: e.birthDate ?? '',
      departement: e.department ?? '',
      posteTravail: e.position ?? '',
      email: '',
    });
    this.open();
  }

  async archiveEmployee(e: any) {
    try {
      await firstValueFrom(this.api.archiveEmployee(e.id));
      await this.load();
      this.feedback.success('Employee archived.');
    } catch {
      this.feedback.error('Failed to archive employee.');
    }
  }

  updateForm(key: string, value: any) {
    this.form.update(f => ({ ...f, [key]: value }));
  }
}
