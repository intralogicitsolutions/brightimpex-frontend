import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IResponse } from '../interfaces/response-i';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}
  apiRoot: string = environment.apiRoot;

  getCatalogues(): Observable<any> {
    return this.http.get(`${this.apiRoot}/catalogue`);
  }

  getCatalogueCatagories(): Observable<any> {
    return this.http.get(`${this.apiRoot}/category`);
  }

  getCatalogueSizes(): Observable<any> {
    return this.http.get(`${this.apiRoot}/size`);
  }
}
