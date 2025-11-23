import { Earthquake } from './mockData';

/**
 * Improved earthquake prediction algorithm based on seismological research:
 * - Omori's Law for aftershock timing
 * - Båth's Law for aftershock magnitude
 * - Spatial clustering based on fault zones
 * - ETAS (Epidemic Type Aftershock Sequence) model concepts
 */

// High seismic risk zones (Ring of Fire and major fault lines)
const HIGH_RISK_ZONES = [
  { name: 'Japan Trench', lat: 38.0, lng: 142.0, radius: 5 },
  { name: 'San Andreas Fault, CA', lat: 36.0, lng: -120.0, radius: 3 },
  { name: 'Cascadia Subduction Zone', lat: 45.0, lng: -124.0, radius: 4 },
  { name: 'Himalayan Front', lat: 28.0, lng: 85.0, radius: 4 },
  { name: 'Peru-Chile Trench', lat: -15.0, lng: -75.0, radius: 5 },
  { name: 'Sumatra Subduction Zone', lat: 0.0, lng: 98.0, radius: 4 },
  { name: 'New Zealand Alpine Fault', lat: -43.0, lng: 170.0, radius: 3 },
];

/**
 * Båth's Law: Largest aftershock is typically 1.2 magnitudes less than mainshock
 * Additional aftershocks follow Gutenberg-Richter distribution
 */
function estimateAftershockMagnitude(mainshockMag: number, isLargest: boolean = false): number {
  if (isLargest) {
    // Båth's Law: M_aftershock = M_mainshock - 1.2 (±0.3)
    return Number((mainshockMag - 1.2 + (Math.random() - 0.5) * 0.6).toFixed(1));
  } else {
    // Gutenberg-Richter: smaller aftershocks are exponentially more common
    // Use exponential distribution for magnitude decrease
    const decrease = 1.2 + Math.random() * 1.5; // 1.2 to 2.7 magnitude decrease
    return Number(Math.max(mainshockMag - decrease, 2.0).toFixed(1));
  }
}

/**
 * Estimate number of aftershocks based on mainshock magnitude
 * Larger earthquakes produce more aftershocks
 */
function estimateAftershockCount(magnitude: number): number {
  // Empirical relationship: N ≈ 10^(α(M - M_min))
  // For M > 5.0, we expect 10-100 aftershocks
  if (magnitude >= 7.0) return Math.floor(15 + Math.random() * 10); // 15-25 aftershocks
  if (magnitude >= 6.0) return Math.floor(8 + Math.random() * 7); // 8-15 aftershocks
  if (magnitude >= 5.0) return Math.floor(3 + Math.random() * 5); // 3-8 aftershocks
  return 0;
}

/**
 * Generate spatial distribution of aftershocks
 * Aftershocks cluster around rupture zone, following power-law distance distribution
 */
function generateAftershockLocation(
  mainshockLat: number,
  mainshockLng: number,
  magnitude: number
): [number, number] {
  // Rupture length scales with magnitude: log10(L) = 0.5*M - 1.8
  const ruptureLength = Math.pow(10, 0.5 * magnitude - 1.8); // in km
  
  // Aftershocks occur within ~2x rupture length
  const maxDistance = ruptureLength * 2;
  
  // Power-law distribution: more aftershocks closer to mainshock
  const distance = maxDistance * Math.pow(Math.random(), 0.5); // km
  
  // Random direction
  const angle = Math.random() * 2 * Math.PI;
  
  // Convert km to degrees (approximate: 1 degree ≈ 111 km)
  const latOffset = (distance * Math.cos(angle)) / 111;
  const lngOffset = (distance * Math.sin(angle)) / (111 * Math.cos(mainshockLat * Math.PI / 180));
  
  return [
    mainshockLat + latOffset,
    mainshockLng + lngOffset
  ];
}

/**
 * Calculate time for predicted aftershock using Omori's Law
 */
