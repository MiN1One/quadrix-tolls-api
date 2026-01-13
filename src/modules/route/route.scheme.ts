import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type {
  IAlternativeRoute,
  IRouteReturnData,
  IRouteToll,
  ITollDetails,
} from 'src/types/route.types';

@Schema({ _id: false })
export class Point {
  @Prop({ type: Number, required: true })
  lng: number;

  @Prop({ type: Number, required: true })
  lat: number;
}

@Schema({ _id: false })
export class TollDetails implements ITollDetails {
  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: Number, required: true })
  lng: number;

  @Prop({ type: Number, required: true })
  lat: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  priceLicensePlate: number;

  @Prop({ type: String, required: true })
  currency: string;

  @Prop({ type: Boolean, default: false })
  isExpress: boolean;

  @Prop({ type: String, enum: ['exit', 'entry'], default: null })
  expressDirection: 'exit' | 'entry' | null;

  @Prop({ type: String, required: true })
  name: string;
}

@Schema({ _id: false })
export class RouteToll implements IRouteToll {
  @Prop({ type: Number, default: null })
  totalToll: number | null;

  @Prop({ type: Boolean, required: true })
  hasExpressLane: boolean;

  @Prop({ type: Number, default: null })
  licensePlateToll: number | null;

  @Prop({ type: Number, default: null })
  licensePlateExpressToll: number | null;

  @Prop({ type: Number, default: null })
  totalExpressToll: number | null;

  @Prop({ type: Number, required: true })
  fuelExpense: number;

  @Prop({ type: String, required: true })
  currency: string;

  @Prop({ type: [TollDetails] })
  tolls: ITollDetails[];
}

@Schema({ _id: false })
export class AlternativeRoute implements IAlternativeRoute {
  @Prop({
    type: String,
    required: true,
  })
  polyline: string;

  @Prop({
    type: Number,
    required: true,
  })
  durationSeconds: number;

  @Prop({
    type: Number,
    required: true,
  })
  distanceKilometers: number;

  @Prop({ type: RouteToll, default: null })
  toll: IRouteToll | null;
}

@Schema({ timestamps: true })
export class Route implements IRouteReturnData {
  @Prop({
    type: [Point],
    required: true,
    validate: {
      validator: (points: Point[]) => points.length >= 2,
      message: 'Route must contain at least 2 points',
    },
  })
  points: Point[];

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  attributeId: string;

  @Prop({
    type: [AlternativeRoute],
    required: true,
  })
  routes: AlternativeRoute[];

  createdAt?: string;
  updatedAt?: string;
}

export type RouteDocument = Route & Document;
export const RouteSchema = SchemaFactory.createForClass(Route);
