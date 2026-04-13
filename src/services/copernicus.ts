import type { SearchParams } from "@/types/domain";

export function buildStacSearchRequest(params: SearchParams) {
  return {
    collections: [params.collection ?? "sentinel-2-l2a"],
    bbox: [
      params.region.minLng,
      params.region.minLat,
      params.region.maxLng,
      params.region.maxLat,
    ],
    datetime: `${params.startDate}/${params.endDate}`,
    limit: 20,
    query: {
      "eo:cloud_cover": {
        lte: params.maxCloudCoverage,
      },
    },
  };
}

export const COPERNICUS_ENDPOINTS = {
  stacApiUrl: process.env.CDSE_STAC_API_URL,
  stacSearchUrl: process.env.CDSE_STAC_SEARCH_URL,
  odataApiUrl: process.env.CDSE_ODATA_API_URL,
  processApiUrl: process.env.CDSE_PROCESS_API_URL,
  tokenUrl: process.env.CDSE_TOKEN_URL,
};
