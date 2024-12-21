import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { JoinComponent } from './join.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [JoinComponent],
  exports: [JoinComponent],
})
export class JoinModule {}
