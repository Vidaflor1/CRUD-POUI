import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Owners } from '../interfaces/owners.model';
import { environment } from '../../../../../environments/environment.prod';
import { Owner } from '../interfaces/owner.model';

@Injectable({
  providedIn: 'root'
})
export class OwnersService {

  constructor(
    private httpClient: HttpClient
  ) { }

  get(page: number, pageSize: number, filter?: string, fields?: string, sort?: string): Observable<Owners>{
    const parametros = new HttpParams().append('page', page)
    .append('pageSize', pageSize)
    .append('FILTER', filter ? filter : '')
    .append('FIELDS', fields ? fields : '')
    .append('SORT', sort ? sort: 'id')
    return this.httpClient.get<Owners>(environment.ownersAPI, { params: parametros});
  }

  post(body: Owner): Observable<Owner>{
    return this.httpClient.post<Owner>(environment.ownersAPI, body);
  }

  getById(id: string): Observable<Owner>{
    return this.httpClient.get<Owner>(`${environment.ownersAPI}/${id}`);
  }

  put(body: Owner): Observable<Owner>{
    return this.httpClient.put<Owner>(`${environment.ownersAPI}/${body.id}`, body);
  }

  delete(id: string): Observable<any>{
    return this.httpClient.delete<any>(`${environment.ownersAPI}/${id}`);
  }
}
