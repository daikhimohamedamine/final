import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { ConsultationListItem } from '../../../core/models/models';
import { BackendApiService } from '../../../core/api/backend-api.service';
import { FeedbackService } from '../../../core/ui/feedback.service';
import { PrescriptionService } from './prescription.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-consults',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './consults.component.html',
  styleUrls: ['../shared/dash-ui.scss', './consults.component.scss'],
})
export class ConsultsComponent {
  private api = inject(BackendApiService);
  private feedback = inject(FeedbackService);
  private rx = inject(PrescriptionService);
  type = signal<'All' | ConsultationListItem['type']>('All');
  query = signal('');
  source = signal<ConsultationListItem[]>([]);
  showCreate = signal(false);
  creating = signal(false);
  showDocs = signal(false);
  selectedConsultation = signal<ConsultationListItem | null>(null);
  documents = signal<any[]>([]);
  docFile = signal<File | null>(null);
  form = signal({
    employeeId: '',
    type: 'Spontanée' as ConsultationListItem['type'],
    date: new Date().toISOString().slice(0, 10),
    diagnostic: '',
    poids: '',
    taille: '',
    tensionSystolique: '',
    tensionDiastolique: '',
    conclusion: 'Apte' as NonNullable<ConsultationListItem['conclusion']>,
    apte: true,
    inaptePrecision: '',
    inapteDefinitif: false,
    reclassification: '',
    examensSpeciaux: '',
  });

  constructor() {
    this.load();
  }

  async load() {
    try {
      const res = await firstValueFrom(this.api.consultations(1));
      const rows = Array.isArray(res?.content) ? res.content : Array.isArray(res) ? res : [];
      if (rows.length) {
        this.source.set(rows.map((c: any) => ({
          ...(this.extractMedicalSummary(c.details)),
          id: String(c.id),
          employeeId: String(c.employeeId ?? ''),
          employeeName: `Employee #${c.employeeId ?? ''}`,
          type: this.toUiType(c.type),
          date: c.dateConsultation ?? '',
          time: '09:00',
          doctor: `Doctor #${c.medecinId ?? ''}`,
          status: 'Completed',
        })));
      }
    } catch {
      this.feedback.error('Unable to load consultations.');
    }
  }

  types: ('All' | ConsultationListItem['type'])[] = ['All','Embauche','Périodique','Reprise','Soin','Spontanée'];

  list = computed(() => {
    const t = this.type();
    const q = this.query().toLowerCase().trim();
    return this.source().filter((c) => {
      if (t !== 'All' && c.type !== t) return false;
      if (!q) return true;
      return c.employeeName.toLowerCase().includes(q) || c.employeeId.toLowerCase().includes(q);
    });
  });

  openCreateConsultation() {
    this.showCreate.set(true);
  }

  closeCreateConsultation() {
    this.showCreate.set(false);
  }

  onCreateFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.docFile.set(input.files?.[0] ?? null);
  }

  private toBackendType(type: ConsultationListItem['type']) {
    const map: Record<ConsultationListItem['type'], string> = {
      Embauche: 'EMBAUCHE',
      Périodique: 'PERIODIQUE',
      Reprise: 'REPRISE',
      Soin: 'SOIN',
      Spontanée: 'SPONTANEE',
    };
    return map[type];
  }

  private toUiType(type: string): ConsultationListItem['type'] {
    const map: Record<string, ConsultationListItem['type']> = {
      EMBAUCHE: 'Embauche',
      PERIODIQUE: 'Périodique',
      REPRISE: 'Reprise',
      SOIN: 'Soin',
      SPONTANEE: 'Spontanée',
    };
    return map[type] ?? 'Soin';
  }

  private extractMedicalSummary(detailsRaw: any) {
    let details: any = {};
    try {
      details = typeof detailsRaw === 'string' ? JSON.parse(detailsRaw) : (detailsRaw ?? {});
    } catch {
      details = {};
    }
    const tension = details?.tension ?? {};
    const conclusionObj = details?.conclusion ?? {};
    const conclusion: ConsultationListItem['conclusion'] =
      conclusionObj?.apte === false ? 'Inapte temporaire' :
      conclusionObj?.apte === true ? 'Apte' :
      'À revoir';
    return {
      bp: tension?.systolique && tension?.diastolique ? `${tension.systolique}/${tension.diastolique}` : '-',
      weight: details?.poids ?? '-',
      conclusion,
    };
  }

  async createConsultation() {
    const payload = this.form();
    if (!payload.employeeId) {
      this.feedback.error('Employee ID is required.');
      return;
    }
    this.creating.set(true);
    try {
      const details: any = {
        diagnostic: payload.diagnostic,
        poids: payload.poids || null,
        taille: payload.taille || null,
        tension: {
          systolique: payload.tensionSystolique || null,
          diastolique: payload.tensionDiastolique || null,
        },
        examens_speciaux: payload.examensSpeciaux || '',
        conclusion: {
          apte: payload.apte,
          inapte_precision: payload.inaptePrecision || '',
          inapte_definitif: payload.inapteDefinitif,
          reclassification: payload.reclassification || '',
        },
        traitements_prescrits: this.rx.treatmentPayload(),
      };
      const created = await firstValueFrom(this.api.createConsultation({
        employeeId: Number(payload.employeeId),
        medecinId: 1,
        type: this.toBackendType(payload.type),
        dateConsultation: payload.date,
        poids: payload.poids ? Number(payload.poids) : null,
        taille: payload.taille ? Number(payload.taille) : null,
        details: JSON.stringify(details),
      }));

      if (this.docFile()) {
        await firstValueFrom(this.api.uploadDocument(this.docFile()!, payload.employeeId, created?.id));
      }

      this.rx.clear();
      this.docFile.set(null);
      this.form.set({
        employeeId: '',
        type: 'Spontanée',
        date: new Date().toISOString().slice(0, 10),
        diagnostic: '',
        poids: '',
        taille: '',
        tensionSystolique: '',
        tensionDiastolique: '',
        conclusion: 'Apte',
        apte: true,
        inaptePrecision: '',
        inapteDefinitif: false,
        reclassification: '',
        examensSpeciaux: '',
      });
      this.feedback.success('Consultation created successfully.');
      this.closeCreateConsultation();
      await this.load();
    } catch {
      this.feedback.error('Failed to create consultation.');
    } finally {
      this.creating.set(false);
    }
  }

  async openDocuments(c: ConsultationListItem) {
    this.selectedConsultation.set(c);
    this.showDocs.set(true);
    await this.refreshDocuments();
  }

  closeDocuments() {
    this.showDocs.set(false);
    this.selectedConsultation.set(null);
    this.documents.set([]);
    this.docFile.set(null);
  }

  async refreshDocuments() {
    const c = this.selectedConsultation();
    if (!c) return;
    try {
      const docs = await firstValueFrom(this.api.consultationDocuments(c.id));
      this.documents.set(Array.isArray(docs) ? docs : []);
    } catch {
      this.feedback.error('Unable to load consultation documents.');
    }
  }

  onDocsFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.docFile.set(input.files?.[0] ?? null);
  }

  async uploadDocumentForConsultation() {
    const c = this.selectedConsultation();
    if (!c || !this.docFile()) return;
    try {
      await firstValueFrom(this.api.uploadDocument(this.docFile()!, c.employeeId, c.id));
      this.feedback.success('Document uploaded.');
      this.docFile.set(null);
      await this.refreshDocuments();
    } catch {
      this.feedback.error('Document upload failed.');
    }
  }

  async downloadDocument(doc: any) {
    try {
      const blob = await firstValueFrom(this.api.downloadDocument(doc.id));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.nomFichier ?? `document-${doc.id}`;
      a.click();
      URL.revokeObjectURL(url);
      this.feedback.success('Document downloaded.');
    } catch {
      this.feedback.error('Document download failed.');
    }
  }

  async deleteDocument(doc: any) {
    try {
      await firstValueFrom(this.api.deleteDocument(doc.id));
      this.feedback.success('Document deleted.');
      await this.refreshDocuments();
    } catch {
      this.feedback.error('Document delete failed (role may be restricted).');
    }
  }

  updateForm(key: string, value: any) {
    this.form.update(f => ({ ...f, [key]: value }));
  }
}
