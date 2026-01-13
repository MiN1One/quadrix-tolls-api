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
  id: number;
  road: string;
}

export interface IAPIToll {
  prepaidCardCost: number | null;
  licensePlateCost: number | null;
  tagCost: number | null;
  isExpressLane?: boolean;
  currency: string;
  tagPrimaryNames: string[];
  id: number;
  licensePlateNames: string[];
  name: string;
  road: string;
}

export interface ITicketSystemToll extends IAPIToll {
  type: 'ticketSystem1';
  start: IExpressTollPoint;
  end: IExpressTollPoint;
}

export interface IBarrierToll extends IRoutePoint, IAPIToll {
  type: 'barrier';
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
