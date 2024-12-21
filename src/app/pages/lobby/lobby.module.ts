import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LobbyComponent } from './lobby.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [LobbyComponent],
  exports: [LobbyComponent],
})
export class LobbyModule {}
