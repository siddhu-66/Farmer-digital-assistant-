import React from 'react';
import Image from 'next/image';
import { MapPin, TrendingUp, Calendar, Package } from 'lucide-react';

export interface FeedCardProps {
  title: string;
  image?: string;
  location?: string;
  price?: string;
  status?: string;
  quantity?: string;
  date?: string;
  category?: string;
  badgeColor?: string;
  onAction?: () => void;
  actionLabel?: string;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

export function FeedCard({
  title,
  image,
  location,
  price,
  status,
  quantity,
  date,
  category,
  badgeColor = 'bg-green-100 text-green-700',
  onAction,
  actionLabel,
  secondaryAction,
  secondaryActionLabel
}: FeedCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      {image && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4 bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized={image.startsWith('data:') || image.startsWith('blob:')}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {category && (
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
              {category}
            </span>
          )}
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{title}</h3>
        </div>
        {status && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
            {status}
          </span>
        )}
      </div>

      {location && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{location}</span>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        {price && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-gray-800">{price}</span>
          </div>
        )}
        {quantity && (
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            <span>{quantity}</span>
          </div>
        )}
        {date && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {(onAction || secondaryAction) && (
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          {secondaryAction && secondaryActionLabel && (
            <button
              onClick={secondaryAction}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              {secondaryActionLabel}
            </button>
          )}
          {onAction && actionLabel && (
            <button
              onClick={onAction}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
