import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { IResponse } from '../interfaces/response-i';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  apiRoot: string = environment.apiRoot;
  token!: string;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token') as string;
  }

  handleError() {
    return catchError((err) => {
      return throwError(() => err?.error);
    });
  }

  getCatalogues(): Observable<any> {
    return this.http.get(`${this.apiRoot}/catalogue`);
  }

  getCatalogueCatagories(): Observable<any> {
    return this.http.get(`${this.apiRoot}/category`);
  }

  getCatalogueSizes(): Observable<any> {
    return this.http.get(`${this.apiRoot}/size`);
  }

  getCatalogueSeries(): Observable<any> {
    return this.http.get(`${this.apiRoot}/series`);
  }

  signIn(body: any): Observable<any> {
    return this.http
      .post(`${this.apiRoot}/auth/signin`, body)
      .pipe(this.handleError());
  }

  signUp(body: any): Observable<any> {
    return this.http
      .post(`${this.apiRoot}/auth/signup`, body)
      .pipe(this.handleError());
  }

  activateAccount(token: string): Observable<any> {
    return this.http
      .get(`${this.apiRoot}/auth/activate`, {
        headers: { Authorization: token },
      })
      .pipe(this.handleError());
  }

  createCategory(category: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .post(`${this.apiRoot}/category`, category, { headers })
      .pipe(this.handleError());
  }

  updateCategory(category: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .put(`${this.apiRoot}/category`, category, { headers })
      .pipe(this.handleError());
  }

  deleteCategory(categoryId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .delete(`${this.apiRoot}/category`, {
        headers,
        params: { _id: categoryId },
      })
      .pipe(this.handleError());
  }

  createSize(size: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .post(`${this.apiRoot}/size`, size, { headers })
      .pipe(this.handleError());
  }

  updateSize(size: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .put(`${this.apiRoot}/size`, size, { headers })
      .pipe(this.handleError());
  }

  deleteSize(sizeId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .delete(`${this.apiRoot}/size`, {
        headers,
        params: { _id: sizeId },
      })
      .pipe(this.handleError());
  }
}
