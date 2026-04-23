import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  photo: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  active = signal(0);
  items: Testimonial[] = [
    {
      quote: 'Medzoon turned our binders of paper records into a living dashboard. Our annual visit completion rate jumped from 62% to 94% in the first six months.',
      name:  'Dr. Camille Dubois',
      role:  'Médecin du Travail · GroupeIndus SA',
      photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80',
    },
    {
      quote: 'The reminder engine alone is worth the subscription. We never miss a vaccination booster or a reprise visit anymore — it just runs.',
      name:  'Léa Bernard',
      role:  'Coordinatrice Santé · MetroLogistics',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      quote: 'Audit-readiness used to take a full week. With Medzoon we generate the entire compliance pack in a single click.',
      name:  'Marc Lefèvre',
      role:  'HR Director · Atelier Nord',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    },
  ];

  go(i: number) { this.active.set(i); }
}
