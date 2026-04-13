import { describe, expect, it } from "vitest";
import { buildStacSearchRequest } from "@/services/copernicus";

describe("buildStacSearchRequest", () => {
  it("builds a basic STAC payload", () => {
    const payload = buildStacSearchRequest({
      region: { minLng: -9, minLat: 38, maxLng: -8, maxLat: 39 },
      startDate: "2024-01-01T00:00:00Z",
      endDate: "2024-01-31T23:59:59Z",
      maxCloudCoverage: 20,
      collection: "sentinel-2-l2a",
    });

    expect(payload.collections).toEqual(["sentinel-2-l2a"]);
    expect(payload.bbox).toEqual([-9, 38, -8, 39]);
  });
});
