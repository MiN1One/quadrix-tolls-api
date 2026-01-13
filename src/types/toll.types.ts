import { ITollDetails } from './route.types';

export interface IToll extends ITollDetails {
  id: number;
  primaryTags: string[];
  licensePlateTags: string[];
  road: string;
}
