async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load regions from ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function loadRegions(apiKey) {
  const [worldRegions, usRegions, caRegions] = await Promise.all([
    fetchJson(`https://api.ebird.org/v2/ref/region/list/country/world?key=${apiKey}`),
    fetchJson(`https://api.ebird.org/v2/ref/region/list/subnational1/US?key=${apiKey}`),
    fetchJson(`https://api.ebird.org/v2/ref/region/list/subnational1/CA?key=${apiKey}`),
  ]);

  const regions = [
    ...worldRegions.filter((region) => !["US", "CA"].includes(region.code)),
    ...usRegions,
    ...caRegions,
  ];

  return [...new Map(regions.map((region) => [region.code, region])).values()]
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map((region) => ({
      ...region,
      status: null,
      subIdNb: 0,
      locIdNb: 0,
      locPerNb: 0,
    }));
}
