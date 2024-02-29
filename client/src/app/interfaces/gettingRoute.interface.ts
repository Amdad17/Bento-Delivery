interface LegAdmin {
  iso_3166_1_alpha3: string;
  iso_3166_1: string;
}

interface Leg {
  via_waypoints: never[]; // Assuming via_waypoints is always an empty array
  admins: LegAdmin[];
  weight_typical: number;
  duration_typical: number;
  weight: number;
  duration: number;
  steps: never[]; // Assuming steps is always an empty array
  distance: number;
  summary: string;
}

interface Route {
  weight_typical: number;
  duration_typical: number;
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
  legs: Leg[];
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
}

interface Waypoint {
  distance: number;
  name: string;
  location: [number, number];
}

export interface ApiResponse {
  routes: Route[];
  waypoints: Waypoint[];
  code: string;
  uuid: string;
}
