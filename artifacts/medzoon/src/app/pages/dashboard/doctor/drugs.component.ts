import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drugs.component.html',
  styleUrls: ['../shared/dash-ui.scss', './drugs.component.scss'],
})
export class DrugsComponent {
  rx = inject(PrescriptionService);
  private api = inject(BackendApiService);
  private feedback = inject(FeedbackService);

  activeTab = signal<'DRUGS' | 'RESOURCES'>('DRUGS');
  query = signal('');
  category = signal<'All' | Drug['category']>('All');
  
  // Drugs State
  draggingId = signal<string | null>(null);
  dropActive = signal(false);
  selected = signal<Drug | null>(null);
  source = signal<Drug[]>([]);

  // Resources State
  resources = signal<any[]>([]);
  resourceCategory = signal<'All' | 'CERTIFICAT' | 'EXPERIENCE' | 'LIVRE' | 'LIVRE_MEDICAL' | 'JOURNAL' | 'AUTRE'>('All');
  showUploadResource = signal(false);
  uploadFile = signal<File | null>(null);
  uploadData = signal({
    categorie: 'LIVRE' as 'CERTIFICAT' | 'EXPERIENCE' | 'LIVRE' | 'LIVRE_MEDICAL' | 'JOURNAL' | 'AUTRE',
    description: ''
  });

  constructor() {
    this.load();
  }

  async load() {
    if (this.activeTab() === 'DRUGS') {
      await this.loadDrugs();
    } else {
      await this.loadResources();
    }
  }

  async loadDrugs() {
    try {
      const res = await firstValueFrom(this.api.drugs());
      const rows = Array.isArray(res?.content) ? res.content : Array.isArray(res) ? res : [];
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
    } catch {}
  }

  async loadResources() {
    try {
      const cat = this.resourceCategory() === 'All' ? undefined : this.resourceCategory();
      const res = await firstValueFrom(this.api.doctorLibraryDocs(cat));
      this.resources.set(res);
    } catch {
      this.feedback.error('Impossible de charger vos ressources.');
    }
  }

  setTab(tab: 'DRUGS' | 'RESOURCES') {
    this.activeTab.set(tab);
    this.load();
  }

  // Filtered lists
  filteredDrugs = computed(() => {
    const q = this.query().toLowerCase().trim();
    const c = this.category();
    return this.source().filter((d) => {
      if (c !== 'All' && d.category !== c) return false;
      if (!q) return true;
      return d.drug_name.toLowerCase().includes(q) || d.generic_name.toLowerCase().includes(q);
    });
  });

  filteredResources = computed(() => {
    const q = this.query().toLowerCase().trim();
    return this.resources().filter(r => !q || r.nomFichier.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
  });

  // Resource Methods
  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.uploadFile.set(input.files?.[0] ?? null);
  }

  async uploadResource() {
    const file = this.uploadFile();
    if (!file) return;
    try {
      await firstValueFrom(this.api.uploadDoctorLibraryDoc(file, this.uploadData().categorie, this.uploadData().description));
      this.feedback.success('Ressource ajoutée avec succès.');
      this.showUploadResource.set(false);
      this.uploadFile.set(null);
      this.loadResources();
    } catch {
      this.feedback.error('Échec de l\'ajout de la ressource.');
    }
  }

  async downloadResource(r: any) {
    try {
      const blob = await firstValueFrom(this.api.downloadDoctorLibraryDoc(r.id));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = r.nomFichier;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      this.feedback.error('Échec du téléchargement.');
    }
  }

  async deleteResource(r: any) {
    if (!confirm('Voulez-vous supprimer ce document ?')) return;
    try {
      await firstValueFrom(this.api.deleteDoctorLibraryDoc(r.id));
      this.feedback.success('Document supprimé.');
      this.loadResources();
    } catch {
      this.feedback.error('Échec de la suppression.');
    }
  }

  // Drag & Drop
  onDragStart(ev: DragEvent, d: Drug) {
    this.draggingId.set(d.set_id);
    ev.dataTransfer?.setData('text/plain', d.set_id);
  }
  onDragEnd() { this.draggingId.set(null); }
  onDragOver(ev: DragEvent) { ev.preventDefault(); this.dropActive.set(true); }
  onDragLeave() { this.dropActive.set(false); }
  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.dropActive.set(false);
    const id = ev.dataTransfer?.getData('text/plain');
    const drug = this.source().find((d) => d.set_id === id);
    if (drug) this.rx.add(drug);
  }

  categories: ('All' | Drug['category'])[] = ['All','Antibiotic','Analgesic','Respiratory','Cardiovascular','Gastric','Vitamin'];
  resourceCategories = ['All', 'CERTIFICAT', 'EXPERIENCE', 'LIVRE', 'LIVRE_MEDICAL', 'JOURNAL', 'AUTRE'];

  addToRx(d: Drug) { this.rx.add(d); }
  removeFromRx(setId: string) { this.rx.remove(setId); }
  setPosology(setId: string, value: string) { this.rx.setPosology(setId, value); }
}
