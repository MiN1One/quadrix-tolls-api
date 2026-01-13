import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model, QueryFilter } from 'mongoose';
import { appConfig } from 'src/app.config';
import { IRouteToll, ITollApiResponse, TollType } from 'src/types/route.types';
import { IToll } from 'src/types/toll.types';
import { Toll, TollDocument } from './toll.schema';

const TOLL_API =
  'https://apis.tollguru.com/toll/v2/complete-polyline-from-mapping-service';

@Injectable()
export class TollService {
  constructor(
    @InjectModel(Toll.name)
    private readonly tollModel: Model<TollDocument>,

    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  async getTolls(filters: QueryFilter<TollDocument> = {}) {
    return await this.tollModel.find(filters).exec();
  }

  async fetchRouteToll(polyline: string): Promise<IRouteToll | null> {
    try {
      const {
        data: { route },
      } = await axios.post<ITollApiResponse>(
        TOLL_API,
        {
          mapProvider: 'custom',
          polyline,
          vehicle: { type: '5AxlesTruck' },
        },
        {
          headers: {
            'x-api-key': this.config.tollGuruApiKey,
          },
        },
      );

      const totalToll = route.costs.prepaidCard ?? 0;
      const licensePlateToll = route.costs.licensePlate ?? 0;
      const tolls = this.mapTollData(route.tolls);

      this.createToll(tolls);

      return {
        currency: route.costs.currency,
        totalToll,
        licensePlateToll,
        totalExpressToll: route.costs.expressLanes?.tagCost,
        licensePlateExpressToll: route.costs.expressLanes?.licensePlateCost,
        hasExpressLane: !!route.costs.expressLanes,
        fuelExpense: route.costs.fuel,
        tolls,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Logger.error(error.response?.data, 'RouteService.fetchRouteToll');
      } else {
        Logger.error(error, 'RouteService.fetchRouteToll');
      }
      return null;
    }
  }

  async createToll(tolls: IToll[]) {
    const operations = tolls.map((toll) => ({
      updateOne: {
        filter: { id: toll.id },
        update: { $set: toll },
        upsert: true,
      },
    }));
    return await this.tollModel.bulkWrite(operations, { ordered: false });
  }

  mapTollData(tolls: TollType[]): IToll[] {
    return tolls.flatMap((toll) => {
      let tollData: IToll = {
        type: toll.type,
        lng: 0,
        lat: 0,
        name: '',
        primaryTags: toll.tagPrimaryNames,
        road: toll.road,
        price: toll.tagCost || toll.prepaidCardCost || 0,
        currency: toll.currency,
        isExpress: !!toll.isExpressLane,
        expressDirection: null,
        priceLicensePlate: toll.licensePlateCost || 0,
        id: toll.id,
        licensePlateTags: toll.licensePlateNames,
      };
      if ('start' in toll && 'end' in toll) {
        return [
          {
            ...tollData,
            lng: toll.start.lng,
            lat: toll.start.lat,
            name: toll.start.name || '',
            id: toll.start.id,
          },
          {
            ...tollData,
            lng: toll.end.lng,
            lat: toll.end.lat,
            name: toll.end.name || '',
            id: toll.end.id,
          },
        ];
      }
      tollData.lng = toll.lng;
      tollData.lat = toll.lat;
      tollData.name = toll.name;
      return [tollData];
    });
  }
}
