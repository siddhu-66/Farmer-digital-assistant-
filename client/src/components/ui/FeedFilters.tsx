import React from 'react';
import { Search, X } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FeedFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: {
    category?: string;
    status?: string;
    location?: string;
    state?: string;
    district?: string;
  };
  onFilterChange?: (key: string, value: string) => void;
  categoryOptions?: FilterOption[];
  statusOptions?: FilterOption[];
  locationOptions?: FilterOption[];
}

export function FeedFilters({
  searchTerm,
  onSearchChange,
  filters = {},
  onFilterChange,
  categoryOptions = [],
  statusOptions = [],
  locationOptions = []
}: FeedFiltersProps) {
  const clearFilters = () => {
    onSearchChange('');
    if (onFilterChange) {
      Object.keys(filters).forEach(key => {
        onFilterChange(key, '');
      });
    }
  };

  const hasActiveFilters = searchTerm || Object.values(filters).some(v => v);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      {(categoryOptions.length > 0 || statusOptions.length > 0 || locationOptions.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {categoryOptions.length > 0 && (
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange?.('category', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {statusOptions.length > 0 && (
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange?.('status', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Status</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {locationOptions.length > 0 && (
            <select
              value={filters.location || ''}
              onChange={(e) => onFilterChange?.('location', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Locations</option>
              {locationOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
}
