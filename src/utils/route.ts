import crypto from 'crypto';
import { IRoutePoint } from 'src/types/route.types';

const PRECISION = 6;

export const normalizePoints = (points: IRoutePoint[]): IRoutePoint[] => {
  return points.map((p) => ({
    lng: Number(p.lng.toFixed(PRECISION)),
    lat: Number(p.lat.toFixed(PRECISION)),
  }));
};

export const hashFromPoints = (points: IRoutePoint[]) => {
  const str = points
    .map((p) => `${p.lng.toFixed(PRECISION)},${p.lat.toFixed(PRECISION)}`)
    .join('|');

  return crypto.createHash('sha256').update(str).digest('hex');
};

export const buildCanonicalRouteHash = (points: IRoutePoint[]): string => {
  const forward = hashFromPoints(points);
  const reverse = hashFromPoints([...points].reverse());
  return forward < reverse ? forward : reverse;
};
