import { Earthquake } from './mockData';

export function generatePredictions(currentEarthquakes: Earthquake[]): Earthquake[] {
  const predictions: Earthquake[] = [];
  const now = new Date();

  // 1. Predict aftershocks for major earthquakes (> 5.0)
  currentEarthquakes
    .filter(eq => eq.magnitude >= 5.0)
    .forEach(eq => {
      // Create 1-2 predicted aftershocks
      const numAftershocks = Math.floor(Math.random() * 2) + 1;
      
      for (let i = 0; i < numAftershocks; i++) {
        // Random offset within ~50km (approx 0.5 degrees)
        const latOffset = (Math.random() - 0.5);
        const lngOffset = (Math.random() - 0.5);
        
        predictions.push({
          id: `pred-${eq.id}-${i}`,
          location: `Predicted Aftershock: ${eq.location}`,
          magnitude: Number((eq.magnitude * (0.6 + Math.random() * 0.2)).toFixed(1)), // 60-80% of main shock
          depth: Number((eq.depth * (0.8 + Math.random() * 0.4)).toFixed(1)),
          time: new Date(now.getTime() + (Math.random() * 24 * 60 * 60 * 1000)).toISOString(), // Next 24h
          coordinates: [
            eq.coordinates[0] + latOffset,
            eq.coordinates[1] + lngOffset
          ],
          alertLevel: 'Yellow', // Usually lower than main shock
          isPredicted: true
        });
      }
    });

  // 2. Add a random "High Risk Zone" prediction if few predictions exist
  if (predictions.length < 3) {
    predictions.push({
      id: `pred-risk-zone-${Date.now()}`,
      location: 'High Risk Zone: Pacific Ring',
      magnitude: 6.5,
      depth: 10,
      time: new Date(now.getTime() + (12 * 60 * 60 * 1000)).toISOString(),
      coordinates: [35.0, 140.0], // Near Japan
      alertLevel: 'Red',
      isPredicted: true
    });
  }

  return predictions;
}
