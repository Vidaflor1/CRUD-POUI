import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnersComponent } from './owners.component';
import { OwnersFormComponent } from './owners-form/owners-form.component';

const routes: Routes = [
  {path: '', component: OwnersComponent},
  {path: 'new', component: OwnersFormComponent},
  {path: 'edit/:id', component: OwnersFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnersRoutingModule { }
