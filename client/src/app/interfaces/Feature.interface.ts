type GeoJSONFeature = {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    name: string;
    address: string;
    rating: number;
    priceRange: string;
    delivery: boolean;
    operatingDays: string;
    operationOpeningTime: string;
    operationClosingTime: string;
  };
};
