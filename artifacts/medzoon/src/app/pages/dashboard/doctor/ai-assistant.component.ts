import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { Drug } from '../../../core/models/models';
import { PrescriptionService } from './prescription.service';
import { BackendApiService } from '../../../core/api/backend-api.service';
import { MedAssistService, ChatMessageDto, StreamEvent } from '../../../core/api/medassist.service';
import { firstValueFrom } from 'rxjs';

interface ToolStep {
  id: number;
  tool: string;
  status: 'running' | 'success' | 'error';
  label: string;
  detail?: string;
  data?: unknown;
}

interface Message {
  role: 'user' | 'assistant';
  text?: string;
  suggestions?: { drug: Drug; reason: string; warning?: string }[];
  isDisclaimer?: boolean;
  steps?: ToolStep[];
  thinking?: string;
}

const DISCLAIMER_TEXT = "⚠️ Avertissement : Cet assistant IA est un outil d'aide à la décision réservé aux professionnels. Il ne remplace pas l'expertise du praticien et ne pose aucun diagnostic médical définitif.";

const TOOL_LABELS_FR: Record<string, string> = {
  get_patient_history: 'Récupération du dossier patient',
  search_medical_library: 'Recherche dans la base de médicaments',
  generate_prescription: 'Génération de l\'ordonnance',
  recommend_doctor: 'Sélection d\'un praticien',
  check_drug_interactions: 'Vérification des interactions médicamenteuses',
  generate_soap_note: 'Rédaction de la note SOAP',
};

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss',
})
export class AiAssistantComponent {
  private rx = inject(PrescriptionService);
  private api = inject(BackendApiService);
  private medAssist = inject(MedAssistService);
  private drugs = signal<Drug[]>([]);
  private nextStepId = 1;

  open = signal(false);
  input = signal('');
  thinking = signal(false);
  liveSteps = signal<ToolStep[]>([]);
  liveResponse = signal<string>('');

  messages = signal<Message[]>([
    {
      role: 'assistant',
      text: "Bonjour ! Je suis MedAssist, votre assistant clinique IA. Je peux interroger les dossiers patients, vérifier les interactions médicamenteuses, générer des ordonnances et des notes SOAP.",
    },
    {
      role: 'assistant',
      text: DISCLAIMER_TEXT,
      isDisclaimer: true
    }
  ]);

  badgeCount = computed(() => this.rx.items().length);

  toggle() { this.open.update((v) => !v); }

  newConversation() {
    this.medAssist.resetSession();
    this.messages.set([
      { role: 'assistant', text: 'Nouvelle conversation. Comment puis-je vous aider ?' },
      { role: 'assistant', text: DISCLAIMER_TEXT, isDisclaimer: true },
    ]);
  }

  constructor() {
    this.loadDrugs();
  }

