import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule, PoPageModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PoModule,
    PoPageModule
  ],
  exports: [
    PoModule,
    PoPageModule,
    PoTemplatesModule
  ]
})
export class SharedModule { }
