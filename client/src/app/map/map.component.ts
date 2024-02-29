import { Component, OnInit } from '@angular/core';
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import MapBoxDirections from '@mapbox/mapbox-gl-directions';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Feature, FeatureCollection, LineString, MultiPoint } from 'geojson';
import { MapService } from '../services/map.service';
import { ApiResponse } from '../interfaces/gettingRoute.interface';
import * as turf from '@turf/turf';
import { environment } from '../../environments/environment';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {
  IAllRoutes,
  IDoorwayRoutes,
  IRiderStates,
  ISequenceRoutes,
  RiderInfo,
} from '../interfaces/IRider.interface';
import {
  createCustomElement,
  createCustomMarkerElement,
  createState,
  doorwaysData,
  processSequenceData,
  processStateData,
  sortingSequence,
} from '../utlis/utils';
import { interpolateCoordinates } from '../utlis/utils';
import { NzMessageService } from 'ng-zorro-antd/message';
import io from 'socket.io-client';

interface EventType {
  lngLat: {
    lng: number;
    lat: number;
    [key: string]: number;
  };
}

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

  //For status Modal
  // isVisible = false;
  // showModal(): void {
  //   this.isVisible = true;
  // }
  // handleOk(): void {
  //   console.log('Button ok clicked!');
  //   this.isVisible = false;
  // }
  // handleCancel(): void {
  //   console.log('Button cancel clicked!');
  //   this.isVisible = false;
  // }

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
          // eslint-disable-next-line
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
  // eslint-disable-next-line
  moveInterval: any = null;

  previousMarker: mapboxgl.Marker | null = null;

  riderId = '';

  lat: number = 51.515419;
  lng: number = -0.141099;

  allroutes: Array<number | undefined>[] = [];
  secondroute: number[] = [];

  typeStates: string = '';

  restaurant1!: mapboxgl.Marker;
  restaurant2!: mapboxgl.Marker;
  customer1!: mapboxgl.Marker;
  customer2!: mapboxgl.Marker;
  allPoints: string[] = [];

  states: IRiderStates[] = [];

  // hubId: string = '';

  allRoutesWithType: IAllRoutes = {};

  //eslint-disable-next-line
  dynamicState: IAllRoutes = {};

  doorway: IDoorwayRoutes = {};

  sequence: ISequenceRoutes = {};

  popupContent = '1st Customer';
  popup = new mapboxgl.Popup({ offset: 25 }).setHTML(this.popupContent);

  // eslint-disable-next-line no-unused-vars
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
          // this.start = [this.usersCurrentLongitude, this.usersCurrentLatitude];
          if (latitude && longitude) {
            this.getRiderInfo();
            // console.log(
            //   latitude,longitude
            // );
            this.marker.setLngLat([
              this.lng,
              this.lat,
              // this.usersCurrentLongitude,
              // this.usersCurrentLatitude,
            ]);
            if (this.start !== this.compare) {
              this.map.flyTo({
                center: [this.lng, this.lat],
                // center: [this.usersCurrentLongitude, this.usersCurrentLatitude],
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
      // this.getRiderInfo();
      // this.gettingEnd();
    }
  }

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
        console.log('rider Info', this.riderInfo);
        // console.log('rider length', this.riderInfo.rider.routeSequence.length);
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
          processing.forEach((stateData, index) => {
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
          //////////////////////
          // if (this.allRoutesWithType) {
          if (this.dynamicState) {
            console.log('dynamic State', this.dynamicState);
            const sortedState: IAllRoutes = sortingSequence(
              this.sequence,
              this.dynamicState,
            );
            console.log('sorted State', sortedState);
            const states = Object.values(sortedState);
            // const states = Object.values(this.dynamicState);
            for (const state of states) {
              const start = state.coordinates;
              // if(start !== [0,0]) {}
              this.typeStates = state.type;
              this.popupContent = state.type;
              // for (let i = 0; i <= states.length - 1; i++) {
              //   const start = states[i].coordinates;
              //   this.typeStates = states[i].type;
              //   this.popupContent = states[i].type;
              if (start[0] && start[1]) {
                // console.log('counting start', start);
                this.end = [start[0], start[1]];
                this.displayAllRoutes();
              }
            }
            if (this.allCoords) {
              this.walkThroughRoute(this.allCoords);
              this.calculateRotation(this.allCoords);
            }
          }
        }
      });
  }

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

    // this.gettingEnd();
  }

  gettingRoute(end: number[]) {
    end = this.end;
    // console.log('checking route', this.oldStart, end);
    console.log('hitting');
    this.mapboxService
      .getRoute(this.map, this.oldStart, end)
      // .getRoute(this.map, this.start, end)
      .subscribe((data: ApiResponse) => {
        this.route = data.routes[0].geometry.coordinates;

        const geojson: Feature<LineString> = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: this.route,
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
        // console.log('counting line');
        this.allCoordinates(this.route, this.distanceBetweenPoints);
        // if (this.allCoords) {
        //   this.walkThroughRoute(this.allCoords);
        //   this.calculateRotation(this.allCoords);
        // }
      });
    this.oldStart = end;
    // this.getNextRoute();
    // }
  }

  gettingEnd() {
    if (this.route) {
      this.removeRoute();
    }
    this.map.on('click', (event: EventType) => {
      const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
      console.log('clicked coords', coords);
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

        this.endMarker.on('dragend', this.onBlueDragEnd);

        this.previousMarker = this.endMarker;
      }

      this.gettingRoute(coords);
    });
  }

  onBlueDragEnd = () => {
    if (this.endMarker) {
      const lngLat = this.endMarker.getLngLat();
      this.end = [lngLat.lng, lngLat.lat];
      this.gettingRoute(this.end);
    }
  };

  walkThroughRoute(routeCoordinates: [number, number][]) {
    let currentIndex = 0;
    let currentRoute = 1;
    let currentBearing = 1;
    this.moveInterval = null;
    // this.isWalkingThrough = true;

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
      // this.map.flyTo({
      //           center: [nextLongitude,nextLatitude],
      //           zoom: 15,
      //           essential: true,
      //         });
      // console.log('next',nextCoordinate);

      this.marker.setLngLat([nextLongitude, nextLatitude]);
      this.start = nextCoordinate;

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
      // console.log('interval',interval);
      clearInterval(this.moveInterval!);
      this.moveInterval = setInterval(moveMarkerAlongRoute, interval);
    };

    this.moveInterval = setInterval(moveMarkerAlongRoute, 5000);
  }

  updateRotate(rotation: number) {
    this.el.style.transform = `rotate(${rotation}deg)`;
  }

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
    // console.log('coords', this.allCoords);
    this.allCoords.push(routeCoordinates[routeCoordinates.length - 1]);
    return this.allCoords;
  }

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
    // Remove the existing route
    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
    }
    if (this.map.getSource('route')) {
      this.map.removeSource('route');
    }

    this.allCoords = [];
    this.route = [];
    clearInterval(this.moveInterval!);
  }

  gettingOrderRoute() {
    // if (this.route) {
    //   this.removeRoute();
    // }
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

      this.endMarker.on('dragend', this.onBlueDragEnd);

      this.previousMarker = this.endMarker;

      this.endMarker.setPopup(this.popup);
      this.popup.addTo(this.map);
    }

    this.gettingRoute(coords);
  }

  updateResPopupContent(remainingTime: number) {
    const minutes = Math.floor(remainingTime / 60000); // 1 minute = 60000 milliseconds
    const seconds = Math.floor((remainingTime % 60000) / 1000); // Remaining milliseconds after minutes are accounted for, divided by 1000 to get seconds

    // Format minutes and seconds
    const formattedTime = `1st order ${minutes}:${seconds < 10 ? '0' : ''}${seconds} mins`; // Add leading zero to seconds if needed

    // Set the updated content to the popup
    this.popup.setHTML(formattedTime);
  }

  displayAllRoutes() {
    const coords = this.end;
    // const [pointType, markerColor] = this.getPointType();
    // const pointType = this.getPointType();
    const markerColor =
      this.typeStates === 'Restaurant'
        ? '../../assets/images/res.png'
        : this.typeStates === 'Hub'
          ? '../../assets/images/hub.png'
          : '../../assets/images/location.png';
    // console.log('markerColor',pointType)
    // const markerColor = pointType === 'Restaurant' ? 'red' : 'blue';
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
      // color: markerColor,
      draggable: false,
    })
      // element: createCustomMarkerElement(
      //   '../../assets/images/rider.png',
      //   this.rotation,
      // ),
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
        // this.typeStates = state.type;
        // this.popupContent = state.type;
        if (doorwayStartCo[0] && doorwayStartCo[1]) {
          // console.log('doorWay start', doorwayStartCo);
          const doorwayStart = [doorwayStartCo[0], doorwayStartCo[1]];
          const doorwayEnd = [doorwayEndCo[0], doorwayEndCo[1]];
          this.displayDoorwayRoutes(doorwayEnd, doorwayStart);
        }
      }
    }
  }

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
      // color: markerColor,
      draggable: false,
    })
      .setLngLat(coords as mapboxgl.LngLatLike)
      .addTo(this.map);
    this.popup = new mapboxgl.Popup({ offset: 25 }).setHTML('Doorway');
    this.endMarker.setPopup(this.popup);
    this.popup.addTo(this.map);
    this.gettingDoorwayRoute(coords, coords1);
  }

  gettingDoorwayRoute(coords: number[], coords1: number[]) {
    // console.log('checking coords for doorway', coords, coords1);
    this.mapboxService
      .getDoorwayRoute(this.map, coords, coords1)
      .subscribe((data: ApiResponse) => {
        const newDoorwayRoute = data.routes[0].geometry.coordinates;
        // console.log('After Doorway Route', newDoorwayRoute);
        const addedDoorwayRoute = this.allDoorwayCoordinates(
          newDoorwayRoute,
          this.distanceBetweenPoints,
        );
        // console.log('After adding Doorway Route', addedDoorwayRoute);
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
    //     const layerVisibility = this.map.getLayoutProperty('doorwayRoute', 'visibility');
    //     console.log('layer Visibility', layerVisibility)
    //     if (layerVisibility === 'none') {
    //       this.map.setLayoutProperty('doorwayRoute', 'visibility', 'visible');
    //       console.log('layer Visibility', layerVisibility)
    // }
  }
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
      // doorwayRouteCoords.push(...interpolatedCoords);
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

    // doorwayRouteCoords.push(routeCoordinates[routeCoordinates.length - 1]);
    return doorwayRouteCoords;
  }

  removeRiderFromHub() {
    // eslint-disable-next-line
    return this.mapboxService.removeFromHub(
      this.riderInfo.rider.hubId,
      this.riderId,
    );
  }

  gettingHubRoute(hubEnd: number[]) {
    if (hubEnd) {
      this.end = hubEnd;
      this.displayAllRoutes();
    }
  }

  connectToSocket() {
    const socket = io('http://localhost:8080');
    console.log('connected');
    socket.on('riderFound', (data) => {
      console.log('order incoming');
      if (data.riderId === this.riderId) {
        this.message.success('New Order Recieved');
        console.log('updated data', data);
        this.removeRoute();
        if (this.riderInfo.rider.hubId === null) {
          this.getRiderInfo();
        } else {
          console.log('inside else');
          this.removeRiderFromHub() // eslint-disable-next-line
            .subscribe((data: any) => {
              console.log(data);
              if (data) {
                this.getRiderInfo();
              }
            });
        }
      }
    });
  }
}
