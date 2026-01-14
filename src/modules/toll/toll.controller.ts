import { Controller, Get, Query } from '@nestjs/common';
import { IPaginationQuery } from 'src/types/common.types';
import { TollService } from './toll.service';

@Controller('toll')
export class TollController {
  constructor(private readonly tollService: TollService) {}

  @Get()
  async getTolls(@Query() query: Record<string, any> & IPaginationQuery) {
    return await this.tollService.getTolls(query);
  }
}
