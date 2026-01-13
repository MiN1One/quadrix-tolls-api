import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TollController } from './toll.controller';
import { Toll, TollSchema } from './toll.schema';
import { TollService } from './toll.service';

@Module({
  controllers: [TollController],
  providers: [TollService],
  imports: [
    MongooseModule.forFeature([{ name: Toll.name, schema: TollSchema }]),
  ],
  exports: [TollService],
})
export class TollModule {}
