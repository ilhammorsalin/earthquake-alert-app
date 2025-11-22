'use client';

import EarthquakeList from '@/components/EarthquakeList';
import FilterBar from '@/components/FilterBar';
import { EarthquakeFilter, fetchEarthquakes } from '@/lib/api';
import { Earthquake } from '@/lib/mockData';
import { generatePredictions } from '@/lib/prediction';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

// Dynamically import Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">
      Loading Map...
    </div>
  )
});

export default function Home() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filter, setFilter] = useState<EarthquakeFilter>({
    minMagnitude: 0,
    timeRange: 'day'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isPredictionMode, setIsPredictionMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchEarthquakes(filter);
        setEarthquakes(data);
        // Reset selection if it's no longer in the list (optional, but good UX)
        if (selectedEarthquake && !data.find(eq => eq.id === selectedEarthquake.id)) {
          setSelectedEarthquake(null);
        }
      } catch (err) {
        setError('Failed to load earthquake data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filter]); // Re-fetch when filter changes

  // Client-side filtering for search query and prediction merging
  const displayedEarthquakes = useMemo(() => {
    let data = earthquakes;

    // 1. Generate and merge predictions if enabled
    if (isPredictionMode) {
      const predictions = generatePredictions(earthquakes);
      data = [...predictions, ...data];
    }

    // 2. Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      data = data.filter(eq => 
        eq.location.toLowerCase().includes(lowerQuery)
      );
    }
    
    return data;
  }, [earthquakes, searchQuery, isPredictionMode]);

  return (
    <main className="flex h-screen w-screen flex-col md:flex-row overflow-hidden bg-gray-100">
      {/* Sidebar List */}
      <div className="w-full md:w-96 h-1/3 md:h-full shrink-0 z-10 flex flex-col bg-white border-r border-gray-200 shadow-lg">
        <FilterBar 
          filter={filter} 
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isPredictionMode={isPredictionMode}
          onTogglePredictionMode={setIsPredictionMode}
        />
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Loading data...
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500 p-4 text-center">
            {error}
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <EarthquakeList 
              earthquakes={displayedEarthquakes} 
              onSelectEarthquake={setSelectedEarthquake}
              selectedId={selectedEarthquake?.id}
            />
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="flex-1 h-2/3 md:h-full relative">
        <Map 
          earthquakes={displayedEarthquakes} 
          selectedEarthquake={selectedEarthquake}
          onSelectEarthquake={setSelectedEarthquake}
        />
        
        {/* Overlay Title for Mobile/Desktop */}
        <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md pointer-events-none">
          <h1 className="font-bold text-gray-800">Earthquake Monitor</h1>
          <p className="text-xs text-gray-500">Live USGS Data</p>
          {isPredictionMode && (
             <p className="text-xs text-purple-600 font-bold mt-1">Prediction Mode Active</p>
          )}
        </div>
      </div>
    </main>
  );
}
