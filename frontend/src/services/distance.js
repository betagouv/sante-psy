const distanceKm = (lat1, lon1, lat2, lon2) => {
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

const MAX_DISTANCE_KM = 2000;

const comparator = (psyA, psyB, userPosition) => {
  if (!userPosition || !userPosition.longitude) {
    return 0;
  }

  let distanceA;
  let distanceB;
  if (!psyA.longitude) {
    distanceA = MAX_DISTANCE_KM;
  } else {
    distanceA = distanceKm(userPosition.latitude, userPosition.longitude, psyA.latitude, psyA.longitude);
  }
  if (!psyB.longitude) {
    distanceB = MAX_DISTANCE_KM;
  } else {
    distanceB = distanceKm(userPosition.latitude, userPosition.longitude, psyB.latitude, psyB.longitude);
  }
  return distanceA - distanceB;
};

module.exports = { comparator };
