import { Injectable } from '@angular/core';
import { ISignIn } from '../../interfaces/ISignIn.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  // eslint-disable-next-line no-unused-vars
  constructor(private http: HttpClient) {}

  signIn(data: ISignIn): Observable<ISignIn> {
    const url = environment.backend_api;
    return this.http.post<ISignIn>(url + '/rider/login', data);
  }
}
