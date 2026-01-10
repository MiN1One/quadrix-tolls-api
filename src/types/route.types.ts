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

export interface ITollDetails {
  price: number;
  currency: string;
  lng: number;
  lat: number;
  type: string;
}

export interface IRouteToll {
  totalToll: number | null;
  licensePlateToll: number | null;
  fuelExpense: number;
  currency: string;
  tolls: ITollDetails[];
}

export interface IAlternativeRoute {
  polyline: string;
  durationSeconds: number;
  toll: IRouteToll | null;
  distanceKilometers: number;
}

export interface ITicketSystemToll {
  type: 'ticketSystem1';
  start: IRoutePoint;
  end: IRoutePoint;
  prepaidCardCost: number | null;
  tagCost: number | null;
  currency: string;
}

export interface IBarrierToll extends IRoutePoint {
  type: 'barrier';
  prepaidCardCost: number | null;
  currency: string;
  tagCost: number | null;
}

export type TollType = ITicketSystemToll | IBarrierToll;

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
    tolls: TollType[];
  };
}
