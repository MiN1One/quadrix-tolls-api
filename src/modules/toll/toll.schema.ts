import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IToll } from 'src/types/toll.types';

@Schema({ timestamps: true })
export class Toll implements IToll {
  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, default: null })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  priceLicensePlate: number;

  @Prop({ type: Boolean, default: false })
  isExpress: boolean;

  @Prop({ type: String, required: true })
  currency: string;

  @Prop({ type: Number, required: true })
  lng: number;

  @Prop({ type: Number, required: true })
  lat: number;

  @Prop({ type: String, default: null })
  expressDirection: 'exit' | 'entry' | null;

  @Prop({ type: String, default: null })
  road: string;

  @Prop({ type: Number, required: true, unique: true })
  id: number;

  @Prop({ type: [String], default: [] })
  primaryTags: string[];

  @Prop({ type: [String], default: [] })
  licensePlateTags: string[];
}

export type TollDocument = Toll & Document;
export const TollSchema = SchemaFactory.createForClass(Toll);

TollSchema.plugin(mongoosePaginate);
