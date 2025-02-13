import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  apiRoot: string = environment.apiRoot;
  private _token: string = '';

  constructor(private http: HttpClient, private _snackbar: SnackbarService) {
    this.token = localStorage.getItem('token') as string;
  }

  handleError() {
    return catchError((err) => {
      console.error(err);
      return throwError(() => err?.error);
    });
  }

  get token(): string {
    if (this._token) {
      return this._token;
    } else {
      this._snackbar.error('Token expired. Please login again.');
      throw new Error('Token expired. Please login again.');
    }
  }

  set token(token: string) {
    this._token = token;
  }

  // ========== AUTH APIS ========== //
  signIn(body: any): Observable<any> {
    return this.http.post(`${this.apiRoot}/auth/signin`, body).pipe(
      this.handleError(),
      tap((response: any) => {
        if (response?.body?.token) {
          this.token = response?.body?.token as string;
        }
      })
    );
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

  // ========== CATALOGUE APIS ========== //

  getCatalogues(): Observable<any> {
    return this.http.get(`${this.apiRoot}/catalogue`);
  }

  createCatalogue(catalogue: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .post(`${this.apiRoot}/catalogue`, catalogue, { headers })
      .pipe(this.handleError());
  }

  updateCatalogue(catalogue: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .put(`${this.apiRoot}/catalogue`, catalogue, { headers })
      .pipe(this.handleError());
  }

  deleteCatalogue(catalogueId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .delete(`${this.apiRoot}/catalogue`, {
        headers,
        params: { _id: catalogueId },
      })
      .pipe(this.handleError());
  }

  // ========== CATEGORY APIS ========== //

  getCatalogueCatagories(): Observable<any> {
    return this.http.get(`${this.apiRoot}/category`);
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

  // ========== SIZE APIS ========== //

  getCatalogueSizes(): Observable<any> {
    return this.http.get(`${this.apiRoot}/size`);
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

  // ========== SERIES APIS ========== //

  getCatalogueSeries(): Observable<any> {
    return this.http.get(`${this.apiRoot}/series`);
  }

  createSeries(series: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .post(`${this.apiRoot}/series`, series, { headers })
      .pipe(this.handleError());
  }

  updateSeries(series: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .put(`${this.apiRoot}/series`, series, { headers })
      .pipe(this.handleError());
  }

  deleteSeries(seriesId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this.http
      .delete(`${this.apiRoot}/series`, {
        headers,
        params: { _id: seriesId },
      })
      .pipe(this.handleError());
  }

  // ========== UPLOAD APIS ========== //
  uploadImage(image: File): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    const formData = new FormData();
    formData.append('file', image);

    return this.http
      .post(`${this.apiRoot}/upload/uploadImage`, formData, { headers })
      .pipe(this.handleError());
  }

  uploadDocument(document: File): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.token,
    });

    const formData = new FormData();
    formData.append('file', document);

    return this.http
      .post(`${this.apiRoot}/upload/uploadDocument`, formData, { headers })
      .pipe(this.handleError());
  }
}
