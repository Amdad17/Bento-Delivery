/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Feature, FeatureCollection, LineString } from 'geojson';
import { MapService } from '../../services/map/map.service';
import { ApiResponse } from '../../interfaces/gettingRoute.interface';
import * as turf from '@turf/turf';
import { environment } from '../../../environments/environment';
import { concatMap, switchMap, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IAllRoutes,
  IDoorwayRoutes,
  IRiderStates,
  ISequenceRoutes,
  RiderInfo,
} from '../../interfaces/IRider.interface';
import {
  createCustomElement,
  createCustomMarkerElement,
  doorwaysData,
  processSequenceData,
  processStateData,
  sortingSequence,
  interpolateCoordinates,
} from '../../utlis/utils';
import { NzMessageService } from 'ng-zorro-antd/message';
import io from 'socket.io-client';
import { of } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit {
  array = ['hridoy', 'nazim', 'shahriar', 'amdad'];
  //For rider Profile
  visibleForProfile: boolean = false;
  openForProfile(): void {
    this.visibleForProfile = true;
  }

  closeForProfile(): void {
    this.visibleForProfile = false;
  }
  //For rider histtory

  visibleForRideHistory: boolean = false;
  openForRideHistory(): void {
    this.visibleForRideHistory = true;
  }

  closeForRideHistory(): void {
    this.visibleForRideHistory = false;
  }

  //For rider Notification
  visibleForRideNotification: boolean = false;
  openForRideNotification(): void {
    this.visibleForRideNotification = true;
  }

  closeForRideNotification(): void {
    this.visibleForRideNotification = false;
  }

  //For signIn
  visibleForSignin: boolean = false;
  openForSignin(): void {
    this.visibleForSignin = true;
  }

  closeForSignin(): void {
    this.visibleForSignin = false;
  }

  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  logout(riderId: string | undefined) {
    if (riderId) {
      this.logoutService.logout(riderId).subscribe(
        (response) => {
          console.log('Logout successful:', response);
          this.routerForNavigate.navigate(['']);
        },
        (error) => {
          console.error('Error logging out:', error);
        },
      );
    } else {
      console.warn('Invalid rider ID.');
    }
  }

  // For mapBox
  riderInfo!: RiderInfo;
  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
  endMarker!: mapboxgl.Marker;
  style = 'mapbox://styles/mapbox/streets-v12';

  usersCurrentLatitude: number = 0;
  usersCurrentLongitude: number = 0;

  selectedLatitude!: number;
  selectedLongitude!: number;

  start: number[] = [];
  end: number[] = [];
  oldStart: number[] = [];

  compare: number[] = [0, 0];

  allCoords: [number, number][] = [];
  allDoorwayCoords: [number, number][] = [];
  distanceBetweenPoints: number = 0.1;
  rotation: number = 0;
  bearings: number[] = [];
  route: [number, number][] = [];
  secondRoute: [number, number][] = [];
  el = document.createElement('div');
  isWalkingThrough = false;
  routeDisplayed = false;
  moveInterval: any = null;
  mergedRoute: [number, number][] = [];

  previousMarker: mapboxgl.Marker | null = null;

  riderId = '';

  lat: number = 51.515419;
  lng: number = -0.141099;

  riderLat: number = 0;
  riderLng: number = 0;

  allroutes: Array<number | undefined>[] = [];
  secondroute: number[] = [];

  typeStates: string = '';

  restaurant1!: mapboxgl.Marker;
  restaurant2!: mapboxgl.Marker;
  customer1!: mapboxgl.Marker;
  customer2!: mapboxgl.Marker;
  allPoints: string[] = [];

  states: IRiderStates[] = [];

  allRoutesWithType: IAllRoutes = {};

  dynamicState: IAllRoutes = {};

  doorway: IDoorwayRoutes = {};

  sequence: ISequenceRoutes = {};

  popupContent = '1st Customer';
  popup = new mapboxgl.Popup({ offset: 25 }).setHTML(this.popupContent);

  constructor(
    private mapboxService: MapService,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private logoutService: MapService,
    private routerForNavigate: Router,
  ) {}

  ngOnInit(): void {
    this.initializeMapAndMarker();
    this.connectToSocket();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.usersCurrentLatitude = latitude;
          this.usersCurrentLongitude = longitude;
          this.start = [this.lng, this.lat];
          this.oldStart = this.start;
          if (latitude && longitude) {
            this.getRiderInfo();
            this.marker.setLngLat([this.lng, this.lat]);
            if (this.start !== this.compare) {
              this.map.flyTo({
                center: [this.lng, this.lat],
                zoom: 13,
                essential: true,
              });
            }
          }
        },
        (error) => {
          const errorMessage = `Geolocation error occurred: ${error.message}`;
          throw new Error(errorMessage);
        },
      );
    }
  }

  //For Rider Information and Order Information
  getRiderInfo() {
    this.router.params
      .pipe(
        switchMap((params) => {
          this.riderId = params['riderId'];
          return this.mapboxService.getOrder(this.riderId);
        }),
      )
      .subscribe((data: RiderInfo) => {
        this.riderInfo = data;
        this.riderLng = this.riderInfo.rider.currentLatLong.longitude;
        this.riderLat = this.riderInfo.rider.currentLatLong.latitude;
        if (this.riderInfo.rider.hubId !== null) {
          if (
            this.riderInfo.rider.hubLatLong?.longitude &&
            this.riderInfo.rider.hubLatLong
          ) {
            const hubEnd = [
              this.riderInfo.rider.hubLatLong.longitude,
              this.riderInfo.rider.hubLatLong.latitude,
            ];
            if (hubEnd) {
              this.typeStates = 'Hub';
              this.popupContent = 'Hub';
              this.gettingHubRoute(hubEnd);
              if (this.allCoords) {
                this.walkThroughRoute(this.allCoords);
                this.calculateRotation(this.allCoords);
              }
            }
          }
        } else {
          const processing = processStateData(data.rider.riderStates);
          this.doorway = doorwaysData(data.rider.riderStates);
          this.processDoorwayRoute();
          this.sequence = processSequenceData(data.rider.routeSequence);
          let stateIndex = 1;
          processing.forEach((stateData) => {
            if (stateData.type && stateData.coordinates) {
              const newState = {
                type: stateData.type,
                coordinates: stateData.coordinates as [number, number],
              };
              const key = `state${stateIndex}`;
              this.dynamicState[key] = newState;
              stateIndex++;
            }
          });
          if (this.dynamicState) {
            const sortedState: IAllRoutes = sortingSequence(
              this.sequence,
              this.dynamicState,
            );
            const states = Object.values(sortedState);
            //Dynamically getting the shortest route
            for (const state of states) {
              const start = state.coordinates;
              this.typeStates = state.type;
              this.popupContent = state.type;
              if (start[0] && start[1]) {
                this.end = [start[0], start[1]];
                this.displayAllRoutes();
              }
            }
            if (this.allCoords) {
              //To make the Rider walkthrough  the route after displaying all routes
              this.walkThroughRoute(this.allCoords);
              this.calculateRotation(this.allCoords);
            }
          }
        }
      });
  }

  //To Initialize Map and Marker
  initializeMapAndMarker() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      center: [this.usersCurrentLongitude, this.usersCurrentLatitude],
      zoom: 1,
    });

    this.marker = new mapboxgl.Marker({
      element: createCustomMarkerElement(
        '../../assets/images/rider.png',
        this.rotation,
      ),

      draggable: false,
    })
      .setLngLat([this.usersCurrentLongitude, this.usersCurrentLatitude])
      .addTo(this.map);
  }
  //Merging All the Routes
  gettingRoute(end: number[]) {
    end = this.end;
    this.mapboxService
      .getRoute(this.map, this.oldStart, this.end)
      .pipe(
        tap((data: ApiResponse) => {
          console.log('Received route from tap:', data);
        }),
        concatMap((data: ApiResponse) => {
          this.route = data.routes[0].geometry.coordinates;
          this.route.forEach((element) => {
            this.mergedRoute.push(element);
          });
          return of(data);
        }),
      )
      .subscribe(() => {
        const geojson: Feature<LineString> = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: this.mergedRoute,
          },
        };

        if (this.map.getSource('route')) {
          (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(
            geojson,
          );
        } else {
          this.map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: geojson,
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5,
              'line-opacity': 0.75,
            },
          });
        }
        this.allCoordinates(this.route, this.distanceBetweenPoints);
      });
    this.oldStart = end;
  }
  // To make a simulation of a Rider walking through the route
  walkThroughRoute(routeCoordinates: [number, number][]) {
    let currentIndex = 0;
    let currentRoute = 1;
    let currentBearing = 1;
    this.moveInterval = null;

    const calculateMoveInterval = (Index: number) => {
      const currentCoordinate = turf.point(routeCoordinates[Index]);
      const nextCoordinate = turf.point(routeCoordinates[Index + 1]);
      const distance = turf.distance(currentCoordinate, nextCoordinate);
      const interval = distance * 1000 * 60;
      return interval;
    };

    const moveMarkerAlongRoute = () => {
      const nextCoordinate = routeCoordinates[currentIndex + 1];
      if (!nextCoordinate) {
        clearInterval(this.moveInterval!);
        return;
      }

      this.rotation = this.bearings[currentBearing];
      this.updateRotate(this.rotation);
      this.marker.setRotation(this.rotation);

      const [nextLongitude, nextLatitude] = nextCoordinate;

      this.marker.setLngLat([nextLongitude, nextLatitude]);
      this.start = nextCoordinate;
      this.oldStart = nextCoordinate;
      const passedCoordinates = routeCoordinates.slice(currentRoute);
      const passedGeoJSON: Feature<LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: passedCoordinates,
        },
        properties: {},
      };
      const routeSource = this.map.getSource('route') as mapboxgl.GeoJSONSource;
      if (routeSource) {
        routeSource.setData(passedGeoJSON);
      } else {
        console.error('Error: Unable to get route source');
      }

      currentIndex++;
      currentRoute++;
      currentBearing++;

      const interval = calculateMoveInterval(currentIndex);
      clearInterval(this.moveInterval!);
      this.moveInterval = setInterval(moveMarkerAlongRoute, interval);
    };

    this.moveInterval = setInterval(moveMarkerAlongRoute, 5000);
  }

  updateRotate(rotation: number) {
    this.el.style.transform = `rotate(${rotation}deg)`;
  }
  //Merging all the coordinates
  allCoordinates(
    routeCoordinates: [number, number][],
    distanceBetweenPoints: number,
  ) {
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const coord1 = routeCoordinates[i];
      const coord2 = routeCoordinates[i + 1];
      const interpolatedCoords = interpolateCoordinates(
        coord1,
        coord2,
        distanceBetweenPoints,
      );
      this.allCoords.push(...interpolatedCoords);
    }
    this.allCoords.push(routeCoordinates[routeCoordinates.length - 1]);
    return this.allCoords;
  }
  //To calculate the Rotation according to the Coordinates Change
  calculateRotation(coordinates: [number, number][]): number[] {
    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = turf.point(coordinates[i]);
      const end = turf.point(coordinates[i + 1]);
      let bearing = Math.ceil(turf.bearing(start, end));
      if (bearing < 90) {
        bearing = 90;
      } else {
        bearing = 0;
      }
      this.bearings.push(bearing);
    }
    return this.bearings;
  }

  removeRoute() {
    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
    }
    if (this.map.getSource('route')) {
      this.map.removeSource('route');
    }
    if (this.endMarker) {
      this.endMarker.remove();
    }

    this.allCoords = [];
    this.route = [];
    this.mergedRoute = [];
    clearInterval(this.moveInterval!);
  }

  gettingOrderRoute() {
    const coords = this.end;
    const end: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: coords,
          },
        },
      ],
    };

    const endSource = this.map?.getSource('end');
    if (endSource) {
      const geojsonSource = endSource as mapboxgl.GeoJSONSource;
      geojsonSource.setData(end);
    } else {
      if (this.map.getLayer('end')) {
        this.map.removeLayer('end');
        this.map.removeSource('end');
      }
      if (this.previousMarker) {
        this.previousMarker.remove();
      }
      this.endMarker = new mapboxgl.Marker({ color: 'blue', draggable: true })
        .setLngLat(coords as mapboxgl.LngLatLike)
        .addTo(this.map);

      this.previousMarker = this.endMarker;

      this.endMarker.setPopup(this.popup);
      this.popup.addTo(this.map);
    }

    this.gettingRoute(coords);
  }
  //To Display all the routes sequentially
  displayAllRoutes() {
    const coords = this.end;
    const markerColor =
      this.typeStates === 'Restaurant 1' || this.typeStates === 'Restaurant 2'
        ? '../../assets/images/res.png'
        : this.typeStates === 'Hub'
          ? '../../assets/images/hub.png'
          : '../../assets/images/location.png';
    const end: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: coords,
          },
        },
      ],
    };

    const endSource = this.map?.getSource('end');
    if (endSource) {
      const geojsonSource = endSource as mapboxgl.GeoJSONSource;
      geojsonSource.setData(end);
    }
    this.endMarker = new mapboxgl.Marker({
      element: createCustomElement(markerColor),
      draggable: false,
    })
      .setLngLat(coords as mapboxgl.LngLatLike)
      .addTo(this.map);
    this.popup = new mapboxgl.Popup({ offset: 25 }).setHTML(this.popupContent);
    this.endMarker.setPopup(this.popup);
    this.popup.addTo(this.map);
    this.gettingRoute(coords);
  }

  processDoorwayRoute() {
    this.doorway;
    if (this.doorway) {
      const states = Object.values(this.doorway);
      for (const state of states) {
        const doorwayStartCo = state.customerCoordinates;
        const doorwayEndCo = state.doorwayCoordinates;
        if (doorwayStartCo[0] && doorwayStartCo[1]) {
          const doorwayStart = [doorwayStartCo[0], doorwayStartCo[1]];
          const doorwayEnd = [doorwayEndCo[0], doorwayEndCo[1]];
          this.displayDoorwayRoutes(doorwayEnd, doorwayStart);
        }
      }
    }
  }
  //For Customer Doorway Route
  displayDoorwayRoutes(doorwayEnd: number[], doorwayStart: number[]) {
    const coords = doorwayEnd;
    const coords1 = doorwayStart;
    const markerColor = '../../assets/images/Home-removebg-preview.png';
    const end: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: coords,
          },
        },
      ],
    };

    const endSource = this.map?.getSource('end');
    if (endSource) {
      const geojsonSource = endSource as mapboxgl.GeoJSONSource;
      geojsonSource.setData(end);
    }
    this.endMarker = new mapboxgl.Marker({
      element: createCustomElement(markerColor),
      draggable: false,
    })
      .setLngLat(coords as mapboxgl.LngLatLike)
      .addTo(this.map);
    this.popup = new mapboxgl.Popup({ offset: 25 }).setHTML('Doorway');
    this.endMarker.setPopup(this.popup);
    this.popup.addTo(this.map);
    this.gettingDoorwayRoute(coords, coords1);
  }
  //For Customer Doorway Route
  gettingDoorwayRoute(coords: number[], coords1: number[]) {
    this.mapboxService
      .getDoorwayRoute(this.map, coords, coords1)
      .subscribe((data: ApiResponse) => {
        const newDoorwayRoute = data.routes[0].geometry.coordinates;
        const addedDoorwayRoute = this.allDoorwayCoordinates(
          newDoorwayRoute,
          this.distanceBetweenPoints,
        );
        const geojson: Feature<LineString> = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: addedDoorwayRoute,
          },
        };
        const newLayerId = `doorwayRoute_${Date.now()}`;
        if (this.map.getSource(newLayerId)) {
          (this.map.getSource(newLayerId) as mapboxgl.GeoJSONSource).setData(
            geojson,
          );
        } else {
          this.map.addLayer({
            id: newLayerId,
            type: 'line',
            source: {
              type: 'geojson',
              data: geojson,
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#FF0000',
              'line-width': 5,
              'line-opacity': 0.75,
              'line-dasharray': [2, 2],
            },
          });
        }
      });
  }
  //Merging all the Doorway Routes
  allDoorwayCoordinates(
    routeCoordinates: [number, number][],
    distanceBetweenPoints: number,
  ) {
    const doorwayRouteCoords: [number, number][] = [];
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const coord1 = routeCoordinates[i];
      const coord2 = routeCoordinates[i + 1];
      const interpolatedCoords = interpolateCoordinates(
        coord1,
        coord2,
        distanceBetweenPoints,
      );
      interpolatedCoords.forEach((coord) => {
        if (
          !doorwayRouteCoords.some(([x, y]) => x === coord[0] && y === coord[1])
        ) {
          doorwayRouteCoords.push(coord);
        }
      });
    }
    const lastCoord = routeCoordinates[routeCoordinates.length - 1];
    if (
      !doorwayRouteCoords.some(
        ([x, y]) => x === lastCoord[0] && y === lastCoord[1],
      )
    ) {
      doorwayRouteCoords.push(lastCoord);
    }
    return doorwayRouteCoords;
  }

  removeRiderFromHub() {
    return this.mapboxService.removeFromHub(
      this.riderInfo.rider.hubId,
      this.riderId,
    );
  }
  //To Display Hub Route
  gettingHubRoute(hubEnd: number[]) {
    if (hubEnd) {
      this.end = hubEnd;
      this.displayAllRoutes();
    }
  }
  //Connecting to through Socket
  connectToSocket() {
    const socket = io(environment.apiClient);
    socket.on('riderFound', (data) => {
      if (data.riderId === this.riderId) {
        this.message.success('New Order Recieved');
        this.removeRoute();
        setTimeout(() => {
          if (this.riderInfo.rider.hubId === null) {
            this.getRiderInfo();
          } else {
            this.removeRiderFromHub().subscribe((data: any) => {
              console.log(data);
              if (data) {
                this.getRiderInfo();
              }
            });
          }
        }, 1000);
      }
    });
  }
}
