import distanceKm from '../services/distance';
import { Psychologist } from '../types/Psychologist';

type Position = {
  longitude: number;
  latitude: number;
};
export const getPsyDistanceKm = (
  psy: Psychologist,
  position: Position,
): number => {
  let distance = 10000;
  if (psy.longitude && psy.latitude) {
    distance = distanceKm(
      position.latitude,
      position.longitude,
      psy.latitude,
      psy.longitude,
    );
  }
  if (psy.otherLongitude && psy.otherLatitude) {
    const otherDistance = distanceKm(
      position.latitude,
      position.longitude,
      psy.otherLatitude,
      psy.otherLongitude,
    );
    return otherDistance < distance ? otherDistance : distance;
  }

  return distance;
};
