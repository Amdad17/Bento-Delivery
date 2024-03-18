import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { environment } from '../../../environments/environment';
import { createCustomElement } from '../../utlis/utils';

@Component({
  selector: 'app-mega-map',
  templateUrl: './mega-map.component.html',
  styleUrl: './mega-map.component.css',
})
export class MegaMapComponent implements OnInit {
  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
  markers: mapboxgl.Marker[] = [];
  customerMarkers: mapboxgl.Marker[] = [];
  riderMarkers: mapboxgl.Marker[] = [];
  allres: number[] = [];
  style = 'mapbox://styles/mapbox/streets-v12';
  popupContent = '1st Customer';
  popup = new mapboxgl.Popup({ offset: 25 }).setHTML(this.popupContent);

  usersCurrentLatitude: number = 51.515419;
  usersCurrentLongitude: number = -0.141099;

  ngOnInit(): void {
    this.initializeMapAndMarker();
  }
  initializeMapAndMarker() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      center: [this.usersCurrentLongitude, this.usersCurrentLatitude],
      zoom: 10,
    });

    // Fetch restaurant data
    const fetchRestaurants = fetch(
      // '../../assets/json/RestaurantsWithAllInfo.json',
      'https://bento-rider.onrender.com/hub/get-all-hubs',
    )
      .then((response) => response.json())
      .then((data) => {
        //eslint-disable-next-line
        data.forEach((item: any) => {
          //eslint-disable-next-line
          const coordinates = item.restaurants.map((coord: any) => [
            coord.restaurantLongitude,
            coord.restaurantLatitude,
          ]);
          for (let i = 0; i < coordinates.length; i++) {
            this.allres.push(coordinates[i]);
          }
          // Create restaurant markers
          //eslint-disable-next-line
          this.allres.forEach((item: any) => {
            const marker = new mapboxgl.Marker({
              element: createCustomElement('../../assets/images/res.png'),
              draggable: false,
            })
              .setLngLat([item[0], item[1]])
              .addTo(this.map);

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<p>${item.restaurantId}</p>`,
            );

            marker.setPopup(popup);
            this.markers.push(marker);
          });
        });
      })
      .catch((error) => {
        console.error('Error loading restaurant JSON data:', error);
      });

    // Fetch customer data
    const fetchCustomers = fetch('../../assets/json/customers.json')
      .then((response) => response.json())
      .then((data) => {
        //eslint-disable-next-line
        data.data.forEach((item: any) => {
          try {
            const customerMarker = new mapboxgl.Marker({
              element: createCustomElement('../../assets/images/location.png'),
              draggable: false,
            })
              .setLngLat([
                item.doorwayLatLong.longitude,
                item.doorwayLatLong.latitude,
              ])
              .addTo(this.map);

            this.customerMarkers.push(customerMarker);
          } catch (error) {
            console.error('Error creating customer marker:', error);
          }
        });
      })
      .catch((error) => {
        console.error('Error loading customer JSON data:', error);
      });

    // Fetch Rider data
    const fetchRider = fetch('https://bento-rider.onrender.com/rider/all')
      .then((response) => response.json())
      .then((data) => {
        //eslint-disable-next-line
        data.riders.forEach((item: any) => {
          try {
            const riderMarker = new mapboxgl.Marker({
              element: createCustomElement('../../assets/images/rider.png'),
              draggable: false,
            })
              .setLngLat([
                item.currentLatLong.longitude,
                item.currentLatLong.latitude,
              ])
              .addTo(this.map);

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<p>${item.email}</p>`,
            );

            riderMarker.setPopup(popup);

            this.riderMarkers.push(riderMarker);
          } catch (error) {
            console.error('Error creating rider marker:', error);
          }
        });
      })
      .catch((error) => {
        console.error('Error loading rider JSON data:', error);
      });

    // Fetch Hub data
    const fetchHub = fetch('https://bento-rider.onrender.com/hub/get-all-hubs')
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        //eslint-disable-next-line
        data.forEach((item: any) => {
          try {
            //eslint-disable-next-line
            const coordinates = item.restaurants.map((coord: any) => [
              coord.restaurantLongitude,
              coord.restaurantLatitude,
            ]);
            this.map.addSource(`hub-${item._id}`, {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [coordinates],
                },
                properties: {},
              },
            });

            // Add a new layer to visualize the polygon.
            this.map.addLayer({
              id: `hub-${item._id}`,
              type: 'fill',
              source: `hub-${item._id}`, // reference the data source
              layout: {},
              paint: {
                'fill-color': '#FF0000', // blue color fill
                'fill-opacity': 0.5,
              },
            });
            const hubMarker = new mapboxgl.Marker({
              color: 'blue',
              draggable: false,
            })
              .setLngLat([item.center[0], item.center[1]])
              .addTo(this.map);
          } catch (error) {
            console.error('Error creating Hub:', error);
          }
        });
        // console.log('coordinates', this.allres)
      })
      .catch((error) => {
        console.error('Error loading rider JSON data:', error);
      });

    // Wait for the operations to complete
    Promise.all([fetchCustomers, fetchRider, fetchHub, fetchRestaurants])
      .then(() => {
        console.log('Markers added to the map');
      })
      .catch((error) => {
        console.error('Error adding markers to the map:', error);
      });
  }
}