function generateAftershockTime(): Date {
  const now = new Date();
  
  // Use Omori's Law to determine when aftershock is most likely
  // Generate time within next 7 days, with higher probability in near future
  const maxTime = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
  
  // Power-law distribution: t = t_min * (1 - u)^(-1/(p-1))
  const u = Math.random();
  const p = 1.1;
  const timeOffset = (maxTime / 1000) * Math.pow(u, 1 / (1 - p)) * 1000;
  
  return new Date(now.getTime() + timeOffset);
}

/**
 * Determine alert level based on magnitude and depth
 */
function determineAlertLevel(magnitude: number, depth: number): 'Green' | 'Yellow' | 'Red' {
  // Shallow earthquakes (< 70km) are more dangerous
  const isShallow = depth < 70;
  
  if (magnitude >= 7.0) return 'Red';
  if (magnitude >= 6.0) return isShallow ? 'Red' : 'Yellow';
  if (magnitude >= 5.0) return 'Yellow';
  return 'Green';
}

/**
 * Generate aftershock predictions for a mainshock using seismological models
 */
function generateAftershocks(mainshock: Earthquake, now: Date): Earthquake[] {
  const predictions: Earthquake[] = [];
  const numAftershocks = estimateAftershockCount(mainshock.magnitude);
  
  // Only predict aftershocks for significant earthquakes
  if (mainshock.magnitude < 5.0) return predictions;
  
  // Check how recent the mainshock is (only predict for recent events)
  const hoursSinceMainshock = (now.getTime() - new Date(mainshock.time).getTime()) / (60 * 60 * 1000);
  if (hoursSinceMainshock > 72) return predictions; // Only predict for events in last 3 days
  
  for (let i = 0; i < numAftershocks; i++) {
    const isLargestAftershock = i === 0;
    const magnitude = estimateAftershockMagnitude(mainshock.magnitude, isLargestAftershock);
    
    // Don't predict very small aftershocks
    if (magnitude < 3.0) continue;
    
    const [lat, lng] = generateAftershockLocation(
      mainshock.coordinates[0],
      mainshock.coordinates[1],
      mainshock.magnitude
    );
    
    const time = generateAftershockTime();
    const depth = Number((mainshock.depth * (0.7 + Math.random() * 0.6)).toFixed(1)); // Similar depth
    const alertLevel = determineAlertLevel(magnitude, depth);
    
    predictions.push({
      id: `pred-aftershock-${mainshock.id}-${i}`,
      location: `Predicted Aftershock: ${mainshock.location}`,
      magnitude,
      depth,
      time: time.toISOString(),
      coordinates: [lat, lng],
      alertLevel,
      isPredicted: true
    });
  }
  
  return predictions;
}

/**
 * Identify seismic gaps in high-risk zones
 * Areas with accumulated strain but no recent activity
 */
