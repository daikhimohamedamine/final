import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { BackendApiService } from '../../../core/api/backend-api.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrls: ['../shared/dash-ui.scss', './settings.component.scss'],
})
export class AdminSettingsComponent {
  private api = inject(BackendApiService);
  org = signal({ name: 'Medzoon Health', siret: '812 345 678 00012', address: '14 rue de la Santé, 75013 Paris', tz: 'Europe/Paris' });
  retention = signal({ medical: 50, audit: 6, attachments: 25 });
  security  = signal({ mfa: true, sso: false, ipFilter: false, lockoutMin: 15 });
  drugFile = signal<File | null>(null);
  importStatus = signal<string>('');

  save() {
    localStorage.setItem('medzoon.settings.org', JSON.stringify(this.org()));
    localStorage.setItem('medzoon.settings.retention', JSON.stringify(this.retention()));
    localStorage.setItem('medzoon.settings.security', JSON.stringify(this.security()));
  }

  onDrugFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.drugFile.set(file);
    this.importStatus.set(file ? `File selected: ${file.name}` : '');
  }

  async importDrugDataset(clearBefore = true) {
    const file = this.drugFile();
    if (!file) {
      this.importStatus.set('Please select a CSV file first.');
      return;
    }
    this.importStatus.set('Import in progress...');
    try {
      const res = await firstValueFrom(this.api.importDrugsCsv(file, clearBefore));
      this.importStatus.set(`Import done. Created=${res?.created ?? 0}, Skipped=${res?.skipped ?? 0}, Errors=${(res?.errors ?? []).length}`);
    } catch (e: any) {
      this.importStatus.set(`Import failed: ${e?.message ?? 'unknown error'}`);
    }
  }
}