  private async loadDrugs() {
    try {
      const res = await firstValueFrom(this.api.drugs());
      const rows = Array.isArray((res as any)?.content) ? (res as any).content : Array.isArray(res) ? res : [];
      this.drugs.set(rows.map((d: any) => ({
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

  send() {
    const text = this.input().trim();
    if (!text || this.thinking()) return;
    this.input.set('');
    this.messages.update((m) => [...m, { role: 'user', text }]);
    this.thinking.set(true);
    this.liveSteps.set([]);
    this.liveResponse.set('');
    this.streamChat(text);
  }

  private streamChat(text: string) {
    const history: ChatMessageDto[] = this.messages()
      .filter(m => !m.isDisclaimer)
      .filter(m => (m.text ?? '').trim().length > 0)
      .map(m => ({ role: m.role, content: m.text! }));
    // Drop the just-pushed user turn — the server will add it itself.
    history.pop();

    const sub = this.medAssist.stream(text, history).subscribe({
      next: (evt) => this.handleEvent(evt),
      error: (err) => this.finalize(err?.message ?? 'Erreur réseau', true),
      complete: () => sub.unsubscribe(),
    });
  }

  private handleEvent(evt: StreamEvent) {
    switch (evt.type) {
      case 'tool_call': {
        const step: ToolStep = {
          id: this.nextStepId++,
          tool: evt.tool,
          status: 'running',
          label: TOOL_LABELS_FR[evt.tool] ?? evt.tool,
          detail: this.summarizeInput(evt.tool, evt.input),
        };
        this.liveSteps.update((steps) => [...steps, step]);
        break;
      }
      case 'tool_result': {
        this.liveSteps.update((steps) => steps.map((s, i, arr) => {
          if (i !== arr.length - 1 || s.tool !== evt.tool) return s;
          return {
            ...s,
            status: evt.success ? 'success' : 'error',
            detail: evt.success ? this.summarizeResult(evt.tool, evt.data) : (evt.error ?? 'Échec'),
            data: evt.data,
          };
        }));
        break;
      }
      case 'thinking':
        // attach to a transient state so the final assistant bubble can show it collapsed
        (this as any)._lastThinking = evt.text;
        break;
      case 'response':
        this.liveResponse.set(evt.text);
        break;
      case 'done':
        this.finalize(this.liveResponse(), false);
        break;
      case 'error':
        this.finalize(`Erreur : ${evt.message}`, true);
        break;
    }
  }

  private finalize(text: string, error: boolean) {
    const steps = this.liveSteps();
    const thinking = (this as any)._lastThinking as string | undefined;
    (this as any)._lastThinking = undefined;
    this.messages.update((m) => [
      ...m,
      {
        role: 'assistant',
        text: text || (error ? 'Erreur inconnue.' : '...'),
        steps: steps.length ? steps : undefined,
        thinking: thinking,
      },
    ]);
    this.liveSteps.set([]);
    this.liveResponse.set('');
    this.thinking.set(false);
  }

  private summarizeInput(tool: string, input: Record<string, unknown>): string | undefined {
    if (!input) return undefined;
    switch (tool) {
      case 'get_patient_history':
        return input['patient_id'] != null ? `Patient #${input['patient_id']}` : undefined;
      case 'search_medical_library':
        return input['query'] ? `« ${input['query']} »` : undefined;
      case 'generate_prescription': {
        const meds = Array.isArray(input['medications']) ? (input['medications'] as any[]) : [];
        return meds.length ? `${meds.length} médicament(s)` : undefined;
      }
      case 'recommend_doctor': {
        const sym = Array.isArray(input['symptoms']) ? (input['symptoms'] as string[]).join(', ') : '';
        return sym || undefined;
      }
      case 'check_drug_interactions': {
        const drugs = Array.isArray(input['new_drugs']) ? (input['new_drugs'] as string[]) : [];
        return drugs.length ? drugs.join(', ') : undefined;
      }
      case 'generate_soap_note':
        return typeof input['chief_complaint'] === 'string' ? String(input['chief_complaint']) : undefined;
      default:
        return undefined;
    }
  }

  private summarizeResult(tool: string, data: unknown): string | undefined {
    if (!data || typeof data !== 'object') return undefined;
    const d = data as Record<string, any>;
    switch (tool) {
      case 'get_patient_history':
        return d['profile'] ? `${d['profile'].prenom ?? ''} ${d['profile'].nom ?? ''}`.trim() : 'OK';
      case 'search_medical_library':
        return typeof d['count'] === 'number' ? `${d['count']} résultat(s)` : 'OK';
      case 'generate_prescription':
        return d['prescription_id'] != null ? `Ordonnance #${d['prescription_id']}` : 'OK';
      case 'recommend_doctor': {
        const docs = Array.isArray(d['doctors']) ? d['doctors'] : [];
        return `${docs.length} praticien(s) — ${d['specialty_matched'] ?? ''}`.trim();
      }
      case 'check_drug_interactions': {
        const safe = d['safe_to_prescribe'];
        const interactions = Array.isArray(d['interactions']) ? d['interactions'].length : 0;
        const conflicts = Array.isArray(d['allergy_conflicts']) ? d['allergy_conflicts'].length : 0;
        if (safe) return interactions || conflicts ? `${interactions + conflicts} avertissement(s) mineur(s)` : 'Aucun conflit';
        return `BLOQUÉ — ${interactions + conflicts} conflit(s) majeur(s)`;
      }
      case 'generate_soap_note':
        return d['record_id'] != null ? `Note SOAP #${d['record_id']}` : 'OK';
      default:
        return 'OK';
    }
  }

  prescribe(drug: Drug) {
    this.rx.add(drug);
  }

  toggleStepData(step: ToolStep) {
    (step as any)._expanded = !(step as any)._expanded;
    // trigger refresh
    this.messages.update((m) => [...m]);
  }

  isExpanded(step: ToolStep): boolean {
    return !!(step as any)._expanded;
  }

  formatStepData(step: ToolStep): string {
    try { return JSON.stringify(step.data, null, 2); } catch { return String(step.data); }
  }
}
