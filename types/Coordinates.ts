export type Coordinates = {
  longitude: number,
  latitude: number
}

export type CoordinatesAPI = {
  features: {
    geometry: {
      coordinates: number[]
    },
    properties: {
      score: number,
      label: string
    },
  }[],
}
