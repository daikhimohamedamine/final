import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../../shared/icon.component';
import { SCHEDULE_WEEK } from '../../../data/medical-data';

@Component({
  selector: 'app-coord-schedule',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['../shared/dash-ui.scss', './schedule.component.scss'],
})
export class CoordScheduleComponent {
  week = SCHEDULE_WEEK;
}
