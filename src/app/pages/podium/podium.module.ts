import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PodiumComponent } from './podium.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PodiumComponent],
  exports: [PodiumComponent],
})
export class PodiumModule {}
