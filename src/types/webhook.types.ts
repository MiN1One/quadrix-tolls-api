import { IRoutePoint } from './route.types';

export enum EWebhookTopic {
  PostRoute = 'post-route-with-tolls',
  UpdateTolls = 'update-tolls',
  UpdateRoute = 'update-route-with-tolls',
}

export interface IWebhookData {
  attributeId: string;
  points: IRoutePoint[];
}
