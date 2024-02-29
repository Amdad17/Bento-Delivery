import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import mapboxgl from 'mapbox-gl';
import { ApiResponse } from '../interfaces/gettingRoute.interface';
import { environment } from '../../environments/environment';
import { RiderInfo } from '../interfaces/IRider.interface';
import { IHub } from '../interfaces/IHub.interface';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  privateUrl = 'http://localhost:5000';
  // eslint-disable-next-line no-unused-vars
  constructor(private http: HttpClient) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  getRoute(
    map: mapboxgl.Map,
    start: number[],
    end: number[],
  ): Observable<ApiResponse> {
    const url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    return this.http.get<ApiResponse>(url);
  }

  getDoorwayRoute(
    map: mapboxgl.Map,
    start: number[],
    end: number[],
  ): Observable<ApiResponse> {
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    return this.http.get<ApiResponse>(url);
  }

  getOrder(id: string): Observable<RiderInfo> {
    const url = `${this.privateUrl}/rider/findRider/${id}`;
    console.log('fetching');
    return this.http.get<RiderInfo>(url);
  }

  getAllHubs(): Observable<IHub> {
    const url = `${this.privateUrl}/hub/get-all-hubs`;
    return this.http.get<IHub>(url);
  }

  assignHub(id: string | null): Observable<IHub> {
    const url = `${this.privateUrl}/hub/assign-rider/${id}`;
    // eslint-disable-next-line
    return this.http.post<any>(url, null);
  }

  removeFromHub(hubId: string | undefined, riderId: string): Observable<IHub> {
    const url = `${this.privateUrl}/hub/remove-rider/hub/${hubId}/rider/${riderId}`;
    // eslint-disable-next-line
    return this.http.put<any>(url, null);
  }
  logout(riderId: string): Observable<IHub> {
    const url = `${this.privateUrl}/rider/editRider/${riderId}`;
    // eslint-disable-next-line
    return this.http.put<any>(url, { hubId: null, onlineStatus: false });
  }
}
