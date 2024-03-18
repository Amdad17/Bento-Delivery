import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RiderServiceService {
  privateUrl = 'https://bento-rider.onrender.com';
  // privateUrl = 'http://localhost:5000';
  constructor(private http: HttpClient) {}
  // eslint-disable-next-line
  updateRiderInfo(riderId: string, formData: any): Observable<any> {
    const url = `${this.privateUrl}/rider/editRider/${riderId}`;
    return this.http.put(url, formData);
  }
}
