'use client';

import { EarthquakeFilter } from '@/lib/api';
import { Filter, Search } from 'lucide-react';

interface FilterBarProps {
  filter: EarthquakeFilter;
  onFilterChange: (filter: EarthquakeFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isPredictionMode: boolean;
  onTogglePredictionMode: (enabled: boolean) => void;
}

export default function FilterBar({ 
  filter, 
  onFilterChange, 
  searchQuery, 
  onSearchChange,
  isPredictionMode,
  onTogglePredictionMode
}: FilterBarProps) {
  return (
    <div className="p-4 bg-white border-b border-gray-200 flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select
          value={filter.timeRange}
          onChange={(e) => onFilterChange({ ...filter, timeRange: e.target.value as any })}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="hour">Past Hour</option>
          <option value="day">Past 24 Hours</option>
          <option value="week">Past 7 Days</option>
        </select>

        <select
          value={filter.minMagnitude}
          onChange={(e) => onFilterChange({ ...filter, minMagnitude: Number(e.target.value) })}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0}>All Magnitudes</option>
          <option value={2.5}>M 2.5+</option>
          <option value={4.5}>M 4.5+</option>
          <option value={6.0}>M 6.0+</option>
        </select>

        <button
          onClick={() => onTogglePredictionMode(!isPredictionMode)}
          className={`text-sm px-3 py-1 rounded font-medium transition-colors
            ${isPredictionMode 
              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}
        >
          {isPredictionMode ? '🔮 Predictions ON' : '🔮 Predictions OFF'}
        </button>
      </div>
    </div>
  );
}
