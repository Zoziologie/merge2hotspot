import Papa from "papaparse";

const REQUIRED_HEADERS = [
  "Submission ID",
  "Location ID",
  "Location",
  "Longitude",
  "Latitude",
  "Date",
  "State/Province",
];

export function parseMyEBirdCsv(csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
  });

  const fatalErrors = result.errors.filter(
    (error) => error.code !== "TooFewFields" && error.code !== "TooManyFields"
  );

  if (fatalErrors.length > 0) {
    const firstError = fatalErrors[0];
    throw new Error(`CSV file could not be parsed: ${firstError.message}`);
  }

  const fields = result.meta.fields ?? [];
  const missingHeaders = REQUIRED_HEADERS.filter((header) => !fields.includes(header));

  if (missingHeaders.length > 0) {
    throw new Error(`CSV file not valid. Missing headers: ${missingHeaders.join(", ")}`);
  }

  return result.data.map((row) => ({
    subId: String(row["Submission ID"] ?? "").trim(),
    locId: String(row["Location ID"] ?? "").trim(),
    locname: String(row["Location"] ?? "").trim(),
    lng: String(row["Longitude"] ?? "").trim(),
    lat: String(row["Latitude"] ?? "").trim(),
    date: String(row["Date"] ?? "").trim(),
    region: String(row["State/Province"] ?? "").trim(),
  }));
}

export function normalizeRegionCode(region) {
  const rawRegion = String(region ?? "");
  const baseRegion = rawRegion.split("-")[0];
  return ["US", "CA"].includes(baseRegion) ? rawRegion : baseRegion;
}

export function buildMyLocations(rows) {
  const normalizedRows = rows.filter(
    (row) => Number.isFinite(Number(row.lat)) && Number.isFinite(Number(row.lng))
  );

  const groupedRows = new Map();
  for (const row of normalizedRows) {
    if (!groupedRows.has(row.locId)) {
      groupedRows.set(row.locId, []);
    }
    groupedRows.get(row.locId).push(row);
  }

  return [...groupedRows.entries()].map(([locId, locRows]) => {
    const firstRow = locRows[0];
    const checklistIds = [...new Set(locRows.map((row) => row.subId).filter(Boolean))];
    return {
      locId,
      locname: firstRow.locname,
      lng: Number.parseFloat(firstRow.lng),
      lat: Number.parseFloat(firstRow.lat),
      subId: checklistIds,
      checklistCount: checklistIds.length,
      date_last: new Date(Math.max(...locRows.map((row) => new Date(row.date).getTime()))),
      region: normalizeRegionCode(firstRow.region),
    };
  });
}

export function summarizeRegions(regions, locations) {
  const stats = new Map();

  for (const location of locations) {
    const current = stats.get(location.region) ?? { subIdNb: 0, locIdNb: 0 };
    current.subIdNb += location.checklistCount ?? location.subId.length;
    current.locIdNb += 1;
    stats.set(location.region, current);
  }

  return regions.map((region) => {
    const entry = stats.get(region.code) ?? { subIdNb: 0, locIdNb: 0 };
    return {
      ...region,
      subIdNb: entry.subIdNb,
      locIdNb: entry.locIdNb,
    };
  });
}

export function normalizeHotspots(rawHotspots) {
  return rawHotspots
    .map((hotspot) => ({
      ...hotspot,
      lng: Number.parseFloat(hotspot.Longitude ?? hotspot.lng),
      lat: Number.parseFloat(hotspot.Latitude ?? hotspot.lat),
    }))
    .filter((hotspot) => Number.isFinite(hotspot.lng) && Number.isFinite(hotspot.lat));
}

export function mergeByLocId(existingItems, incomingItems) {
  return [...new Map([...existingItems, ...incomingItems].map((item) => [item.locId, item])).values()];
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos((Math.PI * (lon1 - lon2)) / 180);
  return ((Math.acos(Math.min(dist, 1)) * 180) / Math.PI) * 60 * 1.1515 * 1.609344;
}

export function formatDistance(distanceKm) {
  if (!Number.isFinite(distanceKm)) {
    return "n/a";
  }

  if (distanceKm < 1) {
    return `${Math.max(1, Math.round(distanceKm * 1000))} m`;
  }

  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1).replace(/\.0$/, "")} km`;
  }

  return `${Math.round(distanceKm)} km`;
}

export function findClosestHotspot(location, hotspots) {
  if (hotspots.length === 0) {
    return null;
  }

  const closest = hotspots.reduce(
    (accumulator, hotspot) => {
      const dist = calculateDistance(location.lat, location.lng, hotspot.lat, hotspot.lng);
      return accumulator.dist > dist ? { hotspot, dist } : accumulator;
    },
    { hotspot: null, dist: Infinity }
  );

  if (!closest.hotspot) {
    return null;
  }

  return {
    ...closest.hotspot,
    dist: closest.dist,
  };
}

export function buildPersonalLocations(myLocations, hotspots, downloadedRegionCodes) {
  const hotspotLocIds = new Set(hotspots.map((hotspot) => hotspot.locId));
  const downloadedRegions = new Set(downloadedRegionCodes);

  return myLocations
    .filter((location) => downloadedRegions.has(location.region) && !hotspotLocIds.has(location.locId))
    .map((location) => {
      const closestHotspot = findClosestHotspot(location, hotspots);
      return {
        ...location,
        subIdNb: location.checklistCount ?? location.subId.length,
        closestHotspot,
      };
    });
}

export function sortPersonalLocations(locations, sortBy) {
  const sortedLocations = [...locations];

  if (sortBy === "time") {
    return sortedLocations.sort((a, b) => b.date_last - a.date_last);
  }

  if (sortBy === "number") {
    return sortedLocations.sort((a, b) => b.subIdNb - a.subIdNb);
  }

  if (sortBy === "distance") {
    return sortedLocations.sort(
      (a, b) => (a.closestHotspot?.dist ?? Number.POSITIVE_INFINITY) - (b.closestHotspot?.dist ?? Number.POSITIVE_INFINITY)
    );
  }

  return sortedLocations;
}

export function buildFeatureCollection(items, kind) {
  return {
    type: "FeatureCollection",
    features: items.map((item) => ({
      type: "Feature",
      properties: {
        ...item,
        kind,
      },
      geometry: {
        coordinates: [item.lng, item.lat],
        type: "Point",
      },
    })),
  };
}
