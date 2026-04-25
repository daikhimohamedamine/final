import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IconComponent } from '../../../shared/icon.component';
import { BackendApiService } from '../../../core/api/backend-api.service';
import { FeedbackService } from '../../../core/ui/feedback.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-coord-schedule',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['../shared/dash-ui.scss', './schedule.component.scss'],
})
export class CoordScheduleComponent {
  private api = inject(BackendApiService);
  private feedback = inject(FeedbackService);
  week = signal<any[]>([]);
  monthView = signal(false);
  showCreate = signal(false);
  createForm = signal({
    employeeId: '',
    medecinId: '',
    typeVisite: 'Visite périodique',
    dateDebut: new Date().toISOString().slice(0, 16),
    dateFin: new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16),
    notes: '',
  });

  constructor() {
    this.load();
  }

  async load() {
    try {
      const from = new Date();
      const to = new Date();
      to.setDate(to.getDate() + 7);
      const rows = await firstValueFrom(this.api.appointments(from.toISOString(), to.toISOString()));
      if (Array.isArray(rows) && rows.length) {
        const grouped: any[] = [];
        for (const row of rows) {
          const date = new Date(row.dateDebut).toISOString().slice(0, 10);
          let day = grouped.find((g) => g.date === date);
          if (!day) {
            day = { day: date, date, visits: [] };
            grouped.push(day);
          }
          day.visits.push({
            time: new Date(row.dateDebut).toLocaleTimeString(),
            name: `Employee #${row.employeeId}`,
            type: row.typeVisite ?? 'Visite',
            doctor: row.medecinId ? `Doctor #${row.medecinId}` : 'N/A',
            status: row.statut === 'ANNULE' ? 'Done' : 'Now',
          });
        }
        this.week.set(grouped);
      }
    } catch {
      this.feedback.error('Unable to load appointments.');
    }
  }

  toggleView() {
    this.monthView.update((v) => !v);
  }

  openCreateVisit() { this.showCreate.set(true); }
  closeCreateVisit() { this.showCreate.set(false); }

  async planVisit() {
    const f = this.createForm();
    if (!f.employeeId || !f.dateDebut || !f.dateFin) {
      this.feedback.error('Employee ID, start and end dates are required.');
      return;
    }
    try {
      await firstValueFrom(this.api.createAppointment({
        employeeId: Number(f.employeeId),
        medecinId: f.medecinId ? Number(f.medecinId) : null,
        dateDebut: new Date(f.dateDebut).toISOString(),
        dateFin: new Date(f.dateFin).toISOString(),
        typeVisite: f.typeVisite,
        notes: f.notes,
        statut: 'PLANIFIE',
      }));
      await this.load();
      this.feedback.success('Appointment planned.');
      this.closeCreateVisit();
    } catch {
      this.feedback.error('Failed to create appointment.');
    }
  }

  updateCreateForm(key: string, value: any) {
    this.createForm.update(f => ({ ...f, [key]: value }));
  }
}
