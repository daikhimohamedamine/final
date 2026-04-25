import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IconComponent } from '../../../shared/icon.component';
import { BackendApiService } from '../../../core/api/backend-api.service';
import { FeedbackService } from '../../../core/ui/feedback.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-coord-reminders',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reminders.component.html',
  styleUrls: ['../shared/dash-ui.scss', './reminders.component.scss'],
})
export class CoordRemindersComponent {
  private api = inject(BackendApiService);
  private feedback = inject(FeedbackService);
  upcoming = signal([
    { id: 1, employee: 'Marc Lefèvre',     reason: 'Visite périodique annuelle', due: 'Dans 3 jours',  level: 'warn' },
    { id: 2, employee: 'Camille Beaulieu', reason: 'Annual check overdue',       due: '5 jours de retard', level: 'danger' },
    { id: 3, employee: 'Hugo Martin',      reason: 'Audiométrie recommandée',    due: 'Dans 12 jours', level: 'ok' },
    { id: 4, employee: 'Elena Rossi',      reason: 'Spirométrie programmée',     due: 'Demain',        level: 'ok' },
    { id: 5, employee: 'Tomas Reyes',      reason: 'Visite de reprise',          due: 'Dans 2 jours',  level: 'warn' },
    { id: 6, employee: 'Sofia Andersen',   reason: 'Vaccination Hep B',          due: 'Dans 8 jours',  level: 'ok' },
  ]);

  history = signal([
    { date: '23/04 14:05', who: '12 employés', subject: 'Rappel Tdap',          channel: 'Email', status: 'Envoyé' },
    { date: '22/04 09:18', who: 'Marc Lefèvre',subject: 'Visite périodique',    channel: 'Email', status: 'Envoyé' },
    { date: '21/04 16:42', who: 'Naima Khelifa',subject: 'Convocation spontanée',channel: 'Email', status: 'Échec' },
    { date: '20/04 10:00', who: '8 employés',  subject: 'Rappel Hépatite B',    channel: 'Email', status: 'Envoyé' },
  ]);
  showCreate = signal(false);
  createForm = signal({
    employeeId: '',
    dateEcheance: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  });

  constructor() {
    this.load();
  }

  async load() {
    try {
      const from = new Date();
      const to = new Date();
      to.setDate(to.getDate() + 30);
      const reminders = await firstValueFrom(this.api.reminders(from.toISOString().slice(0, 10), to.toISOString().slice(0, 10)));
      if (Array.isArray(reminders)) {
        this.upcoming.set(reminders.map((r: any) => ({
          id: r.id,
          employee: `Employee #${r.employeeId}`,
          reason: r.type,
          due: r.dateEcheance,
          level: r.envoye ? 'ok' : 'warn',
        })));
      }
      const notifications = await firstValueFrom(this.api.notifications());
      if (Array.isArray(notifications)) {
        this.history.set(notifications.map((n: any) => ({
          date: n.dateEnvoi,
          who: n.destinataireEmail,
          subject: n.sujet,
          channel: 'Email',
          status: n.statut === 'SUCCESS' ? 'Envoyé' : 'Échec',
        })));
      }
    } catch {
      this.feedback.error('Failed to load reminders/notifications.');
    }
  }

  async sendAll() {
    for (const r of this.upcoming()) {
      try {
        await firstValueFrom(this.api.sendReminder(r.id));
      } catch {
        this.feedback.error(`Failed to send reminder #${r.id}`);
      }
    }
    await this.load();
    this.feedback.success('Reminder sending flow completed.');
  }

  async createManual() {
    const payload = this.createForm();
    if (!payload.employeeId) {
      this.feedback.error('Employee ID is required.');
      return;
    }
    try {
      await firstValueFrom(this.api.createManualReminder({
        employeeId: Number(payload.employeeId),
        dateEcheance: payload.dateEcheance,
      }));
      await this.load();
      this.feedback.success('Manual reminder created.');
      this.showCreate.set(false);
    } catch {
      this.feedback.error('Failed to create manual reminder.');
    }
  }

  openCreateManual() { this.showCreate.set(true); }
  closeCreateManual() { this.showCreate.set(false); }

  updateCreateForm(key: string, value: any) {
    this.createForm.update(f => ({ ...f, [key]: value }));
  }
}
