import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IRoutePoint } from 'src/types/route.types';

class RoutePoint implements IRoutePoint {
  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;
}

export class GetRouteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => RoutePoint)
  points: IRoutePoint[];

  @IsString()
  @IsOptional()
  attributeId?: string;

  @IsOptional()
  @IsOptional()
  includeTolls?: boolean;
}