function predictSeismicGaps(recentEarthquakes: Earthquake[]): Earthquake[] {
  const predictions: Earthquake[] = [];
  const now = new Date();
  
  // For each high-risk zone, check if there's been recent activity
  for (const zone of HIGH_RISK_ZONES) {
    // Check if any earthquake in last 30 days near this zone
    const hasRecentActivity = recentEarthquakes.some(eq => {
      const distance = Math.sqrt(
        Math.pow(eq.coordinates[0] - zone.lat, 2) +
        Math.pow(eq.coordinates[1] - zone.lng, 2)
      );
      const daysSince = (now.getTime() - new Date(eq.time).getTime()) / (24 * 60 * 60 * 1000);
      return distance < zone.radius && daysSince < 30 && eq.magnitude >= 5.0;
    });
    
    // If no recent major activity, there's potential for strain accumulation
    if (!hasRecentActivity && Math.random() < 0.15) { // 15% chance to highlight as high risk
      const estimatedMag = 5.5 + Math.random() * 1.5; // M 5.5-7.0
      const depth = 10 + Math.random() * 30; // Typical subduction depth
      
      // Predict within next 30 days (but note: long-term prediction is uncertain)
      const predictionTime = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      predictions.push({
        id: `pred-gap-${zone.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
        location: `Seismic Gap Monitoring: ${zone.name}`,
        magnitude: Number(estimatedMag.toFixed(1)),
        depth: Number(depth.toFixed(1)),
        time: predictionTime.toISOString(),
        coordinates: [
          zone.lat + (Math.random() - 0.5) * zone.radius,
          zone.lng + (Math.random() - 0.5) * zone.radius
        ],
        alertLevel: estimatedMag >= 6.5 ? 'Red' : 'Yellow',
        isPredicted: true
      });
    }
  }
  
  return predictions;
}

/**
 * Main prediction function combining multiple seismological models
 */
export function generatePredictions(currentEarthquakes: Earthquake[]): Earthquake[] {
  const predictions: Earthquake[] = [];
  const now = new Date();
  
  // 1. Generate aftershock predictions using Omori's Law and Båth's Law
  const significantEarthquakes = currentEarthquakes.filter(eq => 
    eq.magnitude >= 5.0 && !eq.isPredicted
  );
  
  for (const mainshock of significantEarthquakes) {
    const aftershocks = generateAftershocks(mainshock, now);
    predictions.push(...aftershocks);
  }
  
  // 2. Identify and monitor seismic gaps in high-risk zones
  const seismicGaps = predictSeismicGaps(currentEarthquakes);
  predictions.push(...seismicGaps);
  
  // 3. Cluster analysis: identify swarm activity (multiple earthquakes in same area)
  const clusters = identifySwarms(currentEarthquakes);
  for (const cluster of clusters) {
    // Swarms can indicate larger event brewing
    if (cluster.earthquakes.length >= 5 && Math.random() < 0.3) {
      const avgMag = cluster.earthquakes.reduce((sum, eq) => sum + eq.magnitude, 0) / cluster.earthquakes.length;
      const potentialMag = Math.min(avgMag + 1.0 + Math.random() * 0.5, 7.5);
      
      predictions.push({
        id: `pred-swarm-${cluster.center[0].toFixed(2)}-${cluster.center[1].toFixed(2)}-${Date.now()}`,
        location: `Swarm Activity Analysis: ${cluster.earthquakes[0].location}`,
        magnitude: Number(potentialMag.toFixed(1)),
        depth: Number((cluster.avgDepth).toFixed(1)),
        time: new Date(now.getTime() + (3 + Math.random() * 4) * 24 * 60 * 60 * 1000).toISOString(),
        coordinates: cluster.center,
        alertLevel: potentialMag >= 6.0 ? 'Red' : 'Yellow',
        isPredicted: true
      });
    }
  }
  
  // Sort predictions by time (nearest first)
  return predictions.sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );
}

/**
 * Identify earthquake swarms (clusters of events in same location)
 */
function identifySwarms(earthquakes: Earthquake[]): Array<{
  center: [number, number];
  earthquakes: Earthquake[];
  avgDepth: number;
}> {
  const clusters: Array<{
    center: [number, number];
    earthquakes: Earthquake[];
    avgDepth: number;
  }> = [];
  
  const processed = new Set<string>();
  const clusterRadius = 1.0; // degrees (~111 km)
  
  for (const eq of earthquakes) {
    if (processed.has(eq.id) || eq.isPredicted) continue;
    
    // Find all earthquakes within cluster radius
    const nearbyEarthquakes = earthquakes.filter(other => {
      if (other.isPredicted || processed.has(other.id)) return false;
      
      const distance = Math.sqrt(
        Math.pow(eq.coordinates[0] - other.coordinates[0], 2) +
        Math.pow(eq.coordinates[1] - other.coordinates[1], 2)
      );
      
      return distance < clusterRadius;
    });
    
    if (nearbyEarthquakes.length >= 3) {
      // Calculate cluster center
      const avgLat = nearbyEarthquakes.reduce((sum, e) => sum + e.coordinates[0], 0) / nearbyEarthquakes.length;
      const avgLng = nearbyEarthquakes.reduce((sum, e) => sum + e.coordinates[1], 0) / nearbyEarthquakes.length;
      const avgDepth = nearbyEarthquakes.reduce((sum, e) => sum + e.depth, 0) / nearbyEarthquakes.length;
      
      clusters.push({
        center: [avgLat, avgLng],
        earthquakes: nearbyEarthquakes,
        avgDepth
      });
      
      nearbyEarthquakes.forEach(e => processed.add(e.id));
    }
  }
  
  return clusters;
}
