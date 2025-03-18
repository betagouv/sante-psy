const MAX_DISTANCE_KM = 2000;

// Inspired from https://www.geodatasource.com/developers/javascript
/**
 * Calculates the distance in kilometers between two geographical points.
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @returns {number} - Distance in kilometers.
 */
const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) : number => {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return MAX_DISTANCE_KM;
  }

  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0;
  }

  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist * 1.609344;
};

module.exports = { distanceKm };
