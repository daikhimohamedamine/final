import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon.component';
import { DRUGS, Drug } from '../../../data/medical-data';
import { PrescriptionService } from './prescription.service';

interface Message {
  role: 'user' | 'assistant';
  text?: string;
  suggestions?: { drug: Drug; reason: string; warning?: string }[];
}

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

  open = signal(false);
  input = signal('');
  thinking = signal(false);
  messages = signal<Message[]>([
    {
      role: 'assistant',
      text: 'Bonjour Dr. Dubois. Décrivez les symptômes du patient — j\'analyse le dossier et je propose des traitements adaptés.',
    },
  ]);

  badgeCount = computed(() => this.rx.items().length);

  toggle() { this.open.update((v) => !v); }

  send() {
    const text = this.input().trim();
    if (!text || this.thinking()) return;
    this.input.set('');
    this.messages.update((m) => [...m, { role: 'user', text }]);
    this.thinking.set(true);

    setTimeout(() => {
      const recos = this.recommend(text);
      const reply: Message = recos.length
        ? {
            role: 'assistant',
            text: `D'après les symptômes décrits et le dossier patient, je suggère ${recos.length} traitement(s) :`,
            suggestions: recos,
          }
        : { role: 'assistant', text: 'Je n\'ai pas trouvé de correspondance directe. Reformulez avec d\'autres mots-clés (ex. : « toux grasse, fièvre, allergie pénicilline »).' };
      this.messages.update((m) => [...m, reply]);
      this.thinking.set(false);
    }, 850);
  }

  prescribe(drug: Drug) {
    this.rx.add(drug);
  }

  private recommend(query: string): { drug: Drug; reason: string; warning?: string }[] {
    const q = query.toLowerCase();
    const allergyPenicillin = /allerg.*p[ée]nicill|allerg.*amoxicill/.test(q);
    const hypertension = /hta|hypertension|tension|140|150|160/.test(q);

    const scored = DRUGS.map((d) => {
      let score = 0;
      const reasons: string[] = [];
      for (const k of d.sicknesses) {
        if (q.includes(k.toLowerCase())) { score += 3; reasons.push(`indiqué pour « ${k} »`); }
      }
      if (/toux|expector|bronch/.test(q) && d.category === 'Respiratory') { score += 2; reasons.push('voie respiratoire'); }
      if (/fièvre|fievre|douleur|c[ée]phal/.test(q) && d.category === 'Analgesic') { score += 2; reasons.push('antipyrétique/antalgique'); }
      if (/angine|sinus|otite|infection/.test(q) && d.category === 'Antibiotic') { score += 2; reasons.push('antibiothérapie'); }
      if (hypertension && d.category === 'Cardiovascular') { score += 3; reasons.push('contrôle de la tension artérielle'); }

      let warning: string | undefined;
      if (allergyPenicillin && /amoxicill/i.test(d.drug_name)) {
        warning = '⚠️ Contre-indiqué — allergie connue à la pénicilline.';
        score = -1;
      }
      return { drug: d, score, reason: reasons[0] ?? 'pertinence faible', warning };
    });

    return scored
      .filter((r) => r.score > 0 || r.warning)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ drug, reason, warning }) => ({ drug, reason, warning }));
  }
}
