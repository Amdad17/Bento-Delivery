import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { environment } from '../../environments/environment';
import { createCustomElement } from '../utlis/utils';

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
  style = 'mapbox://styles/mapbox/streets-v12';
  popupContent = '1st Customer';
  popup = new mapboxgl.Popup({ offset: 25 }).setHTML(this.popupContent);

  usersCurrentLatitude: number = 51.515419;
  usersCurrentLongitude: number = -0.141099;

  ngOnInit(): void {
    this.initializeMapAndMarker();
  }

  // initializeMapAndMarker() {
  //   this.map = new mapboxgl.Map({
  //     accessToken: environment.mapbox.accessToken,
  //     container: 'map',
  //     style: this.style,
  //     center: [this.usersCurrentLongitude, this.usersCurrentLatitude],
  //     zoom: 10,
  //   });

  //   fetch('../../assets/json/RestaurantsWithAllInfo.json')
  //     .then(response => response.json())
  //     .then(data => {
  //       // Iterate over the data and create markers
  //       console.log('data',data.data)
  //       //eslint-disable-next-line
  //       data.data.forEach((item: any) => {
  //         const marker = new mapboxgl.Marker({
  //           element: createCustomElement('../../assets/images/res.png'),
  //           draggable: false,
  //         })
  //           .setLngLat([item.restaurantLongitude, item.restaurantLatitude]) // Assuming your JSON structure has latitude and longitude properties
  //           .addTo(this.map);

  //         const popup = new mapboxgl.Popup({ offset: 25 })
  //           .setHTML(`<p>${item.restaurantId}</p>`); // Customize popup content here

  //         marker.setPopup(popup);
  //         // popup.addTo(this.map);

  //         this.markers.push(marker); // Add marker to markers array
  //       });
  //     })
  //     .catch(error => {
  //       console.error('Error loading JSON data:', error);
  //     });
  //   this.fetchingCustomer()
  // }

  // fetchingCustomer() {
  //   fetch('../../assets/json/customers.json')
  //     .then(response => response.json())
  //     .then(data => {
  //       // Iterate over the data and create markers
  //       console.log('data',data.data)
  //       //eslint-disable-next-line
  //       data.data.forEach((item: any) => {
  //         const customerMarker = new mapboxgl.Marker({
  //           element: createCustomElement('../../assets/images/location.png'),
  //           draggable: false,
  //         })
  //           .setLngLat([item.currentLatLong.latitude, item.currentLatLong.longitude]) // Assuming your JSON structure has latitude and longitude properties
  //           .addTo(this.map);

  //         // const popup = new mapboxgl.Popup({ offset: 25 })
  //         //   .setHTML(`<p>${item.restaurantId}</p>`); // Customize popup content here

  //         // marker.setPopup(popup);
  //         // popup.addTo(this.map);

  //         this.customerMarkers.push(customerMarker); // Add marker to markers array
  //       });
  //     })
  //     .catch(error => {
  //       console.error('Error loading JSON data:', error);
  //     });
  // }

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
      '../../assets/json/RestaurantsWithAllInfo.json',
    )
      .then((response) => response.json())
      .then((data) => {
        // Create restaurant markers
        //eslint-disable-next-line
        data.data.forEach((item: any) => {
          const marker = new mapboxgl.Marker({
            element: createCustomElement('../../assets/images/res.png'),
            draggable: false,
          })
            .setLngLat([item.restaurantLongitude, item.restaurantLatitude])
            .addTo(this.map);

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<p>${item.restaurantId}</p>`,
          );

          marker.setPopup(popup);
          this.markers.push(marker);
        });
      })
      .catch((error) => {
        console.error('Error loading restaurant JSON data:', error);
      });

    // Fetch customer data
    const fetchCustomers = fetch('../../assets/json/customers.json')
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.data)
        // Create customer markers
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
          // const customerMarker = new mapboxgl.Marker({
          //   element: createCustomElement('../../assets/images/location.png'),
          //   draggable: false,
          // })
          //   .setLngLat([item.currentLatLong.latitude, item.currentLatLong.longitude])
          //   .addTo(this.map);

          // this.customerMarkers.push(customerMarker);
        });
      })
      .catch((error) => {
        console.error('Error loading customer JSON data:', error);
      });

    // Fetch Rider data
    const fetchRider = fetch('https://bento-rider.onrender.com/rider/all')
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.riders)
        // Create customer markers
        //eslint-disable-next-line
        data.riders.forEach((item: any) => {
          try {
            // console.log(item);
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
    // const fetchHub = fetch('https://bento-rider.onrender.com/hub/get-all-hubs')
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     const geoJsonData = {
    // type: "FeatureCollection",
    //     features: []
    //     };

    //     // Create customer markers
    //     //eslint-disable-next-line
    //     data.restaurants.forEach((item: any) => {
    //       try {

    //         console.log(item.restaurantLatitude,item.restaurantLongitude);
    //                     this.map.addSource('maine', {
    //         'type': 'geojson',
    //         'data': {
    //         'type': 'Feature',
    //         'geometry': {
    //         'type': 'Polygon',
    //         // These coordinates outline Maine.
    //         'coordinates': [[]]
    //         }
    //         }
    //       });

    //         // Add a new layer to visualize the polygon.
    //         this.map.addLayer({
    //         'id': 'maine',
    //         'type': 'fill',
    //         'source': 'maine', // reference the data source
    //         'layout': {},
    //         'paint': {
    //         'fill-color': '#0080ff', // blue color fill
    //         'fill-opacity': 0.5
    //         }
    //         });
    //         // Add a black outline around the polygon.
    //         this.map.addLayer({
    //         'id': 'outline',
    //         'type': 'line',
    //         'source': 'maine',
    //         'layout': {},
    //         'paint': {
    //         'line-color': '#000',
    //         'line-width': 3
    //         }
    //         });
    //         // const riderMarker = new mapboxgl.Marker({
    //         //   element: createCustomElement('../../assets/images/rider.png'),
    //         //   draggable: false,
    //         // })
    //         //   .setLngLat([
    //         //     item.currentLatLong.longitude,
    //         //     item.currentLatLong.latitude,
    //         //   ])
    //         //   .addTo(this.map);

    //         // const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    //         //   `<p>${item.email}</p>`,
    //         // );

    //         // riderMarker.setPopup(popup);

    //         // this.riderMarkers.push(riderMarker);
    //       } catch (error) {
    //         console.error('Error creating Hub:', error);
    //       }
    //     });
    // })
    // .catch((error) => {
    //   console.error('Error loading rider JSON data:', error);
    // });

    // Wait for both fetch operations to complete
    Promise.all([fetchRestaurants, fetchCustomers, fetchRider])
      .then(() => {
        console.log('Markers added to the map');
      })
      .catch((error) => {
        console.error('Error adding markers to the map:', error);
      });
  }
}
