"use client";

import React from 'react';
import FarmerPaddyBackground from './FarmerPaddyBackground';
import BusinessMarketBackground from './BusinessMarketBackground';
import AdminAnalyticsBackground from './AdminAnalyticsBackground';

type PortalBackgroundProps = {
  type: "farmer" | "business" | "admin";
};

export default function PortalBackground({ type }: PortalBackgroundProps) {
  // Render appropriate background based on portal type
  if (type === "farmer") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <FarmerPaddyBackground />
      </div>
    );
  }

  if (type === "business") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <BusinessMarketBackground />
      </div>
    );
  }

  // Admin portal
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <AdminAnalyticsBackground />
    </div>
  );
}
