import * as turf from '@turf/turf';
import {
  Entity,
  IDoorwayRoutes,
  State,
  StateType,
} from '../interfaces/IRider.interface';
export function createCustomMarkerElement(iconPath: string, rotation: number) {
  const el = document.createElement('div');
  el.style.backgroundImage = `url('${iconPath}')`;
  el.style.backgroundSize = 'cover';
  el.style.width = '60px';
  el.style.height = '60px';
  el.style.transform = `rotate(${rotation}deg)`;
  return el;
}

export function createCustomElement(iconPath: string) {
  const el = document.createElement('div');
  el.style.backgroundImage = `url('${iconPath}')`;
  el.style.backgroundSize = 'cover';
  el.style.width = '30px';
  el.style.height = '30px';
  return el;
}

export function interpolateCoordinates(
  coord1: [number, number],
  coord2: [number, number],
  distanceBetweenPoints: number,
): [number, number][] {
  const line = turf.lineString([coord1, coord2]);
  const lineLength = turf.length(line, { units: 'kilometers' });
  const numPoints = Math.ceil(lineLength / distanceBetweenPoints);
  const intervalDistance = lineLength / (numPoints + 1);
  const interpolatedCoords: [number, number][] = [coord1];

  let currentDistance = intervalDistance;
  while (currentDistance < lineLength) {
    const point = turf.along(line, currentDistance, { units: 'kilometers' });
    interpolatedCoords.push(point.geometry.coordinates as [number, number]);
    currentDistance += intervalDistance;
  }

  interpolatedCoords.push(coord2);
  return interpolatedCoords;
}

export function createState(
  // eslint-disable-next-line
  data: any,
  type: StateType,
  stateKey: string,
  entityKey: string,
  entityType: string,
): State {
  const coordinates: [number | null, number | null] = [null, null];
  const entity = data.rider.riderStates[stateKey][entityKey] as Entity;

  if (entity) {
    coordinates[0] = entity.currentLatLong?.longitude || null;
    coordinates[1] = entity.currentLatLong?.latitude || null;
  }

  return {
    type: type,
    entityType: entityType,
    coordinates: coordinates.every((coord) => coord !== null)
      ? coordinates
      : null,
  };
}

//eslint-disable-next-line
export function processStateData(data: any) {
  const states = [];

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const stateData = data[key];
      const state = {
        completed: stateData.completed,
        coordinates: [0, 0],
        type: '',
      };

      if ('restaurant1' in stateData) {
        const restaurantKey = Object.keys(stateData).find((keys) =>
          keys.startsWith('restaurant1'),
        );
        if (restaurantKey) {
          const restaurant = stateData[restaurantKey];
          if (restaurant !== null && restaurant !== null) {
            state.type = 'Restaurant 1';
            state.coordinates = [
              restaurant.restaurantLongitude,
              restaurant.restaurantLatitude,
            ];
          } else {
            state.type = 'Restaurant 1';
            state.coordinates = [0, 0];
          }
        }
      } else if ('restaurant2' in stateData) {
        const restaurantKey = Object.keys(stateData).find((keys) =>
          keys.startsWith('restaurant2'),
        );
        if (restaurantKey) {
          const restaurant = stateData[restaurantKey];
          if (restaurant !== null && restaurant !== null) {
            state.type = 'Restaurant 2';
            state.coordinates = [
              restaurant.restaurantLongitude,
              restaurant.restaurantLatitude,
            ];
          } else {
            state.type = 'Restaurant 2';
            state.coordinates = [0, 0];
          }
        }
      } else if ('customer1' in stateData) {
        const customerKey = Object.keys(stateData).find((keys) =>
          keys.startsWith('customer1'),
        );
        if (customerKey) {
          const customer = stateData[customerKey];
          if (customer !== null && customer !== null) {
            state.type = 'Customer 1';
            state.coordinates = [
              customer.currentLatLong.longitude,
              customer.currentLatLong.latitude,
            ];
          } else {
            state.type = 'Customer 1';
            state.coordinates = [0, 0];
          }
        }
      } else if ('customer2' in stateData) {
        const customerKey = Object.keys(stateData).find((keys) =>
          keys.startsWith('customer2'),
        );
        if (customerKey) {
          const customer = stateData[customerKey];
          if (customer !== null && customer !== null) {
            state.type = 'Customer 2';
            state.coordinates = [
              customer.currentLatLong.longitude,
              customer.currentLatLong.latitude,
            ];
          } else {
            state.type = 'Customer 2';
            state.coordinates = [0, 0];
          }
        }
      }

      states.push(state);
    }
  }

  return states;
}

//eslint-disable-next-line
export function doorwaysData(data: any) {
  const states = [];

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const stateData = data[key];
      const state = {
        completed: stateData.completed,
        coordinates: [0, 0],
        type: '',
        doorway: [0, 0],
      };
      if ('customer1' in stateData || 'customer2' in stateData) {
        const customerKey = Object.keys(stateData).find((keys) =>
          keys.startsWith('customer'),
        );
        if (customerKey) {
          const customer = stateData[customerKey];
          if (customer !== null && customer !== null) {
            state.type = 'Customer';
            state.coordinates = [
              customer.currentLatLong.longitude,
              customer.currentLatLong.latitude,
            ];
            state.doorway = [
              customer.doorwayLatLong.longitude,
              customer.doorwayLatLong.latitude,
            ];
          } else {
            state.type = 'Customer';
            state.coordinates = [0, 0];
            state.doorway = [0, 0];
          }
        }
      }

      states.push(state);
    }
  }

  const dynamicState: IDoorwayRoutes = {};
  let stateIndex = 1;
  states.forEach((stateData) => {
    if (stateData.type && stateData.coordinates) {
      const newState = {
        type: stateData.type,
        customerCoordinates: stateData.coordinates as [number, number],
        doorwayCoordinates: stateData.doorway as [number, number],
      };
      const key = `state${stateIndex}`;
      dynamicState[key] = newState;
      stateIndex++;
    }
  });
  return dynamicState;
}

//eslint-disable-next-line
export function processSequenceData(data: any) {
  //eslint-disable-next-line
  const filteredData = data.filter((item: any) => item.sequence !== 'rider');
  //eslint-disable-next-line
  const sequenceValues = filteredData.map((item: any) => {
    const words = item.sequence
      .split(/(\d+)/)
      .filter((word: string) => word) // Remove empty strings
      .map((word: string) => {
        // Capitalize words
        if (isNaN(parseInt(word))) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        } else {
          return ' ' + word; // Insert space before numbers
        }
      });
    // Join the words with spaces
    return words.join('');
  });

  return sequenceValues;
}

//eslint-disable-next-line
export function sortingSequence(sortOrder: any, data: any) {
  //eslint-disable-next-line
  const customSort = (a: any, b: any) => {
    const indexA = sortOrder.findIndex(
      //eslint-disable-next-line
      (item: any) => item.toLowerCase() === a.toLowerCase(),
    );
    const indexB = sortOrder.findIndex(
      //eslint-disable-next-line
      (item: any) => item.toLowerCase() === b.toLowerCase(),
    );
    // If either index is -1 (element not found), return a value that ensures correct sorting
    return indexA - indexB;
  };
  const sortedKeys = Object.keys(data).sort((a, b) =>
    customSort(data[a].type, data[b].type),
  );
  //eslint-disable-next-line
  const sortedData: any = {};
  sortedKeys.forEach((key) => {
    sortedData[key] = data[key];
  });
  return sortedData;
}
