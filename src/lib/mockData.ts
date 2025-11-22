export interface Earthquake {
  id: string;
  location: string;
  coordinates: [number, number];
  magnitude: number;
  depth: number;
  time: string;
  alertLevel: 'Green' | 'Yellow' | 'Red';
  isPredicted?: boolean;
}

export const generateMockData = (count = 50): Earthquake[] => {
  const locations = [
    "Pacific Ocean", "Japan Coast", "California, USA", "Chile", "Indonesia", 
    "Alaska, USA", "New Zealand", "Mexico", "Philippines", "Peru",
    "Iceland", "Turkey", "Greece", "Italy", "Nepal"
  ];

  const alerts: Earthquake[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    // Random coordinates roughly around the world
    const lat = (Math.random() * 160 - 80).toFixed(4);
    const lng = (Math.random() * 360 - 180).toFixed(4);
    
    const magnitude = parseFloat((Math.random() * 7 + 2).toFixed(1)); // 2.0 to 9.0
    const depth = Math.floor(Math.random() * 100 + 5); // 5km to 105km
    
    // Time within last 24 hours
    const time = new Date(now.getTime() - Math.floor(Math.random() * 24 * 60 * 60 * 1000));

    let alertLevel: 'Green' | 'Yellow' | 'Red' = "Green";
    if (magnitude >= 5 && magnitude < 7) alertLevel = "Yellow";
    if (magnitude >= 7) alertLevel = "Red";

    alerts.push({
      id: `eq-${i}`,
      location: `${location} Region`,
      coordinates: [parseFloat(lat), parseFloat(lng)],
      magnitude,
      depth,
      time: time.toISOString(),
      alertLevel
    });
  }

  // Sort by time descending
  return alerts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
};
