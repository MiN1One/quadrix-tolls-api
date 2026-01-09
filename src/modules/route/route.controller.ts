import { Body, Controller, Post } from '@nestjs/common';
import { GetRouteDto } from './dto/get-route.dto';
import { RouteService } from './route.service';

@Controller('')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  async getRoute(@Body() payload: GetRouteDto) {
    const routeData = await this.routeService.getRouteByPoints(payload);
    return routeData;
  }
}
