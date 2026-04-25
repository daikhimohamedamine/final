import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { Drug } from '../../../core/models/models';
import { PrescriptionService } from './prescription.service';
import { BackendApiService } from '../../../core/api/backend-api.service';
import { FeedbackService } from '../../../core/ui/feedback.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-drugs',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drugs.component.html',
  styleUrls: ['../shared/dash-ui.scss', './drugs.component.scss'],
})
export class DrugsComponent {
  rx = inject(PrescriptionService);
  private api = inject(BackendApiService);
  private feedback = inject(FeedbackService);

  query = signal('');
  category = signal<'All' | Drug['category']>('All');
  draggingId = signal<string | null>(null);
  dropActive = signal(false);
  selected = signal<Drug | null>(null);
  source = signal<Drug[]>([]);

  constructor() {
    this.load();
  }

  private async load() {
    try {
      const res = await firstValueFrom(this.api.drugs());
      const rows = Array.isArray(res?.content) ? res.content : Array.isArray(res) ? res : [];
      if (rows.length) {
        this.source.set(rows.map((d: any) => ({
          set_id: d.setId ?? String(d.id),
          drug_name: d.drugName ?? '',
          generic_name: d.genericName ?? '',
          category: 'Respiratory',
          dosage: d.dosage ?? '',
          indications: d.indications ?? '',
          sicknesses: Array.isArray(d.sicknesses) ? d.sicknesses : [],
          image_lookup_url: d.imageLookupUrl ?? '',
        } as Drug)));
      }
    } catch {}
  }

  categories: ('All' | Drug['category'])[] = ['All','Antibiotic','Analgesic','Respiratory','Cardiovascular','Gastric','Vitamin'];

  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    const c = this.category();
    return this.source().filter((d) => {
      if (c !== 'All' && d.category !== c) return false;
      if (!q) return true;
      return (
        d.drug_name.toLowerCase().includes(q) ||
        d.generic_name.toLowerCase().includes(q) ||
        d.indications.toLowerCase().includes(q) ||
        d.sicknesses.some((s) => s.toLowerCase().includes(q))
      );
    });
  });

  onDragStart(ev: DragEvent, d: Drug) {
    this.draggingId.set(d.set_id);
    if (ev.dataTransfer) {
      ev.dataTransfer.setData('text/plain', d.set_id);
      ev.dataTransfer.effectAllowed = 'copy';
    }
  }
  onDragEnd() { this.draggingId.set(null); }

  onDragOver(ev: DragEvent) { ev.preventDefault(); this.dropActive.set(true); if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'copy'; }
  onDragLeave() { this.dropActive.set(false); }
  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.dropActive.set(false);
    const id = ev.dataTransfer?.getData('text/plain');
    const drug = this.source().find((d) => d.set_id === id);
    if (drug) this.rx.add(drug);
  }

  addToRx(d: Drug) { this.rx.add(d); }
  removeFromRx(setId: string) { this.rx.remove(setId); }
  setPosology(setId: string, value: string) { this.rx.setPosology(setId, value); }
  open(d: Drug) { this.selected.set(d); }
  closeDetail() { this.selected.set(null); }

  printPrescription() {
    const text = this.rx.items().map((i) => `${i.drug.drug_name} (${i.drug.dosage}) - ${i.posology || 'N/A'}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prescription.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  saveToConsultation() {
    if (!this.rx.items().length) {
      this.feedback.info('Add at least one medication first.');
      return;
    }
    this.feedback.success(`${this.rx.items().length} medication(s) ready for consultation save.`);
  }
}
