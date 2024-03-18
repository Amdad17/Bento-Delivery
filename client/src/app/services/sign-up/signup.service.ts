import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISignup } from '../../interfaces/Isignup.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  // eslint-disable-next-line no-unused-vars
  constructor(private http: HttpClient) {}

  signUp(riderData: ISignup): Observable<ISignup> {
    const url = 'https://bento-rider.onrender.com/rider/signup';
    // const url = 'http://localhost:5000/rider/signup';
    return this.http.post<ISignup>(url, riderData);
  }
  updateProfile(riderData: ISignup): Observable<ISignup> {
    const url = 'https://bento-rider.onrender.com/rider/signup';
    // const url = 'http://localhost:5000/rider/signup';
    return this.http.put<ISignup>(url, riderData);
  }
}
