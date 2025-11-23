# Earthquake Alert App

Real-time earthquake monitoring and prediction system using scientific seismological models.

## Features

- 🌍 **Real-time Data**: Live earthquake data from USGS
- 🔮 **Scientific Predictions**: Advanced aftershock predictions using:
  - Omori's Law for timing
  - Båth's Law for magnitude
  - Gutenberg-Richter distribution
  - Rupture length scaling
- 🗺️ **Interactive Map**: Visualize earthquakes worldwide with Leaflet
- 🎯 **Swarm Detection**: Identify earthquake clusters
- ⚠️ **Seismic Gap Analysis**: Monitor high-risk zones

## Getting Started

First, install dependencies:

```bash
npm install
```

Set up environment variables (recommended to prevent browser extension conflicts):

```bash
cp .env.example .env.local
```

This disables Next.js telemetry to prevent `ERR_BLOCKED_BY_CLIENT` errors from privacy extensions.

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Prediction Algorithm

The app uses a scientifically-based prediction algorithm implementing multiple peer-reviewed seismological models. For detailed technical documentation, see [PREDICTION_ALGORITHM.md](PREDICTION_ALGORITHM.md).

### Key Scientific Models

- **Omori's Law (1894)**: Aftershock rate decay over time
- **Båth's Law (1965)**: Aftershock magnitude estimation  
- **Gutenberg-Richter**: Magnitude-frequency distribution
- **Rupture Scaling**: Spatial distribution of aftershocks

### Testing Predictions

Run the test script to see algorithm behavior:

```bash
node test-predictions.js
```

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Maps**: Leaflet with React-Leaflet
- **Data Source**: USGS Earthquake Catalog API

## Usage

1. **View Real-time Earthquakes**: The app automatically loads recent earthquakes from USGS
2. **Filter by Magnitude**: Use the filter dropdown to show earthquakes above a certain magnitude
3. **Filter by Time**: Choose past hour, day, or week
4. **Search Locations**: Type a location name to filter earthquakes
5. **Enable Predictions**: Click the "🔮 Predictions" button to see predicted aftershocks (shown in purple)

## Building for Production

```bash
npm run build
npm start
```

## Learn More

- [USGS Earthquake Catalog API](https://earthquake.usgs.gov/fdsnws/event/1/)
- [Prediction Algorithm Documentation](PREDICTION_ALGORITHM.md)
- [Next.js Documentation](https://nextjs.org/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
