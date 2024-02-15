import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './truncate.pipe'; // Import your pipe here

@NgModule({
  declarations: [
    TruncatePipe // Declare your pipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TruncatePipe // Export your pipe
  ]
})
export class PipesModule { }