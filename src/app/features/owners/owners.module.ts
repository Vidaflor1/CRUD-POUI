import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { OwnersComponent } from './owners.component';
import { OwnersRoutingModule } from './owners-routing.module';
import { OwnersFormComponent } from './owners-form/owners-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [OwnersComponent, OwnersFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    OwnersRoutingModule,
    ReactiveFormsModule
  ]
})
export class OwnersModule { }
