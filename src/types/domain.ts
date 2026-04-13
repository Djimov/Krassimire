export type Region = {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
};

export type SearchParams = {
  region: Region;
  startDate: string;
  endDate: string;
  maxCloudCoverage: number;
  collection: string;
};

export type BandMode = "true-color" | "false-color";
