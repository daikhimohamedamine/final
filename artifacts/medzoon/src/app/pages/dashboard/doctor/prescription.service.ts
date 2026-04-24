import { Injectable, signal } from '@angular/core';
import { Drug } from '../../../data/medical-data';

export interface PrescribedDrug {
  drug: Drug;
  posology: string;
}

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private _items = signal<PrescribedDrug[]>([]);
  items = this._items.asReadonly();

  add(drug: Drug, posology = '') {
    if (this._items().some((p) => p.drug.set_id === drug.set_id)) return;
    this._items.update((arr) => [...arr, { drug, posology }]);
  }
  setPosology(setId: string, posology: string) {
    this._items.update((arr) => arr.map((p) => p.drug.set_id === setId ? { ...p, posology } : p));
  }
  remove(setId: string) {
    this._items.update((arr) => arr.filter((p) => p.drug.set_id !== setId));
  }
  clear() { this._items.set([]); }
}
