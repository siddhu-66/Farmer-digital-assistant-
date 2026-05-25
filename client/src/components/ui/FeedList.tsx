import React from 'react';
import { FeedCard, FeedCardProps } from './FeedCard';

export interface FeedListProps {
  items: FeedCardProps[];
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function FeedList({
  items,
  loading = false,
  empty = false,
  emptyMessage = 'No items found',
  emptyIcon,
  columns = 3
}: FeedListProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (empty || items.length === 0) {
    return (
      <div className="text-center py-12">
        {emptyIcon || (
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-600 mb-2">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {items.map((item, index) => (
        <FeedCard key={index} {...item} />
      ))}
    </div>
  );
}
