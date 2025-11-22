import { Earthquake } from './mockData';

export interface EarthquakeFilter {
  minMagnitude: number;
  timeRange: 'hour' | 'day' | 'week';
}

export async function fetchEarthquakes(filter: EarthquakeFilter): Promise<Earthquake[]> {
  const baseUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
  
  // Calculate start time based on range
  const now = new Date();
  let startTime = new Date();
  
  switch (filter.timeRange) {
    case 'hour':
      startTime.setHours(now.getHours() - 1);
      break;
    case 'day':
      startTime.setDate(now.getDate() - 1);
      break;
    case 'week':
      startTime.setDate(now.getDate() - 7);
      break;
  }

  const params = new URLSearchParams({
    format: 'geojson',
    starttime: startTime.toISOString(),
    minmagnitude: filter.minMagnitude.toString(),
    orderby: 'time',
    limit: '200' // Cap to prevent performance issues
  });

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch earthquake data');
    }

    const data = await response.json();
    
    // Transform GeoJSON to our Earthquake interface
    return data.features.map((feature: any) => {
      const { mag, place, time, alert, url, detail } = feature.properties;
      const [lng, lat, depth] = feature.geometry.coordinates;

      // Determine alert level if not provided by API (API often returns null for alert)
      let alertLevel: 'Green' | 'Yellow' | 'Red' = 'Green';
      if (alert) {
        alertLevel = alert.charAt(0).toUpperCase() + alert.slice(1) as 'Green' | 'Yellow' | 'Red';
      } else {
        // Fallback logic based on magnitude
        if (mag >= 5 && mag < 7) alertLevel = 'Yellow';
        if (mag >= 7) alertLevel = 'Red';
      }

      return {
        id: feature.id,
        location: place || 'Unknown Location',
        coordinates: [lat, lng],
        magnitude: mag,
        depth: depth,
        time: new Date(time).toISOString(),
        alertLevel: alertLevel
      };
    });
  } catch (error) {
    console.error('Error fetching earthquakes:', error);
    throw error;
  }
}
