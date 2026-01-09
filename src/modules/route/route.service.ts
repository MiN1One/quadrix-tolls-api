import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { appConfig } from 'src/app.config';
import {
  IAlternativeRoute,
  IFetchRouteResponse,
  IRoutePoint,
  ITollApiResponse,
} from 'src/types/route.types';
import { buildCanonicalRouteHash, normalizePoints } from 'src/utils/route';
import { GetRouteDto } from './dto/get-route.dto';
import { Route, RouteDocument } from './route.scheme';

const TOLL_API =
  'https://apis.tollguru.com/toll/v2/complete-polyline-from-mapping-service';
const ROUTE_API = 'https://route.ataxi.uz/graphhopper/route';
const BROADCAST_API = 'https://ws.quadrix.ai/broadcast/route-calculated';

@Injectable()
export class RouteService {
  constructor(
    @InjectModel(Route.name)
    private readonly routeModel: Model<RouteDocument>,

    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  async fetchRouteToll(polyline: string) {
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

      return {
        currency: route.costs.currency,
        totalToll: route.costs.expressLanes?.tagCost || null,
        licensePlateToll: route.costs.expressLanes?.licensePlateCost || null,
        fuelExpense: route.costs.fuel,
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

  async getRouteDataWithToll(data: IFetchRouteResponse) {
    const routesResult = await Promise.allSettled(
      data.paths.map<Promise<IAlternativeRoute>>(async (path) => {
        const toll = await this.fetchRouteToll(path.points);
        const route: IAlternativeRoute = {
          distanceKilometers: path.distance,
          durationSeconds: path.time,
          polyline: path.points,
          toll,
        };
        return route;
      }),
    );

    const routes = routesResult
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);

    return routes;
  }

  async createRoute(
    attributeId: string,
    points: IRoutePoint[],
    data: IFetchRouteResponse,
  ) {
    if (!data.paths.length) {
      throw new BadRequestException('Graphhopper could not any routes');
    }
    const routes = await this.getRouteDataWithToll(data);
    return await this.routeModel.findOneAndUpdate(
      { attributeId },
      {
        $setOnInsert: {
          attributeId,
          points,
          routes,
        },
      },
      { upsert: true, new: true },
    );
  }

  async updateRouteTollsByAttributeId(attributeId: string) {
    const existingRoute = await this.routeModel.findOne({ attributeId });
    if (existingRoute) {
      existingRoute.routes = await Promise.all(
        existingRoute.routes.map(async (r) => {
          r.toll = await this.fetchRouteToll(r.polyline);
          return r;
        }),
      );
      await existingRoute.save();
    }
    return existingRoute!;
  }

  async getRoutesByAttributeId(attributeId: string) {
    return await this.routeModel.findOne({ attributeId });
  }

  async getRouteByPoints({ attributeId, points }: GetRouteDto) {
    if (!attributeId) {
      const normalizedPoints = normalizePoints(points);
      attributeId = buildCanonicalRouteHash(normalizedPoints);
    }
    const existingRoute = await this.getRoutesByAttributeId(attributeId);

    if (existingRoute) {
      if (!this.hasFetchedTolls(existingRoute)) {
        (async () => {
          const route = await this.updateRouteTollsByAttributeId(attributeId);
          await this.broadCastRouteData(route);
        })();
        return { attributeId, data: null };
      }
      return {
        data: existingRoute,
        attributeId,
      };
    }

    (async () => {
      const data = await this.fetchGraphHopperRoute(points);
      const route = await this.createRoute(attributeId, points, data);
      await this.broadCastRouteData(route);
    })();

    return { attributeId, data: null };
  }

  async broadCastRouteData(route: RouteDocument) {
    await axios.post(BROADCAST_API, { route });
  }

  async fetchGraphHopperRoute(points: IRoutePoint[]) {
    try {
      const pointsString = points
        .map(({ lng, lat }) => `point=${lat},${lng}`)
        .join('&');
      const routesCount = points.length > 2 ? 1 : 3;
      const url = `${ROUTE_API}?${pointsString}`;
      const alternateRouteParams =
        points.length < 3
          ? {
              algorithm: 'alternative_route',
              'alternative_route.max_paths': routesCount,
              'alternative_route.max_weight_factor': 1.4,
              'alternative_route.max_share_factor': 0.6,
            }
          : {};
      const { data } = await axios(url, {
        params: {
          profile: 'truck',
          height: 4.1,
          width: 2.6,
          weight: 40,
          ...alternateRouteParams,
        },
      });
      return data as IFetchRouteResponse;
    } catch (er) {
      Logger.error(er, 'RouteService.fetchGraphhopperRoute');
      throw new BadRequestException(
        'Route cannot be retrieved',
        JSON.stringify(er),
      );
    }
  }

  private hasFetchedTolls(route: RouteDocument) {
    return route.routes.length > 0 && route.routes.every((r) => r.toll);
  }
}
