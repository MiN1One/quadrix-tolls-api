export interface IRoutePoint {
  lng: number;
  lat: number;
}

interface IRoutePath {
  distance: number;
  time: number;
  points: string;
}

export interface IFetchRouteResponse {
  paths: IRoutePath[];
}

export interface IRouteToll {
  totalToll: number | null;
  licensePlateToll: number | null;
  fuelExpense: number;
  currency: string;
}

export interface IAlternativeRoute {
  polyline: string;
  durationSeconds: number;
  toll: IRouteToll | null;
  distanceKilometers: number;
}

export interface ITollApiResponse {
  route: {
    hasTolls: boolean;
    costs: {
      licensePlate: number | null;
      prepaidCard: number | null;
      fuel: number;
      currency: string;
      expressLanes: {
        tagCostMin: number;
        tagCost: number;
        tagCostMax: number;
        licensePlateCostMin: number;
        licensePlateCost: number;
        licensePlateCostMax: number;
      };
    };
  };
}
