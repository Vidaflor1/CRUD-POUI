import { Component } from '@angular/core';
import { PoBreadcrumb, PoNotificationService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { Owners } from './shared/interfaces/owners.model';
import { OwnersService } from './shared/services/owners.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owners',
  standalone: false,
  templateUrl: './owners.component.html',
  styleUrl: './owners.component.css'
})
export class OwnersComponent {
  actions: Array<PoPageAction> = [
    {label: 'Novo', action: this.goToFormOwner.bind(this)}
  ];
  breadcrumb: PoBreadcrumb = {
    items: [
      {label : 'Home', link: '/'},
      {label : 'Tutores'}
    ]
  };
  columns: Array<PoTableColumn> = [];
  owners: Owners = {
    items: [],
    hasNext: false,
    remainingRecords: 0
  }

  isLoading = false;
  hasNextPage = false;
  page = 1;
  textRemainingRecords: string = "";
  totalOwners: number = 0;
  constructor(private ownersService: OwnersService, private poNotificationService: PoNotificationService, private router: Router
  ){

  }
ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.setColumns();
  this.getOwners(1, 10);
}

goToFormOwner(){
  this.router.navigate(['owners/new'])
}
  setColumns(): void {
    this.columns = [
      {property: 'id', label: 'Código', type: 'link', action: (row: string)=> this.goToFormEdit(row)},
      {property: 'name', label: 'Nome'},
      {property: 'rg', label: 'RG', visible: false},
      {property: 'cpf', label: 'CPF'},
      {property: 'email', label: 'E-mail'},
      {property: 'tel1', label: 'Telefone 1'},
      {property: 'tel2', label: 'Telefone 2', visible: false},
      {property: 'pets', label: 'Pets', type: 'icon', icons:[
        {value: 'view-pet', icon: 'po-icon-eye', tooltip: 'Visualizar pets'},
        {value: 'include-pet', icon: 'po-icon-plus-circle', tooltip: 'Incluir pets'}
      ]},

    ]
  }

  goToFormEdit(id: string){
    this.router.navigate(['owners/edit', id]);
  }

  getOwners(page: number, pageSize: number){
    /*this.owners.items = [
      { id: '00001', name: 'Teste', rg: 'teste', cpf: 'teste', email: 'teste', tel1: 'teste', tel2: 'teste'}
    ]*/
   this.isLoading = true;
   this.ownersService.get(page, pageSize).subscribe({
    next: (owners: Owners) => this.onGetSuccess(owners),
    error: (error: any) => {this.poNotificationService.error('Falha ao retornar tutores'); this.isLoading = false}
   });
  }

  onGetSuccess(owners: Owners){
    if(this.owners.items.length === 0){
      this.owners.items = owners.items;
    }else{
      this.owners.items = this.owners.items.concat(owners.items);
    }

    this.isLoading = false;
    this.hasNextPage = owners.hasNext
    this.totalOwners = this.owners.items.length;
    this.textRemainingRecords = `Mostrando ${this.totalOwners} de ${this.totalOwners + owners.remainingRecords}`
  }

  showMoreItems(){
    this.page += 1;
    this.getOwners(this.page, 10);
  }
}
