import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TimerComponent } from './timer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TimerComponent],
  exports: [TimerComponent],
})
export class TimerModule {}
