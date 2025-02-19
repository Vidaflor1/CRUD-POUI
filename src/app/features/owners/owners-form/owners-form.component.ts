import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PoBreadcrumb, PoDialogService, PoNotificationService, PoPageEditLiterals } from '@po-ui/ng-components';
import { OwnerForm } from '../shared/interfaces/owner-form.model';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnersService } from '../shared/services/owners.service';
import { Owner } from '../shared/interfaces/owner.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-owners-form',
  standalone: false,
  templateUrl: './owners-form.component.html',
  styleUrl: './owners-form.component.css'
})
export class OwnersFormComponent {
  ownersForm: FormGroup;
breadcrumb: PoBreadcrumb = {
    items: [
      {label : 'Home', link: '/'},
      {label : 'Tutores', link: '/owners'},
      {label: 'Novo registro'}
    ]
  };
  isLoading: boolean = false;
  isDisabledButton: boolean = false;
  ownersSubscription: Subscription = new Subscription();
  operation: string = 'post';
  title: string = '';
  customLiterals: PoPageEditLiterals = {
    saveNew: 'Salvar e Novo'
  };
  constructor(private router: Router, private ownersService: OwnersService, private poNotificationService: PoNotificationService,
    private activatedRoute: ActivatedRoute,
    private poDialogService: PoDialogService
  ) {
    this.ownersForm = new FormGroup({
      id: new FormControl('', { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      rg: new FormControl('', { nonNullable: true }),
      cpf: new FormControl('', { nonNullable: true }),
      email: new FormControl('', { nonNullable: true }),
      tel1: new FormControl('', { nonNullable: true }),
      tel2: new FormControl('', { nonNullable: true })
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.setOperation();
    this.setTitle();
    if (this.operation === 'put') {
      this.getOwner();
  }


  }
  setOperation(){
    this.operation = this.activatedRoute.snapshot.params['id'] ? 'put' : 'post';
  }

  setTitle(){
    if(this.operation ==='put'){
      this.title = 'Alterar registro';
      this.customLiterals.saveNew = 'Excluir'
    }else{
      this.title = 'Novo registro';
    }
    this.breadcrumb.items[2].label = this.title;
  }
  cancel(){
    this.ownersSubscription.unsubscribe();
    this.router.navigate(["owners"]);
  }

  save(isSaveAndNew: boolean): void {
    this.isDisabledButton = false;
    this.isLoading = true;
    this.operation === 'post' ? this.post(isSaveAndNew) : this.put(isSaveAndNew);

  }

  /*save(isSaveAndNew: boolean): void{
    this.isDisabledButton = false;
    this.isLoading = true;
    this.ownersSubscription = this.ownersService.post(this.ownersForm.value).subscribe({
      next: response => this.onSaveSuccess(response, isSaveAndNew),
      error: error => this.onSaveError(error)
    })
  } */

  onSaveSuccess(response: Owner, isSaveAndNew: boolean){
    this.isLoading = false;
    this.isDisabledButton = false;
    isSaveAndNew? this.ownersForm.reset() : this.router.navigate(['owners']);
    this.poNotificationService.success(`Registro incluído com sucesso: ${response.id}`);
  }

  onSaveError(error: any){
    this.isLoading = false;
    this.isDisabledButton = false;
    this.poNotificationService.error('Falha ao salvar registro')
  }

  getOwner(){
    this.isLoading = true;
    this.ownersService.getById(this.activatedRoute.snapshot.params['id']).subscribe({
      next: (owner: Owner) => this.onGetSuccess(owner),
      error: (error: any) => this.onGetError(error)
    });
  }

  onGetSuccess(owner: Owner){
    this.isLoading = false;
    this.ownersForm = new FormGroup({
      id: new FormControl(owner.id, { nonNullable: true }),
      name: new FormControl(owner.name, { nonNullable: true }),
      rg: new FormControl(owner.rg, { nonNullable: true }),
      cpf: new FormControl(owner.cpf, { nonNullable: true }),
      email: new FormControl(owner.email, { nonNullable: true }),
      tel1: new FormControl(owner.tel1, { nonNullable: true }),
      tel2: new FormControl(owner.tel2, { nonNullable: true })
    });
  }

  onGetError(error: any){
    this.isLoading = false;
    this.poNotificationService.error('Falha ao retornar registro');
  }

  post(isSaveAndNew: boolean){

    const formData = { ...this.ownersForm.value };

    delete formData.id;

    this.ownersSubscription = this.ownersService.post(formData).subscribe({
      next: response => this.onSaveSuccess(response, isSaveAndNew),
      error: error => this.onSaveError(error)
    });
  }

  put(isSaveAndNew: boolean){
    this.ownersSubscription = this.ownersService.put(this.ownersForm.value).subscribe({
      next: response => this.onSaveSuccess(response, isSaveAndNew),
      error: error => this.onSaveError(error)
    });
  }

  saveOrDelete(){
    if (this.operation === 'post') {
      this.save(true);
    }else{
      this.confirmDelete();
    }
  }

  confirmDelete(){
    this.poDialogService.confirm({
      title: 'Excluir tutor',
      message: 'Tem certeza que deseja excluir?',
      confirm: this.delete.bind(this)
    });
  }

  delete(){
    this.isLoading = true;
    this.isDisabledButton = true;
    this.ownersService.delete(this.activatedRoute.snapshot.params['id']).subscribe({
      next: () => this.onDeleteSuccess(),
      error: () => this.onDeleteError()
    });
  }
  onDeleteSuccess(){
    this.router.navigate(['owners']);
    this.poNotificationService.success('Registro excluido com sucesso');
  }
  onDeleteError(){
    this.isLoading = false;
    this.isDisabledButton = false;
    this.poNotificationService.error('Falha ao excluir registro');
  }
}
