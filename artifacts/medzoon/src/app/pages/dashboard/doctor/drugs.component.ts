import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { DRUGS, Drug } from '../../../data/medical-data';
import { PrescriptionService } from './prescription.service';

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

  query = signal('');
  category = signal<'All' | Drug['category']>('All');
  draggingId = signal<string | null>(null);
  dropActive = signal(false);
  selected = signal<Drug | null>(null);

  categories: ('All' | Drug['category'])[] = ['All','Antibiotic','Analgesic','Respiratory','Cardiovascular','Gastric','Vitamin'];

  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    const c = this.category();
    return DRUGS.filter((d) => {
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
    const drug = DRUGS.find((d) => d.set_id === id);
    if (drug) this.rx.add(drug);
  }

  addToRx(d: Drug) { this.rx.add(d); }
  removeFromRx(setId: string) { this.rx.remove(setId); }
  setPosology(setId: string, value: string) { this.rx.setPosology(setId, value); }
  open(d: Drug) { this.selected.set(d); }
  closeDetail() { this.selected.set(null); }
}
