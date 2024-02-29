export interface IProperties {
  fillOpacity: number;
  fillColor: string;
  opacity: number;
  fill: string;
  color: string;
  contour: number;
  metric: string;
}

export interface IGeometry {
  coordinates: number[][][];
  type: string;
}

export interface IFeature {
  properties: IProperties;
  geometry: IGeometry;
  type: string;
}

export interface IFeatureCollection {
  features: IFeature[];
  type: string;
}

export interface Location {
  distance: number;
  name: string;
  location: [number, number];
}

export interface Source extends Location {}

export interface Destination extends Location {}

export interface DistanceDurationResponse {
  code: string;
  distances: number[][];
  destinations: Destination[];
  durations: number[][];
  sources: Source[];
}

export interface IDestination {
  distance: number;
  name: string;
  location: [number, number];
}

export interface ISource extends IDestination {}

export interface MapboxDirection {
  code: string;
  destinations: IDestination[];
  durations: number[][];
  sources: ISource[];
}
