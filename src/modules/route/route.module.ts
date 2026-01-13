import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TollModule } from '../toll/toll.module';
import { RouteController } from './route.controller';
import { Route, RouteSchema } from './route.scheme';
import { RouteService } from './route.service';

@Module({
  controllers: [RouteController],
  providers: [RouteService],
  imports: [
    TollModule,
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
  ],
})
export class RouteModule {}
