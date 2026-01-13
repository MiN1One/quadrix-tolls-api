import { Body, Controller, Param, Post } from '@nestjs/common';
import type { EWebhookTopic, IWebhookData } from 'src/types/webhook.types';
import { GetRouteDto } from './dto/get-route.dto';
import { RouteService } from './route.service';

@Controller()
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  async getRoute(@Body() payload: GetRouteDto) {
    return await this.routeService.getRouteByPoints(payload);
  }

  @Post('webhook/:topic')
  async processWebhook(
    @Body() payload: IWebhookData,
    @Param('topic') topic: EWebhookTopic,
  ) {
    await this.routeService.processWebhook(topic, payload);
  }
}
