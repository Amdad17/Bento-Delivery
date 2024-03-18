export interface IUtilizationData {
  _id: string;
  restaurantId: number;
  utilization: number;
  level: string; //LU, MU, HU
  restaurantName: string;
  restaurantLongitude: number;
  restaurantLatitude: number;
  address: string;
  country: {
    countryCode: string;
    countryName: string;
    zoneName: string;
    gmtOffset: number;
    timestamp: number;
  };
  rating: number;
  priceRange: string;
  delivery: boolean;
  deliveryTimeStart: Date;
  deliveryTimeEnd: Date;
  operatingDays: string[];
  operationOpeningTime: Date;
  operationClosingTime: Date;
}
