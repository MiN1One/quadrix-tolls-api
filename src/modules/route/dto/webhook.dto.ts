import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IRoutePoint } from 'src/types/route.types';
import { IWebhookData } from 'src/types/webhook.types';
import { RoutePointDto } from './get-route.dto';

export class WebhookDataDto implements IWebhookData {
  @IsString()
  attributeId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => RoutePointDto)
  points: IRoutePoint[];
}
