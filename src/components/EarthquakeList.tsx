'use client';

import { Earthquake } from '@/lib/mockData';
import { Activity, AlertTriangle, Clock } from 'lucide-react';

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  onSelectEarthquake: (eq: Earthquake) => void;
  selectedId?: string;
}

export default function EarthquakeList({ earthquakes, onSelectEarthquake, selectedId }: EarthquakeListProps) {
  return (
    <div className="h-full overflow-y-auto bg-white border-r border-gray-200 shadow-lg z-10 relative flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <Activity className="text-red-600" />
          Recent Alerts
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {earthquakes.length} earthquakes in the last 24h
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {earthquakes.map((eq) => (
          <div 
            key={eq.id}
            onClick={() => onSelectEarthquake(eq)}
            className={`p-4 cursor-pointer transition-all hover:bg-gray-50 
              ${selectedId === eq.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800 text-sm">{eq.location}</h3>
              <div className="flex gap-2">
                {eq.isPredicted && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700">
                    Predicted
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded text-xs font-bold
                  ${eq.alertLevel === 'Red' ? 'bg-red-100 text-red-700' : 
                    eq.alertLevel === 'Yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  M {eq.magnitude}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <AlertTriangle size={12} />
                {eq.depth} km
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {new Date(eq.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
