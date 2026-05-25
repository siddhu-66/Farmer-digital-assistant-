"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Star,
  ShoppingCart,
  Eye
} from 'lucide-react';

export interface CropData {
  id: string;
  name: string;
  category: string;
  season: string;
  pricePerUnit: number;
  unit: string;
  location: string;
  quality?: 'Low' | 'Medium' | 'High';
  image?: string;
  status?: 'available' | 'pending' | 'sold';
  description?: string;
  farmer?: string;
  harvestDate?: string;
}

interface CropCardProps {
  crop: CropData;
  isSelected?: boolean;
  onSelect?: (crop: CropData) => void;
  onSell?: (crop: CropData) => void;
  onPredictPrice?: (crop: CropData) => void;
  onViewMarket?: (crop: CropData) => void;
  showActions?: boolean;
  compact?: boolean;
}

const CropCard: React.FC<CropCardProps> = ({
  crop,
  isSelected = false,
  onSelect,
  onSell,
  onPredictPrice,
  onViewMarket,
  showActions = true,
  compact = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);

  const handleClick = () => {
    if (onSelect) {
      onSelect(crop);
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 600);
    }
  };

  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case 'High': return 'app-badge-success';
      case 'Medium': return 'app-badge-warning';
      case 'Low': return 'app-badge-error';
      default: return 'app-badge-info';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available': return 'app-badge-success';
      case 'pending': return 'app-badge-warning';
      case 'sold': return 'app-badge-error';
      default: return 'app-badge-info';
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -2, scale: 1.01 },
    tap: { scale: 0.99 },
    selected: {
      scale: 1.01,
      boxShadow: "0 0 0 2px rgba(34, 197, 94, 0.2)"
    }
  };

  const sparkleVariants = {
    initial: { scale: 0, rotate: 0, opacity: 0 },
    animate: { scale: 1, rotate: 180, opacity: 1 },
    exit: { scale: 0, rotate: 360, opacity: 0 }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  if (compact) {
    return (
      <motion.div
        className={`crop-card ${isSelected ? 'selected' : ''}`}
        variants={cardVariants}
        initial="initial"
        animate={isSelected ? "selected" : "animate"}
        whileHover="hover"
        whileTap="tap"
        transition={{ duration: 0.2 }}
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        layout
        role="button"
        tabIndex={0}
        aria-label={`Select ${crop.name} crop`}
        aria-pressed={isSelected}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <AnimatePresence>
          {showSparkle && (
            <motion.div
              className="leaf-sparkle"
              variants={sparkleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                zIndex: 10
              }}
            />
          )}
        </AnimatePresence>
        
        <motion.div 
          variants={contentVariants}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{crop.name}</h4>
            <p className="text-sm text-gray-500">{crop.category}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-600">₹{crop.pricePerUnit}</p>
            <p className="text-xs text-gray-500">/{crop.unit}</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`crop-card ${isSelected ? 'selected' : ''}`}
      variants={cardVariants}
      initial="initial"
      animate={isSelected ? "selected" : "animate"}
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
      role="button"
      tabIndex={0}
      aria-label={`Select ${crop.name} crop - ${crop.category}, ${crop.season} season, ₹${crop.pricePerUnit}/${crop.unit}`}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <AnimatePresence>
        {showSparkle && (
          <motion.div
            className="leaf-sparkle"
            variants={sparkleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 10
            }}
          />
        )}
      </AnimatePresence>
      
      <motion.div 
        variants={contentVariants}
        transition={{ delay: 0.1, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{crop.name}</h3>
              <p className="text-sm text-gray-500">{crop.category}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {crop.quality && (
              <span className={`app-badge ${getQualityColor(crop.quality)}`}>
                {crop.quality}
              </span>
            )}
            {crop.status && (
              <span className={`app-badge ${getStatusColor(crop.status)}`}>
                {crop.status}
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-medium">₹{crop.pricePerUnit}/{crop.unit}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{crop.season}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="truncate">{crop.location}</span>
          </div>
          {crop.farmer && (
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="truncate">{crop.farmer}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {crop.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {crop.description}
          </p>
        )}

        {/* Actions */}
        {showActions && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-2 pt-2 border-t border-gray-100"
          >
            {onSell && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSell(crop);
                }}
                className="app-button-primary text-sm flex-1"
              >
                <ShoppingCart className="w-4 h-4" />
                Sell
              </button>
            )}
            {onPredictPrice && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPredictPrice(crop);
                }}
                className="app-button-secondary text-sm flex-1"
              >
                <TrendingUp className="w-4 h-4" />
                Predict
              </button>
            )}
            {onViewMarket && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMarket(crop);
                }}
                className="app-button-outline text-sm flex-1"
              >
                <Eye className="w-4 h-4" />
                Market
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CropCard;
