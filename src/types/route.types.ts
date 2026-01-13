export interface IRoutePoint {
  lng: number;
  lat: number;
}

interface IRoutePath {
  distance: number;
  time: number;
  points: string;
}

export interface IGetRouteResponse {
  attributeId: string;
  data: null | IRouteReturnData;
}

export interface IFetchRouteResponse {
  paths: IRoutePath[];
}

export interface ITollDetails {
  price: number;
  priceLicensePlate: number;
  currency: string;
  lng: number;
  name: string;
  lat: number;
  isExpress: boolean;
  type: string;
  expressDirection: 'exit' | 'entry' | null;
}

export interface IRouteToll {
  totalToll: number | null;
  licensePlateToll: number | null;
  fuelExpense: number;
  currency: string;
  hasExpressLane: boolean;
  tolls: ITollDetails[];
  totalExpressToll: number | null;
  licensePlateExpressToll: number | null;
}

export interface IAlternativeRoute {
  polyline: string;
  durationSeconds: number;
  toll: IRouteToll | null;
  distanceKilometers: number;
}

export interface IExpressTollPoint extends IRoutePoint {
  name: string;
}

export interface ITicketSystemToll {
  type: 'ticketSystem1';
  start: IExpressTollPoint;
  end: IExpressTollPoint;
  prepaidCardCost: number | null;
  tagCost: number | null;
  licensePlateCost: number | null;
  isExpressLane?: boolean;
  currency: string;
}

export interface IBarrierToll extends IRoutePoint {
  type: 'barrier';
  prepaidCardCost: number | null;
  currency: string;
  tagCost: number | null;
  licensePlateCost: number | null;
  name: string;
  isExpressLane?: boolean;
}

export type TollType = ITicketSystemToll | IBarrierToll;

export interface IRouteReturnData {
  attributeId: string;
  points: IRoutePoint[];
  routes: IAlternativeRoute[];
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
    tolls: TollType[];
  };
}
