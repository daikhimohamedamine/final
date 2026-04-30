import { Injectable, signal } from '@angular/core';

export type FeedbackType = 'success' | 'error' | 'info';
export interface FeedbackMessage {
  type: FeedbackType;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private _message = signal<FeedbackMessage | null>(null);
  message = this._message.asReadonly();
  private timeoutId: any = null;

  show(type: FeedbackType, text: string, ms = 3500) {
    this._message.set({ type, text });
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this._message.set(null), ms);
  }

  success(text: string) { this.show('success', text); }
  error(text: string) { this.show('error', text, 5000); }
  info(text: string) { this.show('info', text); }
  clear() { this._message.set(null); }
}

