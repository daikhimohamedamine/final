import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { IconComponent } from '../../shared/icon.component';
import { ROLE_LABELS } from '../../auth/auth.types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  error = signal<string | null>(null);
  loading = signal(false);
  ROLE_LABELS = ROLE_LABELS;

  demos = this.auth.demoAccounts();

  fill(email: string, password: string) {
    this.email.set(email);
    this.password.set(password);
    this.error.set(null);
  }

  submit(event: Event) {
    event.preventDefault();
    this.error.set(null);
    this.loading.set(true);
    const result = this.auth.signIn(this.email(), this.password());
    this.loading.set(false);
    if (!result.ok) {
      this.error.set(result.error);
      return;
    }
    this.router.navigateByUrl(this.auth.homeForRole(result.user.role));
  }
}
