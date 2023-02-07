export type Coordinates = {
  longitude: number,
  latitude: number,
  city: string,
  postcode: string
}

export type CoordinatesAPI = {
  features: {
    geometry: {
      coordinates: number[]
    },
    properties: {
      score: number,
      label: string,
      city: string,
      postcode: string
    },
  }[],
}
