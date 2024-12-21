import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GameComponent } from './game.component';
import { TimerModule } from '../../components/timer/timer.module';

@NgModule({
  imports: [CommonModule, TimerModule],
  declarations: [GameComponent],
  exports: [GameComponent],
})
export class GameModule {}
