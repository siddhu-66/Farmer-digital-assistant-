"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import "@/lib/i18nConfig";
import i18n from "i18next";
import { translationService } from "@/services/translationService";
export type Language = "en" | "hi" | "pa" | "mr" | "te";
export interface ApiRequestOptions<T = unknown> extends RequestInit {
  simulate?: T;
}
// Translations data
export const translationsData: Record<Language, Record<string, unknown>> = {
  en: {
    languageName: "English",
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      crops: "My Crops",
      market: "Market",
      signin: "Sign In",
      profile: "Profile",
    },
    hero: {
      tagline: "Revolutionizing Indian Agriculture",
      title: "Empowering Customers with Digital Intelligence",
      subtitle:
        "Bridging the gap between smallholder customers and global markets through data-driven collaboration, real-time insights, and sustainable practices.",
      getStarted: "Get Started",
      readReport: "Read Project Report",
      goDashboard: "Go to Dashboard",
    },
    problem: {
      title: "The Problem",
      item1: "Information asymmetry in market pricing.",
      item2: "Lack of direct corporate collaboration.",
      item3: "Unreliable weather forecasting for smallholders.",
    },
    objectives: {
      title: "Our Objectives",
      item1: "Streamline customer verification (Aadhar/Land Docs).",
      item2: "Facilitate FPO-based corporate partnerships.",
      item3: "Provide high-fidelity weather & soil analytics.",
    },
    collaboration: {
      title: "Collaboration Models",
      model1: {
        title: "Contract Farming",
        desc: "Secure pre-harvest price agreements.",
      },
      model2: {
        title: "FPO Portals",
        desc: "Leverage collective bargaining power.",
      },
      model3: {
        title: "Buy-Back",
        desc: "Assured procurement by global brands.",
      },
      model4: {
        title: "Input Support",
        desc: "Direct tech and seed assistance.",
      },
    } as Record<string, unknown>,
    caseStudies: {
      title: "Learning from the Best",
      desc: "Explore how legends like Amul, ITC e-Choupal, and PepsiCo transformed the Indian agricultural landscape through innovation and collaboration.",
      link: "Explore Case Studies",
    },
    mlImpact: {
      title: "ML Impact",
      desc: "Our crop recommendation engine uses over 10 years of historical Indian weather and mandi data to personalize your farming plan.",
      link: "Read Technical Docs",
    },
    mlDocs: {
      back: "Back to Home",
      version: "ML Tech Specs v1.0",
      title: "Crop Recommendation Engine",
      subtitle:
        "A deep-dive into the intelligence powering the one-to-one connection platform. Our engine combines 10+ years of historical data with real-time analytics.",
      feature1: {
        title: "Historical Data Mastery",
        desc: "Utilizes a dataset containing over 10 years of Indian weather patterns and Agmarknet mandi prices.",
      },
      feature2: {
        title: "Predictive Yield Modeling",
        desc: "Forecasts potential yields based on soil health (NPK levels), irrigation status, and local climate trends.",
      },
      arch: { title: "Architecture & Data Pipeline" },
      pipeline1: {
        title: "Weather API Integration",
        desc: "Real-time sync with global weather satellites to provide 5-day precision forecasts.",
      },
      pipeline2: {
        title: "Market Price Sync",
        desc: "Daily updates from government APMC portals ensuring farmers see the latest prices.",
      },
      pipeline3: {
        title: "Geospatial Tagging",
        desc: "Mapping farm locations to localized soil maps for accurate crop matching.",
      },
      verified: {
        title: "Verified Precision",
        desc: "Our models are cross-referenced with agricultural researchers to ensure ground-reality accuracy.",
        accuracy: "Accuracy Rate",
        mandis: "Mandis Tracked",
        updates: "Real-Time",
      },
      data: {
        location: "Ludhiana, Punjab",
        wheat: "Wheat",
        acres: "Acres",
        growth: "growth",
        vsYesterday: "vs yesterday",
        today: "today",
      },
      footer: "Return to Homepage",
    },
    roles: {
      farmer: "Customer (Farmer)",
      salesman: "Salesman (Trader / Buyer)",
      admin: "Admin",
    },
    signIn: {
      farmer: {
        title: "Customer (Farmer) Login",
        subtitle: "Access your farm analytics and crop recommendations.",
      },
      salesman: {
        title: "Salesman (Trader / Buyer) Login",
        subtitle: "Manage leads, contracts and procurement.",
      },
      admin: {
        title: "Admin Console",
        subtitle: "Monitor system health and verify platform data.",
      },
      backToHome: "Back to Home",
      emailPhone: "Email or Phone Number",
      password: "Password",
      forgotPassword: "Forgot Password?",
      rememberMe: "Remember me for 30 days",
      submit: "Sign In",
      noAccount: "Don't have an account?",
      createAccount: "Create account",
    },
    adminDashboard: {
      panel: "AdminPanel",
      sidebar: {
        dashboard: "Dashboard",
        users: "Users",
        verifications: "Verifications",
        orders: "Recent Orders",
        procurements: "Procurement Management",
        logs: "Logs",
      },
      header: {
        title: "System Overview",
        subtitle: "Monitoring platform health and verifications.",
        logout: "Logout",
      },
      stats: {
        farmers: "Verified Farmers",
        companies: "Active Salesmen",
        pending: "Pending Docs",
        uptime: "System Uptime",
      },
      alerts: {
        title: "System Alerts",
        latency: "Crop Recommendation Engine latency is high in Punjab region.",
        unauthorized: "Attempted unauthorized login detected on API endpoint.",
      },
      queue: {
        title: "Verification Queue",
        search: "Search customer...",
        name: "Name",
        region: "Region",
        doc: "Document Type",
        status: "Status",
        actions: "Actions",
        review: "Review",
        pending: "Pending",
        inReview: "In Review",
      },
    },
    businessDashboard: {
      vault: "SalesVault",
      sidebar: {
        overview: "Overview",
        post: "Post Contract",
        projections: "Projections",
        procurement: "Procurement",
        dispatch: "Sales Dispatch",
        messages: "Messages",
      },
      header: {
        title: "Salesman Dashboard",
        subtitle: "Sourcing & Procurement Hub",
        logout: "Logout",
      },
      stats: {
        live: "Live",
        committed: "Committed Procurement",
        onboarded: "Verified Customers Onboarded",
        disbursed: "Total Disbursed (Advance)",
      },
      actions: {
        post: "Post New Contract Offer",
        desc: "Targets specified regions and crop types using ML insights.",
      },
      offers: { title: "Active Contract Offers", fulfilled: "Fulfilled" },
    },
    collaborationPortal: {
      title: "Collaboration Portal",
      subtitle:
        "Review contract offers from salesman partners and food processing units.",
      contractor: "Contractor",
      crop: "Crop",
      price: "Price",
      perQuintal: "per quintal",
      duration: "Duration",
      actions: "Actions",
      accept: "Accept",
      reject: "Reject",
      details: "View Details",
      noContracts: "No pending contracts found.",
      success: "Contract Accepted Successfully!",
      rejected: "Offer Rejected.",
    },
    dashboard: {
      title: "Customer Dashboard",
      subtitle:
        "Welcome back, Ram Singh. Here's what's happening on your farm.",
      stats: {
        land: "Total Land",
        crop: "Current Crop",
        moisture: "Soil Moisture",
        value: "Market Value",
      },
      weather: {
        title: "Weather & Operations",
        temp: "Temp",
        humidity: "Humidity",
        wind: "Wind",
        rain: "Rain",
        sunny: "Sunny",
        moderate: "Moderate",
        north: "North",
        nextDays: "Next 3 days",
      },
      insight: {
        title: "Severe Alerts",
        desc: "High humidity and drop in night temperature predicted for Monday. Risk of Late Blight in potato crops.",
        preventionTitle: "Late Blight Prevention Steps",
        step1:
          "Apply protective fungicides containing Mancozeb or Chlorothalonil before the expected drop in temperature.",
        step2:
          "Ensure adequate drainage to prevent waterlogging around the potato plants.",
        step3:
          "Remove and destroy any infected foliage immediately to halt the spread of the pathogen.",
      },
      activities: {
        title: "Recent Activity",
        item1: {
          title: "Market Price Alert",
          desc: "Wheat prices in Ludhiana Mandi rose by 5%.",
          time: "2h ago",
        },
        item2: {
          title: "Soil Test Complete",
          desc: "NPK levels in Section B are optimal.",
          time: "5h ago",
        },
        item3: {
          title: "Govt. Scheme Rec",
          desc: "You are eligible for PM-Kisan subsidy.",
          time: "1d ago",
        },
      },
      collaboration: {
        title: "Collaboration",
        desc: "You have 2 pending contract offers from PepsiCo and ITC e-Choupal.",
        button: "Review Contracts",
      },
      farmProfile: {
        title: "Farm Profile",
        holding: "Total Landholding",
        location: "Current Location",
        profit: "Net Season Profit",
        borewell: "Borewell Status",
        borewellVal: "ACTIVE",
        soilType: "Soil Type",
        soilVal: "Alluvial (Loamy)",
      },
    },
    crops: {
      title: "Crop Management",
      subtitle: "Monitor and manage your active crop cycles.",
      addBtn: "Add New Crop",
      activeTitle: "Active Crops",
      planted: "Planted",
      stage: "Growth Stage",
      health: "Health Index",
      waterNeed: "Water Need",
      viewDetails: "View Details",
      history: "Past Harvest Histories",
      table: {
        type: "Crop Type",
        season: "Season",
        yield: "Yield",
        profit: "Net Profit",
        status: "Status",
        completed: "Completed",
      },
    },
    market: {
      title: "Market Prices",
      subtitle: "Real-time data from global and local Indian markets.",
      searchPlaceholder: "Search crop or market...",
      mandiTitle: "Indian Mandi Prices",
      today: "Today",
      yesterday: "Yesterday",
      table: {
        crop: "Crop",
        mandi: "Market (Mandi)",
        price: "Price (per Qtl)",
        trend: "Trend",
      },
      global: {
        title: "Global Indicators",
        analysis: "Analysis",
        analysisDesc:
          "Rising crude oil prices may increase transportation costs for kharif crops next month.",
      },
      export: {
        title: "Export Opportunities",
        desc: "High demand for Indian Basmati Rice in MENA regions. Assured buy-back contracts available.",
        button: "View Export Partners",
      },
    },
    data: {
      wheat: "Wheat",
      basmati: "Basmati Rice",
      mustard: "Mustard",
      cotton: "Cotton",
      soybean: "Soybean",
      maize: "Maize",
      location: "Ludhiana, Punjab",
      karnal: "Karnal, Haryana",
      jaipur: "Jaipur, Rajasthan",
      nagpur: "Nagpur, Maharashtra",
      indore: "Indore, MP",
      acres: "Acres",
      growth: "Growth",
      vsYesterday: "vs Yesterday",
      today: "Today",
      quintals: "Quintals",
      lakhs: "Lakhs",
    },
    profile: {
      title: "Customer Profile",
      editBtn: "Edit Profile",
      id: "ID",
      editModal: {
        title: "Edit Your Profile",
        name: "Full Name",
        phone: "Phone Number",
        location: "Farm Location",
        landSize: "Land Size (Acres)",
        soil: "Primary Soil",
        cancel: "Cancel",
        save: "Save Changes",
      },
      resources: {
        title: "Land & Resources",
        holding: "Total Landholding",
        soilType: "Soil Type",
        water: "Primary Water Source",
        location: "Land Location",
        lat: "Latitude",
        lng: "Longitude",
        profit: "Previous Year Profit",
        functional: "Functional",
        borewell: "Own Borewell",
      },
      documents: {
        title: "Verified Documents",
        aadhar: "Aadhar Card (Verification)",
        land: "Land Record (Khatauni)",
        bank: "Bank Passbook",
        verified: "Verified",
        pending: "Pending Review",
        updated: "Updated on",
      },
      membership: {
        title: "Membership",
        partner: "FPO Partner",
        since: "Member Since",
        points: "Loyalty Points",
      },
      settings: {
        title: "Quick Settings",
        notifications: "Notification Preferences",
        push: "Push Notifications",
        sms: "SMS Alerts",
        language: "Preferred Language",
        signout: "Sign Out",
      },
      roles: {
        adminTitle: "System Administrator",
        salesmanTitle: "Sourcing Manager",
        adminLocation: "Global Command Center",
        salesmanLocation: "Regional Office",
      },
      salesman: {
        purchases: "Purchases Managed",
        fpos: "Active FPOs",
        pending: "Pending Contracts",
        value: "Total Value",
        activeFposTitle: "Active Sourcing FPOs",
        recentTitle: "Recent Purchase Activity",
        fpoData: [
          {
            name: "Ludhiana Grain Coop",
            type: "Wheat/Basmati",
            status: "In Season",
          },
          {
            name: "Amritsar Farmer FPO",
            type: "Potato/Sugarcane",
            status: "Closing",
          },
          {
            name: "Jalandhar Veg Guild",
            type: "Organic Vegetables",
            status: "Active",
          },
        ],
        logs: [
          {
            event: "Contract Finalized",
            target: "M/S ITC e-Choupal",
            time: "2h ago",
          },
          {
            event: "Sourcing Alert",
            target: "Price spike in Moong Dal",
            time: "5h ago",
          },
          {
            event: "Audit Completed",
            target: "Section C Sourcing",
            time: "Yesterday",
          },
        ],
      },
      admin: {
        activeUsers: "Active Users",
        uptime: "Server Uptime",
        health: "System Health",
        security: "Security Alerts",
        oversight: "Multi-Role Oversight",
        criticalLogs: "Critical Logs",
        noLogs: "No critical system alerts found in the last 24 hours.",
        viewAll: "View All Audit Logs",
        clusters: {
          customer: "Customer Portal",
          salesman: "Salesman Network",
          admin: "Admin Core",
        },
      },
    },
    sidebar: {
      menu: "Menu",
      dashboard: "Dashboard",
      analytics: "AI Analytics",
      crops: "Crop Management",
      residue: "Residue & Feed",
      weather: "Weather",
      market: "Market Prices",
      profile: "Profile",
      logout: "LogOut",
    },
    weatherDetails: {
      title: "Weather Forecast",
      subtitle: "Precise agricultural weather insights for your location.",
      live: "LIVE",
      lastUpdated: "Last updated",
      forecast7Day: "7-Day Forecast",
      tomorrow: "Tomorrow",
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      mostlySunny: "Mostly Sunny",
      sunny: "Sunny",
      lightShowers: "Light Showers",
      rainy: "Rainy",
      partlyCloudy: "Partly Cloudy",
      alerts: "Severe Alerts",
      alertDesc:
        "High humidity and drop in night temperature predicted for Monday. Risk of Late Blight in potato crops.",
      viewPrevention: "View Prevention Steps",
      advice: "Sowing Advice",
      adviceDesc:
        "Soil moisture is currently at 42%. Conditions are perfect for sowing legumes in the North-East quadrant. Continue your journey in our one-to-one ecosystem.",
      optimalTemp: "Optimal soil temp: 18-24°C",
      nextIrrigation: "Next irrigation: 3 days",
    },
    analytics: {
      title: "AI Insights Portal",
      subtitle:
        "Leverage advanced Machine Learning models to optimize your farm's productivity, predict yields, and forecast market demand.",
      stats: {
        accuracy: "Prediction Accuracy",
        roi: "Projected ROI",
        usage: "Analysis Usage",
        credits: "Free Credits Remaining",
        activeModels: "Active Models",
        basedOn: "Based on Smart Rec.",
      },
      comingSoon: "Module Coming Soon",
      training: "Training Yield Multi-Variate Regression Model...",
      historyTitle: "Historical Yield Trends",
      coreModules: "Core ML Modules",
      cropRec: "Crop Recommendation",
      yieldPred: "Yield Prediction",
      pestDet: "Pest Detection",
      demandFore: "Demand Forecasting",
      optimalSelection: "Optimal Selection",
      betaPhase: "Beta Phase",
      trainingModel: "Training Model",
      uploadDesc: "Upload images for diagnosis.",
      dragDrop: "Drag & Drop Field Photo",
    },
    residue: {
      title: "Crop Residue Management",
      subtitle: "Converting agricultural waste into high-value animal feed.",
      methods: {
        physical: {
          title: "Physical Treatment",
          desc: "Mechanical processes like chopping, grinding, and pelleting.",
          impact: "Increases intake rates by 15-20% and reduces wastage.",
        },
        chemical: {
          title: "Chemical Treatment",
          desc: "Enhancing nutrients using Urea or ammonia treatment.",
          impact:
            "Increases crude protein content and improves digestion of lignin.",
        },
        biological: {
          title: "Biological Treatment",
          desc: "Using friendly fungi or microbes to ferment residues.",
          impact:
            "High-speed breakdown of cellulose for superior energy absorption.",
        },
        fortification: {
          title: "Nutritional Fortification",
          desc: "Mixing with molasses, minerals, or bypass protein.",
          impact:
            "Creates a complete balanced ration for high-yielding livestock.",
        },
      },
      benefitLabel: "Benefit",
      dashboardTitle: "Residue Utilization Dashboard",
      processNow: "Process Now",
      addFortification: "Add Fortification",
      whyTitle: "Why Manage Residues?",
      whyItems: [
        "Reduces environmental pollution (prevents burning)",
        "Provides low-cost feed for livestock",
        "Enhances overall farm sustainability",
        "Additional revenue stream for farmers",
      ],
      challengesTitle: "Key Challenges",
      challenges: {
        nutritional: {
          title: "Nutritional Imbalance",
          desc: "Must be treated/fortified before feeding.",
        },
        logistics: {
          title: "Logistics & Storage",
          desc: "Bulky residues take up significant space.",
        },
        awareness: {
          title: "Awareness Gap",
          desc: "Requires specialized training for implementation.",
        },
      },
      industrialTitle: "Industrial Potential",
      industrialDesc:
        "Connect with local bio-refineries to sell excess ag-waste or process it into high-value brewery-standard feed.",
      findPartners: "Find Nearby Partners",
      partnersModal: {
        title: "Nearby Processing Partners",
        subtitle:
          "Connect with local bio-refineries and feed processing units to sell your crop residue.",
        distance: "km away",
        connect: "Connect",
        close: "Close",
        partner1: {
          name: "Punjab Bio-Energy Corp",
          type: "Bio-Refinery",
          accepts: "Accepts: Wheat Straw, Paddy Straw",
        },
        partner2: {
          name: "Ludhiana Agri-Feeds",
          type: "Feed Processor",
          accepts: "Accepts: Maize Stover, Mustard Stalks",
        },
        partner3: {
          name: "Green Power Distilleries",
          type: "Brewery",
          accepts: "Accepts: Sugarcane Bagasse",
        },
      },
    },
  },
  hi: {
    nav: {
      home: "होम",
      dashboard: "डैशबोर्ड",
      crops: "मेरी फसलें",
      market: "बाज़ार",
      signin: "साइन इन",
      profile: "प्रोफ़ाइल",
      adminDashboard: "एडमिन कंसोल",
      businessDashboard: "बिजनेस हब",
    },
    hero: {
      tagline: "भारतीय कृषि में क्रांति",
      title: "डिजिटल इंटेलिजेंस के साथ ग्राहकों का सशक्तिकरण",
      subtitle:
        "डेटा-संचालित सहयोग, वास्तविक समय की अंतर्दृष्टि और टिकाऊ प्रथाओं के माध्यम से छोटे ग्राहकों और वैश्विक बाजारों के बीच की खाई को पाटना।",
      getStarted: "शुरू करें",
      readReport: "प्रोजेक्ट रिपोर्ट पढ़ें",
      goDashboard: "डैशबोर्ड पर जाएं",
    },
    problem: {
      title: "समस्या",
      item1: "बाज़ार मूल्य निर्धारण में सूचना की विषमता।",
      item2: "सीधे कॉर्पोरेट सहयोग की कमी।",
      item3: "छोटे ग्राहकों के लिए अविश्वसनीय मौसम पूर्वानुमान।",
    },
    objectives: {
      title: "हमारे उद्देश्य",
      item1: "ग्राहक सत्यापन (आधार/भूमि दस्तावेज) को सुव्यवस्थित करना।",
      item2: "FPO-आधारित कॉर्पोरेट भागीदारी को सुगम बनाना।",
      item3: "उच्च-सटीक मौसम और मिट्टी विश्लेषण प्रदान करना।",
    },
    collaboration: {
      title: "सहयोग मॉडल",
      model1: {
        title: "अनुबंध खेती",
        desc: "कटाई से पहले मूल्य समझौतों को सुरक्षित करें।",
      },
      model2: {
        title: "FPO पोर्टल",
        desc: "सामूहिक सौदेबाजी की शक्ति का लाभ उठाएं।",
      },
      model3: {
        title: "बाय-बॅक",
        desc: "वैश्विक ब्रांडों द्वारा सुनिश्चित खरीद।",
      },
      model4: {
        title: "इनपुट सहायता",
        desc: "प्रत्यक्ष तकनीकी और बीज सहायता।",
      },
    },
    caseStudies: {
      title: "सर्वश्रेष्ठ से सीखना",
      desc: "पता लगाएं कि अमूल, आईटीसी ई-चौपाल और पेप्सिको जैसी दिग्गजों ने नवाचार और सहयोग के माध्यम से भारतीय कृषि परिदृश्य को कैसे बदल दिया।",
      link: "केस स्टडीज देखें",
    },
    mlImpact: {
      title: "एमएल प्रभाव",
      desc: "हमारा फसल अनुशंसा इंजन आपकी खेती की योजना को व्यक्तिगत बनाने के लिए 10 वर्षों से अधिक के इितहासिक भारतीय मौसम और मंडी डेटा का उपयोग करता है।",
      link: "तकनीकी दस्तावेज पढ़ें",
    },
    mlDocs: {
      back: "होम पर वापस जाएं",
      version: "ML तकनीकी विनिर्देश v1.0",
      title: "फसल अनुशंसा इंजन",
      subtitle:
        "वन-टू-वन कनेक्शन प्लेटफॉर्म को शक्ति देने वाली बुद्धिमत्ता का गहन अध्ययन। हमारा इंजन वास्तविक समय के विश्लेषण के साथ 10+ वर्षों के ऐतिहासिक डेटा को जोड़ता है।",
      feature1: {
        title: "ऐतिहासिक डेटा महारत",
        desc: "10 वर्षों से अधिक के भारतीय हवामान पैटर्न और एगमार्कनेट मंडी मूल्यों वाले डेटासेट का उपयोग करता है।",
      },
      feature2: {
        title: "प्रभवि उपज मॉडलिंग",
        desc: "मिट्टी के स्वास्थ्य, सिंचाई की स्थिति और स्थानीय जलवायु रुझानों के आधार पर संभावित उपज का पूर्वानुमान लगाता है।",
      },
      arch: { title: "आर्किटेक्चर और डेटा पाइपलाइन" },
      pipeline1: {
        title: "मौसम API एकीकरण",
        desc: "5-दिवसीय सटीक पूर्वानुमान प्रदान करने के लिए वैश्विक मौसम उपग्रहां के साथ वास्तविक समय सिंक।",
      },
      pipeline2: {
        title: "बाज़ार मूल्य सिंक",
        desc: "सरकारी एपीएमसी पोर्टलों से दैनिक अपडेट यह सुनिश्चित करते हैं कि ग्राहकों को नवीनतम मूल्य दिखाई दें।",
      },
      pipeline3: {
        title: "भू-स्थानिक टैगिंग",
        desc: "सटीक फसल मिलान के लिए स्थानीय मिट्टी के मानचित्रों के साथ खेत के स्थानों का मानचित्रण।",
      },
      verified: {
        title: "सत्यापित सटीकता",
        desc: "जमीनी वास्तविकता की सटीकता सुनिश्चित करने के लिए हमारे मॉडल कृषि शोधकर्ताओं के साथ क्रॉस-रेफरेंस किए गए हैं।",
        accuracy: "सटीकता दर",
        mandis: "मंडी ट्रैकिंग",
        updates: "वास्तविक समय",
      },
      footer: "होमपेज पर वापस लौटें",
    },
    roles: {
      farmer: "ग्राहक",
      business: "व्यापारी / मंडी",
      salesman: "सेल्समन",
      admin: "प्रशासक",
    },
    signIn: {
      farmer: {
        title: "ग्राहक लॉगिन",
        subtitle: "अपने कृषि विश्लेषण और फसल अनुशंसाओं तक पहुंचें।",
      },
      business: {
        title: "व्यापारी लॉगिन",
        subtitle: "मंडी संचालन और थोक व्यापार प्रबंधित करें।",
      },
      salesman: {
        title: "सेल्समन लॉगिन",
        subtitle: "लीड्स, अनुबंध और खरीद प्रबंधित करें।",
      },
      admin: {
        title: "प्रशासक कंसोल",
        subtitle:
          "सिस्टम स्वास्थ्य की निगरानी करें और प्लेटफ़ॉर्म डेटा सत्यापित करें।",
      },
      backToHome: "होम पर वापस जाएं",
      emailPhone: "ईमेल या फ़ोन नंबर",
      password: "पासवर्ड",
      forgotPassword: "पासवर्ड भूल गए?",
      rememberMe: "30 दिनों के लिए याद रखें",
      submit: "साइन इन करें",
      noAccount: "खाता नहीं है?",
      createAccount: "खाता बनाएं",
    },
    adminDashboard: {
      panel: "एडमिन पैनल",
      sidebar: {
        dashboard: "डैशबोर्ड",
        users: "उपयोगकर्ता",
        verifications: "सत्यापन",
        logs: "लॉग्स",
      },
      header: {
        title: "प्रणाली अवलोकन",
        subtitle: "प्लेटफ़ॉर्म स्वास्थ्य और सत्यापन की निगरानी।",
        logout: "लॉगआउट",
      },
      stats: {
        farmers: "सत्यापित ग्राहक",
        companies: "सक्रिय सेल्समन",
        pending: "लंबित दस्तावेज़",
        uptime: "सिस्टम अपटाइम",
      },
      alerts: {
        title: "सिस्टम अलर्ट",
        latency: "पंजाब क्षेत्र में फसल अनुशंसा इंजन की विलंबता अधिक है।",
        unauthorized: "API एंडपॉइंट पर अनधिकृत लॉगिन का प्रयास किया गया।",
      },
      queue: {
        title: "सत्यापन कतार",
        search: "ग्राहक खोजें...",
        name: "नाम",
        region: "क्षेत्र",
        doc: "दस्तावेज़ प्रकार",
        status: "स्थिति",
        actions: "कार्रवाई",
        review: "समीक्षा करें",
        pending: "लंबित",
        inReview: "समीक्षा में",
      },
    },
    businessDashboard: {
      vault: "सेल्स वॉल्ट",
      sidebar: {
        overview: "अवलोकन",
        post: "अनुबंध पोस्ट करें",
        projections: "अनुमान",
        procurement: "खरीद",
        messages: "संदेश",
      },
      header: {
        title: "सेल्समन डैशबोर्ड",
        subtitle: "सोर्सिंग और खरीद हब",
        logout: "लॉगआउट",
      },
      stats: {
        live: "लाइव",
        committed: "प्रतिबद्ध खरीद",
        onboarded: "सत्यापित ग्राहक शामिल हुए",
        disbursed: "कुल वितरित (अग्रिम)",
      },
      actions: {
        post: "नया अनुबंध प्रस्ताव पोस्ट करें",
        desc: "ML अंतर्दृष्टि का उपयोग करके विशिष्ट क्षेत्रों और फसल प्रकारों को लक्षित करता है।",
      },
      offers: { title: "सक्रिय अनुबंध प्रस्ताव", fulfilled: "पूर्ण" },
    },
    collaborationPortal: {
      title: "सहयोग पोर्टल",
      subtitle:
        "सेल्समन भागीदारों और खाद्य प्रसंस्करण इकाइयों के अनुबंध प्रस्तावों की समीक्षा करें।",
      contractor: "ठेकेदार",
      crop: "फसल",
      price: "कीमत",
      perQuintal: "प्रति क्विंटल",
      duration: "अवधि",
      actions: "कार्रवाई",
      accept: "स्वीकार करें",
      reject: "अस्वीकार करें",
      details: "विवरण देखें",
      noContracts: "कोई लंबित अनुबंध नहीं मिला।",
      success: "अनुबंध सफलतापूर्वक स्वीकार किया गया!",
      rejected: "प्रस्ताव अस्वीकार कर दिया गया।",
    },
    dashboard: {
      title: "ग्राहक डैशबोर्ड",
      subtitle:
        "वापसी पर स्वागत है, राम सिंह। यहाँ आपके खेत में क्या हो रहा है, इसकी जानकारी दी गई है।",
      stats: {
        land: "कुल भूमि",
        crop: "वर्तमान फसल",
        moisture: "मिट्टी की नमी",
        value: "बाजार मूल्य",
      },
      weather: {
        title: "मौसम और संचालन",
        temp: "तापमान",
        humidity: "आर्द्रता",
        wind: "हवा",
        rain: "बारिश",
        sunny: "धूप",
        moderate: "मध्यम",
        north: "उत्तर",
        nextDays: "अगले 3 दिन",
      },
      insight: {
        title: "गंभीर अलर्ट",
        desc: "सोमवार के लिए उच्च आर्द्रता और रात के तापमान में गिरावट की भविष्यवाणी की गई है। आलू की फसलों में लेट ब्लाइट का खतरा।",
        preventionTitle: "लेट ब्लाइट रोकथाम के उपाय",
        step1:
          "तापमान में अपेक्षित गिरावट से पहले मैंकोज़ेब या क्लोरोथालोनिल युक्त सुरक्षात्मक कवकनाशी का उपयोग करें।",
        step2:
          "आलू के पौधों के आसपास जलभराव को रोकने के लिए पर्याप्त जल निकासी सुनिश्चित करें।",
        step3:
          "रोगजनक के प्रसार को रोकने के लिए किसी भी संक्रमित पत्ते को तुरंत हटा दें और नष्ट कर दें।",
      },
      activities: {
        title: "हालिया गतिविधि",
        item1: {
          title: "बाजार मूल्य अलर्ट",
          desc: "लुधियाना मंडी में गेहूं के दाम 5% बढ़ गए।",
          time: "2 घंटे पहले",
        },
        item2: {
          title: "मिट्टी परीक्षण पूर्ण",
          desc: "सेक्शन बी में एनपीके स्तर इष्टतम है।",
          time: "5 घंटे पहले",
        },
        item3: {
          title: "सरकारी योजना अनुशंसा",
          desc: "आप पीएम-किसान सब्सिडी के लिए पात्र हैं।",
          time: "1 दिन पहले",
        },
      },
      collaboration: {
        title: "सहयोग",
        desc: "आपके पास पेप्सिको और आईटीसी ई-चौपाल से 2 लंबित अनुबंध प्रस्ताव हैं।",
        button: "अनुबंधों की समीक्षा करें",
      },
      farmProfile: {
        title: "फार्म प्रोफाइल",
        holding: "कुल जोत",
        location: "वर्तमान स्थान",
        profit: "कुल सीजन लाभ",
        borewell: "बोरवेल स्थिति",
        borewellVal: "सक्रिय",
        soilType: "मिट्टी का प्रकार",
        soilVal: "जलोढ़ (दोमट)",
      },
    },
    crops: {
      title: "फसल प्रबंधन",
      subtitle: "अपने सक्रिय फसल चक्रों की निगरानी और प्रबंधन करें।",
      addBtn: "नई फसल जोड़ें",
      activeTitle: "सक्रिय फसलें",
      planted: "लगाया गया",
      stage: "विकास चरण",
      health: "स्वास्थ्य सूचकांक",
      waterNeed: "पानी की आवश्यकता",
      viewDetails: "विवरण देखें",
      history: "पिछला फसल इतिहास",
      table: {
        type: "फसल का प्रकार",
        season: "मौसम",
        yield: "पैदावार",
        profit: "शुद्ध लाभ",
        status: "स्थिति",
        completed: "पुरा",
      },
    },
    market: {
      title: "बाजार भाव",
      subtitle: "वैश्विक और स्थानीय भारतीय बाजारों से वास्तविक समय का डेटा।",
      searchPlaceholder: "फसल या बाजार खोजें...",
      mandiTitle: "भारतीय मंडी भाव",
      today: "आज",
      yesterday: "कल",
      table: {
        crop: "फसल",
        mandi: "बाजार (मंडी)",
        price: "कीमत (प्रति क्विंटल)",
        trend: "रुझान",
      },
      global: {
        title: "वैश्विक संकेतक",
        analysis: "विश्लेषण",
        analysisDesc:
          "कच्चे तेल की बढ़ती कीमतें अगले महीने खरीफ फसलों के लिए परिवहन लागत बढ़ा सकती हैं।",
      },
      export: {
        title: "निर्यात के अवसर",
        desc: "मेन (MENA) क्षेत्रों में भारतीय बासमती चावल की उच्च मांग। सुनिश्चित बाय-बैक अनुबंध उपलब्ध हैं।",
        button: "निर्यात भागीदार देखें",
      },
    },
    data: {
      wheat: "गेहूं",
      basmati: "बासमती चावल",
      mustard: "सरसों",
      cotton: "कपास",
      soybean: "सोयाबीन",
      maize: "मक्का",
      location: "लुधियाना, पंजाब",
      karnal: "करनाल, हरियाणा",
      jaipur: "जयपुर, राजस्थान",
      nagpur: "नागपुर, महाराष्ट्र",
      indore: "इंदौर, मध्य प्रदेश",
      acres: "एकड़",
      growth: "विकास",
      vsYesterday: "कल की तुलना में",
      today: "आज",
      quintals: "क्विंटल",
      lakhs: "लाख",
    },
    profile: {
      title: "ग्राहक प्रोफ़ाइल",
      editBtn: "प्रोफ़ाइल संपादित करें",
      id: "आईडी",
      editModal: {
        title: "अपनी प्रोफ़ाइल संपादित करें",
        name: "पूरा नाम",
        phone: "फ़ोन नंबर",
        location: "खेत का स्थान",
        landSize: "भूमि का आकार (एकड़)",
        soil: "प्राथमिक मिट्टी",
        cancel: "रद्द करें",
        save: "परिवर्तन सहेजें",
      },
      resources: {
        title: "भूमि और संसाधन",
        holding: "कुल जोत",
        soilType: "मिट्टी का प्रकार",
        water: "प्राथमिक जल स्रोत",
        location: "भूमि का स्थान",
        lat: "अक्षांश",
        lng: "देशांतर",
        profit: "पिछले वर्ष का लाभ",
        functional: "कार्यात्मक",
        borewell: "अपना बोरवेल",
      },
      documents: {
        title: "सत्यापित दस्तावेज़",
        aadhar: "आधार कार्ड (सत्यापन)",
        land: "भूमि रिकॉर्ड (खतौनी)",
        bank: "बैंक पासबुक",
        verified: "सत्यापित",
        pending: "समीक्षा लंबित",
        updated: "को अपडेट किया गया",
      },
      membership: {
        title: "सदस्यता",
        partner: "FPO पार्टनर",
        since: "से सदस्य",
        points: "लॉयल्टी पॉइंट",
      },
      settings: {
        title: "त्वरित सेटिंग्स",
        notifications: "अधिसूचना प्राथमिकताएं",
        push: "पुश नोटिफिकेशन",
        sms: "SMS अलर्ट",
        language: "पसंदीदा भाषा",
        signout: "साइन आउट",
      },
      roles: {
        adminTitle: "प्रणाली प्रशासक",
        salesmanTitle: "सोर्सिंग प्रबंधक",
        adminLocation: "ग्लोबल कमांड सेंटर",
        salesmanLocation: "क्षेत्रीय कार्यालय",
      },
      salesman: {
        purchases: "प्रबंधित खरीदारी",
        fpos: "सक्रिय एफपीओ",
        pending: "लंबित अनुबंध",
        value: "कुल मूल्य",
        activeFposTitle: "सक्रिय सोर्सिंग एफपीओ",
        recentTitle: "हालिया खरीद गतिविधि",
        fpoData: [
          {
            name: "लुधियाना अनाज सहकारी",
            type: "गेहूं/बासमती",
            status: "सीजन में",
          },
          { name: "अमृतसर किसान एफपीओ", type: "आलू/गन्ना", status: "समाप्ति" },
          {
            name: "जालंधर सब्जी संघ",
            type: "जैविक सब्जियां",
            status: "सक्रिय",
          },
        ],
        logs: [
          {
            event: "अनुबंध को अंतिम रूप दिया गया",
            target: "मैसर्स आईटीसी ई-चौपाल",
            time: "2 घंटे पहले",
          },
          {
            event: "सोर्सिंग अलर्ट",
            target: "मूंग दाल की कीमतों में उछाल",
            time: "5 घंटे पहले",
          },
          { event: "ऑडिट पूरा हुआ", target: "सेक्शन सी सोर्सिंग", time: "कल" },
        ],
      },
      admin: {
        activeUsers: "सक्रिय उपयोगकर्ता",
        uptime: "सिस्टम अपटाइम",
        health: "सिस्टम स्वास्थ्य",
        security: "सुरक्षा अलर्ट",
        oversight: "बहु-भूमिका निरीक्षण",
        criticalLogs: "महत्वपूर्ण लॉग्स",
        noLogs: "पिछले 24 घंटों में कोई महत्वपूर्ण सिस्टम अलर्ट नहीं मिला।",
        viewAll: "सभी ऑडिट लॉग देखें",
        clusters: {
          customer: "ग्राहक पोर्टल",
          salesman: "विक्रेता नेटवर्क",
          admin: "एडमिन कोर",
        },
      },
    },
    sidebar: {
      menu: "मेन्यू",
      dashboard: "डैशबोर्ड",
      analytics: "एआई एनालिटिक्स",
      crops: "फसल प्रबंधन",
      residue: "अवशेष और चारा",
      weather: "मौसम",
      market: "बाज़ार मूल्य",
      profile: "प्रोफ़ाइल",
      logout: "लॉग आउट",
    },
    weatherDetails: {
      tomorrow: "कल",
      sunday: "रविवार",
      monday: "सोमवार",
      tuesday: "मंगलवार",
      wednesday: "बुधवार",
      mostlySunny: "ज्यादातर धूप",
      sunny: "धूप",
      lightShowers: "हल्की बौछारें",
      rainy: "बारिश",
      partlyCloudy: "आंशिक रूप से बादल",
      alerts: "गंभीर अलर्ट",
      alertDesc:
        "सोमवार के लिए उच्च आर्द्रता और रात के तापमान में गिरावट की भविष्यवाणी की गई है। आलू की फसलों में लेट ब्लाइट का खतरा।",
      viewPrevention: "बचाव के चरण देखें",
      advice: "बुवाई की सलाह",
      adviceDesc:
        "मिट्टी की नमी वर्तमान में 42% है। उत्तर-पूर्वी क्षेत्र में फलियां बोने के लिए स्थितियां सही हैं। हमारे वन-टू-वन इकोसिस्टम में अपनी यात्रा जारी रखें।",
      optimalTemp: "इष्टतम मिट्टी का तापमान: 18-24°C",
      nextIrrigation: "अगली सिंचाई: 3 दिन",
    },
    analytics: {
      title: "एआई अंतर्दृष्टि पोर्टल",
      subtitle:
        "अपने खेत की उत्पादकता को अनुकूलित करने, पैदावार की भविष्यवाणी करने और बाजार की मांग का पूर्वानुमान लगाने के लिए उन्नत मशीन लर्निंग मॉडल का लाभ उठाएं।",
      stats: {
        accuracy: "भविष्यवाणी सटीकता",
        roi: "अनुमानित आरओआई",
        usage: "विश्लेषण उपयोग",
        credits: "मुफ्त क्रेडिट शेष",
        activeModels: "सक्रिय मॉडल",
        basedOn: "स्मार्ट अनुशंसा पर आधारित",
      },
      comingSoon: "परियोजना जल्द आ रही है",
      training: "उपज बहु-भिन्न प्रतिगमन मॉडल प्रशिक्षण...",
      historyTitle: "ऐतिहासिक उपज रुझान",
      coreModules: "कोर एमएल मॉडल",
      cropRec: "फसल अनुशंसा",
      yieldPred: "पैदावार भविष्यवाणी",
      pestDet: "कीट पहचान",
      demandFore: "मांग पूर्वानुमान",
      optimalSelection: "इष्टतम चयन",
      betaPhase: "बीटा चरण",
      trainingModel: "प्रशिक्षण मॉडल",
      uploadDesc: "निदान के लिए चित्र अपलोड करें।",
      dragDrop: "खेत की फोटो खींचें या छोड़ें",
    },
    residue: {
      title: "फसल अवशेष प्रबंधन",
      subtitle: "कृषि अपशिष्ट को उच्च मूल्य वाले पशु आहार में बदलना।",
      methods: {
        physical: {
          title: "भौतिक उपचार",
          desc: "काटने, पीसने और पेलेटिंग जैसी यांत्रिक प्रक्रियाएं।",
          impact:
            "सेवन दर में 15-20% की वृद्धि करता है और बर्बादी को कम करता है।",
        },
        chemical: {
          title: "रासायनिक उपचार",
          desc: "यूरिया या अमोनिया उपचार का उपयोग करके पोषक तत्वों को बढ़ाना।",
          impact:
            "कच्चे प्रोटीन की मात्रा बढ़ाता है और लिग्निन के पाचन में सुधार करता है।",
        },
        biological: {
          title: "जैविक उपचार",
          desc: "अवशेषों को किण्वित करने के लिए मित्र कवक या सूक्ष्मजीवों का उपयोग करना।",
          impact: "बेहतर ऊर्जा अवशोषण के लिए सेलूलोज़ का उच्च गति से टूटना।",
        },
        fortification: {
          title: "पोषण सुदृढ़ीकरण",
          desc: "गुड़, खनिज या बाईपास प्रोटीन के साथ मिलाना।",
          impact: "उच्च उपज वाले पशुधन के लिए एक पूर्ण संतुलित राशन बनाता है।",
        },
      },
      benefitLabel: "लाभ",
      dashboardTitle: "अवशेष उपयोग डैशबोर्ड",
      processNow: "अभी प्रक्रिया करें",
      addFortification: "सुदृढ़ीकरण जोड़ें",
      whyTitle: "अवशेष प्रबंधन क्यों करें?",
      whyItems: [
        "पर्यावरण प्रदूषण को कम करता है (जलने से रोकता है)",
        "पशुधन के लिए कम लागत वाला चारा प्रदान करता है",
        "खेत की स्थिरता बढ़ाता है",
        "किसानों के लिए अतिरिक्त आय का स्रोत",
      ],
      challengesTitle: "मुख्य चुनौतियां",
      challenges: {
        nutritional: {
          title: "पोषण का असंतुलन",
          desc: "खिलाने से पहले उपचारित/मजबूत किया जाना चाहिए।",
        },
        logistics: {
          title: "रसद और भंडारण",
          desc: "भारी अवशेष महत्वपूर्ण स्थान घेरते हैं।",
        },
        awareness: {
          title: "जागरूकता की कमी",
          desc: "कार्यान्वयन के लिए विशेष प्रशिक्षण की आवश्यकता है।",
        },
      },
      industrialTitle: "औद्योगिक क्षमता",
      industrialDesc:
        "अतिरिक्त कृषि-अपशिष्ट बेचने या इसे उच्च-मूल्य वाले फ़ीड में संसाधित करने के लिए स्थानीय जैव-रिफाइनरियों से जुड़ें।",
      findPartners: "नजदीकी साथी खोजें",
      partnersModal: {
        title: "आसपास के प्रसंस्करण भागीदार",
        subtitle:
          "अपने फसल अवशेषों को बेचने के लिए स्थानीय जैव-रिफाइनरियों और फ़ीड प्रसंस्करण इकाइयों से जुड़ें।",
        distance: "किमी दूर",
        connect: "संपर्क करें",
        close: "बंद करें",
        partner1: {
          name: "पंजाब बायो-एनर्जी कॉर्प",
          type: "जैव-रिफाइनरी",
          accepts: "स्वीकार करता है: गेहूं का भूसा, धान का पुआल",
        },
        partner2: {
          name: "लुधियाना एग्री-फीड्स",
          type: "फ़ीड प्रोसेसर",
          accepts: "स्वीकार करता है: मक्के का डंठल, सरसों का डंठल",
        },
        partner3: {
          name: "ग्रीन पावर डिस्टिलरीज",
          type: "शराब की भठ्ठी",
          accepts: "स्वीकार करता है: गन्ने की खोई",
        },
      },
    },
  },
  pa: {
    nav: {
      home: "ਹੋਮ",
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      crops: "ਮੇਰੀਆਂ ਫਸਲਾਂ",
      market: "ਬਾਜ਼ਾਰ",
      signin: "ਸਾਈਨ ਇਨ",
      profile: "ਪ੍ਰੋਫਾਈਲ",
      adminDashboard: "ਐਡਮਿਨ ਕੰਸੋਲ",
      businessDashboard: "ਸੇਲਜ਼ਮੈਨ ਹੱਬ",
    },
    hero: {
      tagline: "ਭਾਰਤੀ ਖੇਤੀਬਾੜੀ ਵਿੱਚ ਕ੍ਰਾਂਤੀ",
      title: "ਡਿਜੀਟਲ ਇੰਟੈਲੀਜੈਂਸ ਨਾਲ ਗਾਹਕਾਂ ਦਾ ਸ਼ਕਤੀਕਰਨ",
      subtitle:
        "ਡਾਟਾ-ਅਧਾਰਿਤ ਸਹਿਯੋਗ, ਰੀਅਲ-ਟਾਈਮ ਇਨਸਾਈਟਸ ਅਤੇ ਟਿਕਾਊ ਅਭਿਆਸਾਂ ਰਾਹੀਂ ਛੋਟੇ ਗਾਹਕਾਂ ਅਤੇ ਗਲੋਬਲ ਬਾਜ਼ਾਰਾਂ ਵਿਚਕਾਰ ਪਾੜੇ ਨੂੰ ਪੂਰਾ ਕਰਨਾ।",
      getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
      readReport: "ਪ੍ਰੋਜੈਕਟ ਰਿਪੋਰਟ ਪੜ੍ਹੋ",
      goDashboard: "ਡੈਸ਼ਬੋਰਡ ਤੇ ਜਾਓ",
    },
    problem: {
      title: "ਸਮੱਸਿਆ",
      item1: "ਬਾਜ਼ਾਰ ਕੀਮਤ ਨਿਰਧਾਰਨ ਵਿੱਚ ਸੂਚਨਾ ਦੀ ਅਸਮਾਨਤਾ।",
      item2: "ਸਿੱਧੇ ਕਾਰਪੋਰੇਟ ਸਹਿਯੋਗ ਦੀ ਘਾਟ।",
      item3: "ਛੋਟੇ ਗਾਹਕਾਂ ਲਈ ਅਵਿਸ਼ਵਾਸਯੋਗ ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ।",
    },
    objectives: {
      title: "ਸਾਡੇ ਉਦੇਸ਼",
      item1: "ਕਿਸਾਨ ਤਸਦੀਕ (ਆਧਾਰ/ਜ਼ਮੀਨ ਦੇ ਦਸਤਾਵੇਜ਼) ਨੂੰ ਸੁਚਾਰੂ ਬਣਾਉਣਾ।",
      item2: "FPO-ਅਧਾਰਿਤ ਕਾਰਪੋਰੇਟ ਭਾਈਵਾਲੀ ਦੀ ਸਹੂਲਤ।",
      item3: "ਉੱਚ-ਸਟੀਕਤਾ ਵਾਲੇ ਮੌਸਮ ਅਤੇ ਮਿੱਟੀ ਦੇ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਦਾਨ ਕਰਨਾ।",
    },
    collaboration: {
      title: "ਸਹਿਯੋਗ ਮਾਡਲ",
      model1: {
        title: "ਠੇਕਾ ਖੇਤੀ",
        desc: "ਵਾਢੀ ਤੋਂ ਪਹਿਲਾਂ ਕੀਮਤ ਸਮਝੌਤੇ ਸੁਰੱਖਿਅਤ ਕਰੋ।",
      },
      model2: {
        title: "FPO ਪੋਰਟਲ",
        desc: "ਸਮੂਹਿਕ ਸੌਦੇਬਾਜ਼ੀ ਦੀ ਸ਼ਕਤੀ ਦਾ ਲਾਭ ਉਠਾਓ।",
      },
      model3: { title: "ਬਾਏ-ਬੈਕ", desc: "ਗਲੋਬਲ ਬ੍ਰਾਂਡਾਂ ਦੁਆਰਾ ਯਕੀਨੀ ਖਰੀਦ।" },
      model4: { title: "ਇਨਪੁੱਟ ਸਹਾਇਤਾ", desc: "ਸਿੱਧੀ ਤਕਨੀਕੀ ਅਤੇ ਬੀਜ ਸਹਾਇਤਾ।" },
    },
    caseStudies: {
      title: "ਸਭ ਤੋਂ ਵਧੀਆ ਤੋਂ ਸਿੱਖਣਾ",
      desc: "ਪਤਾ ਲਗਾਓ ਕਿ ਅਮੂਲ, ਆਈਟੀਸੀ ਈ-ਚੌਪਾਲ ਅਤੇ ਪੈਪਸੀਕੋ ਵਰਗੇ ਦਿੱਗਜਾਂ ਨੇ ਨਵੀਨਤਾ ਅਤੇ ਸਹਿਯੋਗ ਰਾਹੀਂ ਭਾਰਤੀ ਖੇਤੀਬਾੜੀ ਦੇ ਦ੍ਰਿਸ਼ ਨੂੰ ਕਿਵੇਂ ਬਦਲਿਆ।",
      link: "ਕੇਸ ਸਟੱਡੀਜ਼ ਦੇਖੋ",
    },
    mlImpact: {
      title: "ML ਪ੍ਰਭਾਵ",
      desc: "ਸਾਡਾ ਫਸਲ ਸਿਫਾਰਸ਼ ਇੰਜਣ ਤੁਹਾਡੀ ਖੇਤੀ ਯੋਜਨਾ ਨੂੰ ਨਿਜੀ ਬਣਾਉਣ ਲਈ 10 ਸਾਲਾਂ ਤੋਂ ਵੱਧ ਦੇ ਇਤਿਹਾਸਕ ਭਾਰਤੀ ਮੌਸਮ ਅਤੇ ਮੰਡੀ ਦੇ ਡੇਟਾ ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹੈ।",
      link: "ਤਕਨੀਕੀ ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ",
    },
    mlDocs: {
      back: "ਹੋਮ ਤੇ ਵਾਪਸ ਜਾਓ",
      version: "ML ਤਕਨੀਕੀ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ v1.0",
      title: "ਫਸਲ ਸਿਫਾਰਸ਼ ਇੰਜਣ",
      subtitle:
        "ਵਨ-ਟੂ-ਵਨ ਕਨੈਕਸ਼ਨ ਪਲੇਟਫਾਰਮ ਨੂੰ ਸ਼ਕਤੀ ਦੇਣ ਵਾਲੀ ਬੁੱਧੀ ਦਾ ਡੂੰਘਾ ਅਧਿਐਨ। ਸਾਡਾ ਇੰਜਣ ਰੀਅਲ-ਟਾਈਮ ਵਿਸ਼ਲੇਸ਼ਣ ਦੇ ਨਾਲ 10+ ਸਾਲਾਂ ਦੇ ਇਤਿਹਾਸਕ ਡੇਟਾ ਨੂੰ ਜੋੜਦਾ ਹੈ।",
      feature1: {
        title: "ਇਤਿਹਾਸਕ ਡੇਟਾ ਮੁਹਾਰਤ",
        desc: "ਭਾਰਤੀ ਮੌਸਮ ਦੇ ਪੈਟਰਨਾਂ ਅਤੇ ਐਗਮਾਰਕਨੇਟ ਮੰਡੀ ਦੀਆਂ ਕੀਮਤਾਂ ਦੇ 10 ਸਾਲਾਂ ਤੋਂ ਵੱਧ ਦੇ ਡੇਟਾਸੈਟ ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹੈ।",
      },
      feature2: {
        title: "ਭਵਿੱਖਬਾਣੀ ਝਾੜ ਮਾਡਲਿੰਗ",
        desc: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ, ਸਿੰਚਾਈ ਸਥਿਤੀ ਅਤੇ ਸਥਾਨਕ ਜਲਵਾਯੂ ਰੁਝਾਨਾਂ ਦੇ ਅਧਾਰ ਤੇ ਸੰਭਾਵੀ ਝਾੜ ਦੀ ਭਵਿੱਖਬਾਣੀ ਕਰਦਾ ਹੈ।",
      },
      arch: { title: "ਆਰਕੀਟੈਕਚਰ ਅਤੇ ਡੇਟਾ ਪਾਈਪਲਾਈਨ" },
      pipeline1: {
        title: "ਮੌਸਮ API ਏਕੀਕਰਣ",
        desc: "5-ਦਿਨਾਂ ਦੀ ਸ਼ੁੱਧਤਾ ਪੂਰਵ ਅਨੁਮਾਨ ਪ੍ਰਦਾਨ ਕਰਨ ਲਈ ਗਲੋਬਲ ਮੌਸਮ ਸੈਟੇਲਾਈਟਾਂ ਨਾਲ ਰੀਅਲ-ਟਾਈਮ ਸਿੰਕ।",
      },
      pipeline2: {
        title: "ਮਾਰਕੀਟ ਕੀਮਤ ਸਿੰਕ",
        desc: "ਸਰਕਾਰੀ ਏਪੀਐਮਸੀ ਪੋਰਟਲਾਂ ਤੋਂ ਰੋਜ਼ਾਨਾ ਅਪਡੇਟਸ ਇਹ ਸੁਨਿਸ਼ਚਿਤ ਕਰਦੇ ਹਨ ਕਿ ਕਿਸਾਨ ਤਾਜ਼ਾ ਕੀਮਤਾਂ ਵੇਖਦੇ ਹਨ।",
      },
      pipeline3: {
        title: "ਭੂ-ਸਥਾਨਕ ਟੈਗਿੰਗ",
        desc: "ਸਹੀ ਫਸਲ ਮੇਲ ਲਈ ਖੇਤ ਦੀਆਂ ਸਥਾਨਾਂ ਨੂੰ ਸਥਾਨਕ ਮਿੱਟੀ ਦੇ ਨਕਸ਼ਿਆਂ ਨਾਲ ਮੈਪ ਕਰਨਾ।",
      },
      verified: {
        title: "ਪ੍ਰਮਾਣਿਤ ਸ਼ੁੱਧਤਾ",
        desc: "ਜ਼ਮੀਨੀ ਹਕੀਕਤ ਦੀ ਸ਼ੁੱਧਤਾ ਨੂੰ ਯਕੀਨੀ ਬਣਾਉਣ ਲਈ ਸਾਡੇ ਮਾਡਲ ਖੇਤੀਬਾੜੀ ਖੋਜਕਰਤਾਵਾਂ ਨਾਲ ਕ੍ਰਾਸ-ਰੈਫਰੈਂਸ ਕੀਤੇ ਗਏ ਹਨ।",
        accuracy: "ਸ਼ੁੱਧਤਾ ਦਰ",
        mandis: "ਮੰਡੀਆਂ ਟ੍ਰੈਕ ਕੀਤੀਆਂ",
        updates: "ਰੀਅਲ-ਟਾਈਮ",
      },
      data: {
        location: "ਲੁਧਿਆਣਾ, ਪੰਜਾਬ",
        wheat: "ਕਣਕ",
        acres: "ਏਕੜ",
        growth: "ਵਾਧਾ",
        vsYesterday: "ਕੱਲ੍ਹ ਦੇ ਮੁਕਾਬਲੇ",
        today: "ਅੱਜ",
      },
      footer: "ਹੋਮਪੇਜ ਤੇ ਵਾਪਸ ਜਾਓ",
    },
    roles: { farmer: "ਗਾਹਕ", business: "ਸੇਲਜ਼ਮੈਨ", admin: "ਪ੍ਰਸ਼ਾਸਕ" },
    signIn: {
      farmer: {
        title: "ਗਾਹਕ ਲੋਗਿਨ",
        subtitle: "ਆਪਣੇ ਫਾਰਮ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਫਸਲ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ ਤੱਕ ਪਹੁੰਚੋ।",
      },
      business: {
        title: "ਸੇਲਜ਼ਮੈਨ ਲੋਗਿਨ",
        subtitle: "ਇਕਰਾਰਨਾਮੇ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ ਅਤੇ ਸੋਰਸਿੰਗ ਅਨੁਮਾਨ ਦੇਖੋ।",
      },
      admin: {
        title: "ਪ੍ਰਸ਼ਾਸਕ ਕੰਸੋਲ",
        subtitle:
          "ਸਿਸਟਮ ਦੀ ਸਿਹਤ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਪਲੇਟਫਾਰਮ ਡੇਟਾ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।",
      },
      backToHome: "ਹੋਮ ਤੇ ਵਾਪਸ ਜਾਓ",
      emailPhone: "ਈਮੇਲ ਜਾਂ ਫ਼ੋਨ ਨੰਬਰ",
      password: "ਪਾਸਵਰਡ",
      forgotPassword: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
      rememberMe: "30 ਦਿਨਾਂ ਲਈ ਯਾਦ ਰੱਖੋ",
      submit: "ਸਾਈਨ ਇਨ",
      noAccount: "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
      createAccount: "ਖਾਤਾ ਬਣਾਓ",
    },
    adminDashboard: {
      panel: "ਐਡਮਿਨ ਪੈਨਲ",
      sidebar: {
        dashboard: "ਡੈਸ਼ਬੋਰਡ",
        users: "ਉਪਭੋਗਤਾ",
        verifications: "ਤਸਦੀਕ",
        orders: "ਤਾਜ਼ਾ ਆਰਡਰ",
        logs: "ਲੌਗਸ",
      },
      header: {
        title: "ਸਿਸਟਮ ਸੰਖੇਪ",
        subtitle: "ਪਲੇਟਫਾਰਮ ਦੀ ਸਿਹਤ ਅਤੇ ਤਸਦੀਕ ਦੀ ਨਿਗਰਾਨੀ।",
        logout: "ਲੌਗਆਉਟ",
      },
      stats: {
        farmers: "ਤਸਦੀਕਸ਼ੁਦਾ ਗਾਹਕ",
        companies: "ਸਰਗਰਮ ਸੇਲਜ਼ਮੈਨ",
        pending: "ਬਕਾਇਆ ਦਸਤਾਵੇਜ਼",
        uptime: "ਸਿਸਟਮ ਅਪਟਾਈਮ",
      },
      alerts: {
        title: "ਸਿਸਟਮ ਚੇਤਾਵਨੀਆਂ",
        latency: "ਪੰਜਾਬ ਖੇਤਰ ਵਿੱਚ ਫਸਲ ਸਿਫਾਰਸ਼ ਇੰਜਣ ਦੀ ਦੇਰੀ ਜ਼ਿਆਦਾ ਹੈ।",
        unauthorized: "API ਐਂਡਪੁਆਇੰਟ ਤੇ ਅਣਅਧਿਕਾਰਤ ਲੋਗਿਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕੀਤੀ ਗਈ।",
      },
      queue: {
        title: "ਤਸਦੀਕ ਕਤਾਰ",
        search: "ਗਾਹਕ ਦੀ ਖੋਜ ਕਰੋ...",
        name: "ਨਾਮ",
        region: "ਖੇਤਰ",
        doc: "ਦਸਤਾਵੇਜ਼ ਦੀ ਕਿਸਮ",
        status: "ਸਥਿਤੀ",
        actions: "ਕਾਰਵਾਈਆਂ",
        review: "ਸਮੀਖਿਆ ਕਰੋ",
        pending: "ਬਕਾਇਆ",
        inReview: "ਸਮੀਖਿਆ ਅਧੀਨ",
      },
    },
    businessDashboard: {
      vault: "ਸੇਲਜ਼ ਵੌਲਟ",
      sidebar: {
        overview: "ਸੰਖੇਪ",
        post: "ਇਕਰਾਰਨਾਮਾ ਪੋਸਟ ਕਰੋ",
        projections: "ਅਨੁਮਾਨ",
        procurement: "ਖਰੀਦ",
        messages: "ਸੁਨੇਹੇ",
      },
      header: {
        title: "ਸੇਲਜ਼ਮੈਨ ਡੈਸ਼ਬੋਰਡ",
        subtitle: "ਸੋਰਸਿੰਗ ਅਤੇ ਖਰੀਦ ਕੇਂਦਰ",
        logout: "ਲੌਗਆਉਟ",
      },
      stats: {
        live: "ਲਾਈਵ",
        committed: "ਵਚਨਬੱਧ ਖਰੀਦ",
        onboarded: "ਤਸਦੀਕਸ਼ੁਦਾ ਗਾਹਕ ਸ਼ਾਮਲ ਹੋਏ",
        disbursed: "ਕੁੱਲ ਵੰਡਿਆ ਗਿਆ (ਅਡਵਾਂਸ)",
      },
      actions: {
        post: "ਨਵਾਂ ਇਕਰਾਰਨਾਮਾ ਪੇਸ਼ਕਸ਼ ਪੋਸਟ ਕਰੋ",
        desc: "ML ਸੂਝ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਖਾਸ ਖੇਤਰਾਂ ਅਤੇ ਫਸਲਾਂ ਦੀਆਂ ਕਿਸਮਾਂ ਨੂੰ ਨਿਸ਼ਾਨਾ ਬਣਾਉਂਦਾ ਹੈ।",
      },
      offers: { title: "ਸਰਗਰਮ ਇਕਰਾਰਨਾਮਾ ਪੇਸ਼ਕਸ਼ਾਂ", fulfilled: "ਪੂਰਾ ਹੋਇਆ" },
    },
    collaborationPortal: {
      title: "ਸਹਿਯੋਗ ਪੋਰਟਲ",
      subtitle:
        "ਸੇਲਜ਼ਮੈਨ ਭਾਈਵਾਲਾਂ ਅਤੇ ਭੋਜਨ ਪ੍ਰੋਸੈਸਿੰਗ ਯੂਨਿਟਾਂ ਦੇ ਇਕਰਾਰਨਾਮੇ ਦੀਆਂ ਪੇਸ਼ਕਸ਼ਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ।",
      contractor: "ਠੇਕੇਦਾਰ",
      crop: "ਫਸਲ",
      price: "ਕੀਮਤ",
      perQuintal: "ਪ੍ਰਤੀ ਕੁਇੰਟਲ",
      duration: "ਮਿਆਦ",
      actions: "ਕਾਰਵਾਈਆਂ",
      accept: "ਸਵੀਕਾਰ ਕਰੋ",
      reject: "ਰੱਦ ਕਰੋ",
      details: "ਵੇਰਵੇ ਵੇਖੋ",
      noContracts: "ਕੋਈ ਪੈਂਡਿੰਗ ਇਕਰਾਰਨਾਮੇ ਨਹੀਂ ਮਿਲੇ।",
      success: "ਇਕਰਾਰਨਾਮਾ ਸਫਲਤਾਪੂਰਵਕ ਸਵੀਕਾਰ ਕੀਤਾ ਗਿਆ!",
      rejected: "ਪੇਸ਼ਕਸ਼ ਰੱਦ ਕਰ ਦਿੱਤੀ ਗਈ।",
    },
    dashboard: {
      title: "ਗਾਹਕ ਡੈਸ਼ਬੋਰਡ",
      subtitle:
        "ਜੀ ਆਇਆਂ ਨੂੰ, ਰਾਮ ਸਿੰਘ। ਤੁਹਾਡੇ ਖੇਤ ਵਿੱਚ ਕੀ ਹੋ ਰਿਹਾ ਹੈ, ਇੱਥੇ ਦੇਖੋ।",
      stats: {
        land: "ਕੁੱਲ ਜ਼ਮੀਨ",
        crop: "ਮੌਜੂਦਾ ਫਸਲ",
        moisture: "ਮਿੱਟੀ ਦੀ ਨਮੀ",
        value: "ਬਾਜ਼ਾਰ ਮੁੱਲ",
      },
      weather: {
        title: "ਮੌਸਮ ਅਤੇ ਸੰਚਾਲਨ",
        temp: "ਤਾਪਮਾਨ",
        humidity: "ਨਮੀ",
        wind: "ਹਵਾ",
        rain: "ਮੀਂਹ",
        sunny: "ਧੁੱਪ",
        moderate: "ਦਰਮਿਆਨਾ",
        north: "ਉੱਤਰ",
        nextDays: "ਅਗਲੇ 3 ਦਿਨ",
      },
      insight: {
        title: "ਗੰਭੀਰ ਅਲਰਟ",
        desc: "ਸੋਮਵਾਰ ਲਈ ਉੱਚ ਨਮੀ ਅਤੇ ਰਾਤ ਦੇ ਤਾਪਮਾਨ ਵਿੱਚ ਗਿਰਾਵਟ ਦੀ ਭਵਿੱਖਬਾਣੀ ਕੀਤੀ ਗਈ ਹੈ। ਆਲੂ ਦੀਆਂ ਫਸਲਾਂ ਵਿੱਚ ਲੇਟ ਬਲਾਈਟ ਦਾ ਖਤਰਾ।",
        preventionTitle: "ਲੇਟ ਬਲਾਈਟ ਰੋਕਥਾਮ ਦੇ ਕਦਮ",
        step1:
          "ਤਾਪਮਾਨ ਵਿੱਚ ਸੰਭਾਵਿਤ ਗਿਰਾਵਟ ਤੋਂ ਪਹਿਲਾਂ ਮੈਨਕੋਜ਼ੈਬ ਜਾਂ ਕਲੋਰੋਥਾਲੋਨਿਲ ਵਾਲੇ ਸੁਰੱਖਿਆਤਮਕ ਉੱਲੀਨਾਸ਼ਕ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
        step2:
          "ਆਲੂ ਦੇ ਪੌਦਿਆਂ ਦੇ ਆਲੇ ਦੁਆਲੇ ਪਾਣੀ ਇਕੱਠਾ ਹੋਣ ਤੋਂ ਰੋਕਣ ਲਈ ਢੁਕਵੀਂ ਨਿਕਾਸੀ ਨੂੰ ਯਕੀਨੀ ਬਣਾਓ।",
        step3:
          "ਰੋगाਣੂ ਦੇ ਫੈਲਾਅ ਨੂੰ ਰੋਕਣ ਲਈ ਕਿਸੇ ਵੀ ਸੰਕਰਮਿਤ ਪੱਤੇ ਨੂੰ ਤੁਰੰਤ ਹਟਾਓ ਅਤੇ ਨਸ਼ਟ ਕਰੋ।",
      },
      activities: {
        title: "ਹਾਲੀਆ ਗਤੀਵਿਧੀ",
        item1: {
          title: "ਬਾਜ਼ਾਰ ਕੀਮਤ ਅਲਰਟ",
          desc: "ਲੁਧਿਆਣਾ ਮੰਡੀ ਵਿੱਚ ਕਣਕ ਦੇ ਭਾਅ 5% ਵਧੇ।",
          time: "2 ਘੰਟੇ ਪਹਿਲਾਂ",
        },
        item2: {
          title: "ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਮੁਕੰਮਲ",
          desc: "ਸੈਕਸ਼ਨ ਬੀ ਵਿੱਚ ਐਨਪੀਕੇ ਪੱਧਰ ਅਨੁਕੂਲ ਹਨ।",
          time: "5 ਘੰਟੇ ਪਹਿਲਾਂ",
        },
        item3: {
          title: "ਸਰਕਾਰੀ ਯੋਜਨਾ ਸਿਫਾਰਸ਼",
          desc: "ਤੁਸੀਂ ਪੀਐਮ-ਕਿਸਾਨ ਸਬਸਿਡੀ ਲਈ ਯੋਗ ਹੋ।",
          time: "1 ਦਿਨ ਪਹਿਲਾਂ",
        },
      },
      collaboration: {
        title: "ਸਹਿਯੋਗ",
        desc: "ਤੁਹਾਡੇ ਕੋਲ ਪੈਪਸੀਕੋ ਅਤੇ ਆਈਟੀਸੀ ਈ-ਚੌਪਾਲ ਤੋਂ 2 ਪੈਂਡਿੰਗ ਕੰਟਰੈਕਟ ਪੇਸ਼ਕਸ਼ਾਂ ਹਨ।",
        button: "ਕੰਟਰੈਕਟਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ",
      },
      farmProfile: {
        title: "ਫਾਰਮ ਪ੍ਰੋਫਾਈਲ",
        holding: "ਕੁੱਲ ਜੋਤ",
        location: "ਮੌਜੂਦਾ ਸਥਾਨ",
        profit: "ਕੁੱਲ ਸੀਜ਼ਨ ਮੁਨਾਫਾ",
        borewell: "ਬੋਰਵੈੱਲ ਸਥਿਤੀ",
        borewellVal: "ਸਰਗਰਮ",
        soilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
        soilVal: "ਜਲੋੜ (ਦੋਮਟ)",
      },
    },
    crops: {
      title: "ਫਸਲ ਪ੍ਰਬੰਧਨ",
      subtitle: "ਆਪਣੇ ਸਰਗਰਮ ਫਸਲ ਚੱਕਰਾਂ ਦੀ ਨਿਗਰਾਨੀ ਅਤੇ ਪ੍ਰਬੰਧਨ ਕਰੋ।",
      addBtn: "ਨਵੀਂ ਫਸਲ ਸ਼ਾਮਲ ਕਰੋ",
      activeTitle: "ਸਰਗਰਮ ਫਸਲਾਂ",
      planted: "ਬੀਜੀ ਗਈ",
      stage: "ਵਿਕਾਸ ਪੜਾਅ",
      health: "ਸਿਹਤ ਸੂਚਕਾਂਕ",
      waterNeed: "ਪਾਣੀ ਦੀ ਲੋੜ",
      viewDetails: "ਵੇਰਵੇ ਦੇਖੋ",
      history: "ਪਿਛਲਾ ਵਾਢੀ ਦਾ ਇਤਿਹਾਸ",
      table: {
        type: "ਫਸਲ ਦੀ ਕਿਸਮ",
        season: "ਸੀਜ਼ਨ",
        yield: "ਪੈਦਾਵਾਰ",
        profit: "ਸ਼ੁੱਧ ਮੁਨਾਫਾ",
        status: "ਸਥਿਤੀ",
        completed: "ਮੁਕੰਮਲ",
      },
    },
    market: {
      title: "ਬਾਜ਼ਾਰ ਭਾਅ",
      subtitle: "ਵਿਸ਼ਵਵਿਆਪੀ ਅਤੇ ਸਥਾਨਕ ਭਾਰਤੀ ਬਾਜ਼ਾਰਾਂ ਤੋਂ ਅਸਲ-ਸਮੇਂ ਦਾ ਡੇਟਾ।",
      searchPlaceholder: "ਫਸਲ ਜਾਂ ਬਾਜ਼ਾਰ ਖੋਜੋ...",
      mandiTitle: "ਭਾਰਤੀ ਮੰਡੀ ਦੇ ਭਾਅ",
      today: "ਅੱਜ",
      yesterday: "ਕੱਲ੍ਹ",
      table: {
        crop: "ਫਸਲ",
        mandi: "ਬਾਜ਼ਾਰ (ਮੰਡੀ)",
        price: "ਕੀਮਤ (ਪ੍ਰਤੀ ਕੁਇੰਟਲ)",
        trend: "ਰੁਝਾਨ",
      },
      global: {
        title: "ਵਿਸ਼ਵਵਿਆਪੀ ਸੰਕੇਤਕ",
        analysis: "ਵਿਸ਼ਲੇਸ਼ਣ",
        analysisDesc:
          "ਕੱਚੇ ਤੇਲ ਦੀਆਂ ਵਧਦੀਆਂ ਕੀਮਤਾਂ ਅਗਲੇ ਮਹੀਨੇ ਖਰੀਫ ਫਸਲਾਂ ਲਈ ਆਵਾਜਾਈ ਦੇ ਖਰਚੇ ਵਧਾ ਸਕਦੀਆਂ ਹਨ।",
      },
      export: {
        title: "ਨਿਰਯਾਤ ਦੇ ਮੌਕੇ",
        desc: "ਮੇਨਾ (MENA) ਖੇਤਰਾਂ ਵਿੱਚ ਭਾਰਤੀ ਬਾਸਮਤੀ ਚੌਲਾਂ ਦੀ ਉੱਚ ਮੰਗ। ਯਕੀਨੀ ਬਾਇ-ਬੈਕ ਕੰਟਰੈਕਟ ਉਪਲਬਧ ਹਨ।",
        button: "ਨਿਰਯਾਤ ਭਾਗੀਦਾਰ ਦੇਖੋ",
      },
    },
    data: {
      wheat: "ਕਣਕ",
      basmati: "ਬਾਸਮਤੀ ਚੌਲ",
      mustard: "ਸਰ੍ਹੋਂ",
      cotton: "ਕਪਾਹ",
      soybean: "ਸੋਇਆਬੀਨ",
      maize: "ਮੱਕੀ",
      location: "ਲੁਧਿਆਣਾ, ਪੰਜਾਬ",
      karnal: "ਕਰਨਾਲ, ਹਰਿਆਣਾ",
      jaipur: "ਜੈਪੁਰ, ਰਾਜਸਥਾਨ",
      nagpur: "ਨਾਗਪੁਰ, ਮਹਾਰਾਸ਼ਟਰ",
      indore: "ਇੰਦੌਰ, ਐਮਪੀ",
      acres: "ਏਕੜ",
      growth: "ਵਿਕਾਸ",
      vsYesterday: "ਕੱਲ੍ਹ ਦੇ ਮੁਕਾਬਲੇ",
      today: "ਅੱਜ",
      quintals: "ਕੁਇੰਟਲ",
      lakhs: "ਲੱਖ",
    },
    profile: {
      title: "ਗਾਹਕ ਪ੍ਰੋਫਾਈਲ",
      editBtn: "ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
      id: "ਆਈਡੀ",
      editModal: {
        title: "ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
        name: "ਪੂਰਾ ਨਾਂ",
        phone: "ਫੋਨ ਨੰਬਰ",
        location: "ਫਾਰਮ ਦੀ ਸਥਿਤੀ",
        landSize: "ਜ਼ਮੀਨ ਦਾ ਆਕਾਰ (ਏਕੜ)",
        soil: "ਮੁੱਖ ਮਿੱਟੀ",
        cancel: "ਰੱਦ ਕਰੋ",
        save: "ਤਬਦੀਲੀਆਂ ਸੁਰੱਖਿਅਤ ਕਰੋ",
      },
      resources: {
        title: "ਜ਼ਮੀਨ ਅਤੇ ਸਰੋਤ",
        holding: "ਕੁੱਲ ਜੋਤ",
        soilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
        water: "ਮੁੱਖ ਪਾਣੀ ਦਾ ਸਰੋਤ",
        location: "ਜ਼ਮੀਨ ਦੀ ਸਥਿਤੀ",
        lat: "ਵਿਥਕਾਰ (Lat)",
        lng: "ਲੰਬਕਾਰ (Lng)",
        profit: "ਪਿਛਲੇ ਸਾਲ ਦਾ ਮੁਨਾਫਾ",
        functional: "ਕਾਰਜਸ਼ੀਲ",
        borewell: "ਆਪਣਾ ਬੋਰਵੈੱਲ",
      },
      documents: {
        title: "ਤਸਦੀਕ ਕੀਤੇ ਦਸਤਾਵੇਜ਼",
        aadhar: "ਆਧਾਰ ਕਾਰਡ (ਤਸਦੀਕ)",
        land: "ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ (ਖਤੌਨੀ)",
        bank: "ਬੈਂਕ ਪਾਸਬੁੱਕ",
        verified: "ਤਸਦੀਕ ਸ਼ੁਦਾ",
        pending: "ਰਿਵਿਊ ਅਧੀਨ",
        updated: "ਨੂੰ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ",
      },
      membership: {
        title: "ਮੈਂਬਰਸ਼ਿਪ",
        partner: "FPO ਪਾਰਟਨਰ",
        since: "ਤੋਂ ਮੈਂਬਰ",
        points: "ਵਫਾਦਾਰੀ ਪੁਆਇੰਟ",
      },
      settings: {
        title: "ਤਤਕਾਲ ਸੈਟਿੰਗਾਂ",
        notifications: "ਨੋਟੀਫਿਕੇਸ਼ਨ ਤਰਜੀਹਾਂ",
        push: "ਪੁਸ਼ ਨੋਟੀਫਿਕੇਸ਼ਨ",
        sms: "SMS ਅਲਰਟ",
        language: "ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ",
        signout: "ਸਾਈਨ ਆਊਟ",
      },
      roles: {
        adminTitle: "ਸਿਸਟਮ ਪ੍ਰਸ਼ਾਸਕ",
        salesmanTitle: "ਸੋਰਸਿੰਗ ਮੈਨੇਜਰ",
        adminLocation: "ਗਲੋਬਲ ਕਮਾਂਡ ਸੈਂਟਰ",
        salesmanLocation: "ਖੇਤਰੀ ਦਫ਼ਤਰ",
      },
      salesman: {
        purchases: "ਪ੍ਰਬੰਧਿਤ ਖਰੀਦਦਾਰੀ",
        fpos: "ਸਰਗਰਮ FPOs",
        pending: "ਬਕਾਇਆ ਇਕਰਾਰਨਾਮੇ",
        value: "ਕੁੱਲ ਮੁੱਲ",
        activeFposTitle: "ਸਰਗਰਮ ਸੋਰਸਿੰਗ FPOs",
        recentTitle: "ਹਾਲੀਆ ਖਰੀਦ ਗਤੀਵਿਧੀ",
        fpoData: [
          {
            name: "ਲੁਧਿਆਣਾ ਅਨਾਜ ਸਹਿਕਾਰੀ",
            type: "ਕਣਕ/ਬਾਸਮਤੀ",
            status: "ਸੀਜ਼ਨ ਵਿੱਚ",
          },
          { name: "ਅੰਮ੍ਰਿਤਸਰ ਕਿਸਾਨ FPO", type: "ਆਲੂ/ਗੰਨਾ", status: "ਸਮਾਪਤੀ" },
          { name: "ਜਲੰਧਰ ਸਬਜ਼ੀ ਸੰਘ", type: "ਜੈਵਿਕ ਸਬਜ਼ੀਆਂ", status: "ਸਰਗਰਮ" },
        ],
        logs: [
          {
            event: "ਇਕਰਾਰਨਾਮਾ ਅੰਤਿਮ ਰੂਪ ਦਿੱਤਾ ਗਿਆ",
            target: "M/S ITC ਈ-ਚੌਪਾਲ",
            time: "2 ਘੰਟੇ ਪਹਿਲਾਂ",
          },
          {
            event: "ਸੋਰਸਿੰਗ ਅਲਰਟ",
            target: "ਮੂੰਗੀ ਦੀ ਦਾਲ ਵਿੱਚ ਕੀਮਤ ਵਾਧਾ",
            time: "5 ਘੰਟੇ ਪਹਿਲਾਂ",
          },
          {
            event: "ਆਡਿਟ ਪੂਰਾ ਹੋਇਆ",
            target: "ਸੈਕਸ਼ਨ ਸੀ ਸੋਰਸਿੰਗ",
            time: "ਕੱਲ੍ਹ",
          },
        ],
      },
      admin: {
        activeUsers: "ਸਰਗਰਮ ਉਪਭੋਗਤਾ",
        uptime: "ਸਿਸਟਮ ਅਪਟਾਈਮ",
        health: "ਸਿਸਟਮ ਦੀ ਸਿਹਤ",
        security: "ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀਆਂ",
        oversight: "ਬਹੁ-ਭੂਮਿਕਾ ਨਿਗਰਾਨੀ",
        criticalLogs: "ਮਹੱਤਵਪੂਰਨ ਲੌਗਸ",
        noLogs: "ਪਿਛਲੇ 24 ਘੰਟਿਆਂ ਵਿੱਚ ਕੋਈ ਨਾਜ਼ੁਕ ਸਿਸਟਮ ਅਲਰਟ ਨਹੀਂ ਮਿਲਿਆ।",
        viewAll: "ਸਾਰੇ ਆਡਿਟ ਲੌਗਸ ਵੇਖੋ",
        clusters: {
          customer: "ਗਾਹਕ ਪੋਰਟਲ",
          salesman: "ਸੇਲਜ਼ਮੈਨ ਨੈੱਟਵਰਕ",
          admin: "ਐਡਮਿਨ ਕੋਰ",
        },
      },
    },
    sidebar: {
      menu: "ਮੇਨੂ",
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      analytics: "ਏਆਈ ਵਿਸ਼ਲੇਸ਼ਣ",
      crops: "ਪੀਕ ਪ੍ਰਬੰਧਨ",
      residue: "ਰਹਿੰਦ-ਖੂੰਹਦ ਅਤੇ ਚਾਰਾ",
      weather: "ਮੌਸਮ",
      market: "ਬਾਜ਼ਾਰ ਭਾਅ",
      profile: "ਪ੍ਰੋਫਾਈਲ",
      logout: "ਲੌਗ ਆਉਟ",
    },
    weatherDetails: {
      title: "ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ",
      subtitle: "ਤੁਹਾਡੇ ਸਥਾਨ ਲਈ ਸਟੀਕ ਖੇਤੀਬਾੜੀ ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ।",
      live: "ਲਾਈਵ",
      lastUpdated: "ਆਖਰੀ ਅਪਡੇਟ",
      forecast7Day: "7-ਦਿਨਾਂ ਦੀ ਭਵਿੱਖਬਾਣੀ",
      tomorrow: "ਕੱਲ੍ਹ",
      sunday: "ਐਤਵਾਰ",
      monday: "ਸੋਮਵਾਰ",
      tuesday: "ਮੰਗਲਵਾਰ",
      wednesday: "ਬੁੱਧਵਾਰ",
      mostlySunny: "ਜ਼ਿਆਦਾਤਰ ਧੁੱਪ",
      sunny: "ਧੁੱਪ",
      lightShowers: "ਹਲਕੀ ਫੁਹਾਰ",
      rainy: "ਮੀਂਹ",
      partlyCloudy: "ਅੰਸ਼ਕ ਰੂਪ ਵਿੱਚ ਬੱਦਲ",
      alerts: "ਗੰਭੀਰ ਅਲਰਟ",
      alertDesc:
        "ਸੋਮਵਾਰ ਲਈ ਉੱਚ ਨਮੀ ਅਤੇ ਰਾਤ ਦੇ ਤਾਪਮਾਨ ਵਿੱਚ ਗਿਰਾਵਟ ਦੀ ਭਵਿੱਖਬਾਣੀ ਕੀਤੀ ਗਈ ਹੈ। ਆਲੂ ਦੀਆਂ ਫਸਲਾਂ ਵਿੱਚ ਲੇਟ ਬਲਾਈਟ ਦਾ ਖਤਰਾ।",
      viewPrevention: "ਰੋਕਥਾਮ ਦੇ ਕਦਮ ਦੇਖੋ",
      advice: "ਬਿਜਾਈ ਦੀ ਸਲਾਹ",
      adviceDesc:
        "ਮਿੱਟੀ ਦੀ ਨਮੀ ਇਸ ਸਮੇਂ 42% ਹੈ। ਉੱਤਰ-ਪੂਰਬੀ ਖੇਤਰ ਵਿੱਚ ਫਲੀਆਂ ਬੀਜਣ ਲਈ ਸਥਿਤੀਆਂ ਸਹੀ ਹਨ। ਸਾਡੇ ਵਨ-ਟੂ-ਵਨ ਈਕੋਸਿਸਟਮ ਵਿੱਚ ਆਪਣੀ ਯਾਤਰਾ ਜਾਰੀ ਰੱਖੋ।",
      optimalTemp: "ਅਨੁਕੂਲ ਮਿੱਟੀ ਦਾ ਤਾਪਮਾਨ: 18-24°C",
      nextIrrigation: "ਅਗਲੀ ਸਿੰਚਾਈ: 3 ਦਿਨ",
    },
    analytics: {
      title: "AI ਇਨਸਾਈਟਸ ਪੋਰਟਲ",
      subtitle:
        "ਆਪਣੇ ਫਾਰਮ ਦੀ ਉਤਪਾਦਕਤਾ ਨੂੰ ਅਨੁਕੂਲ ਬਣਾਉਣ, ਪੈਦਾਵਾਰ ਦੀ ਭਵਿੱਖਬਾਣੀ ਕਰਨ ਅਤੇ ਬਾਜ਼ਾਰ ਦੀ ਮੰਗ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਉਣ ਲਈ ਉੱਨਤ ਮਸ਼ੀਨ ਲਰਨਿੰਗ ਮਾਡਲਾਂ ਦਾ ਲਾਭ ਉਠਾਓ।",
      stats: {
        accuracy: "ਭਵਿੱਖਬਾਣੀ ਦੀ ਸ਼ੁੱਧਤਾ",
        roi: "ਅਨੁਮਾਨਿਤ ROI",
        usage: "ਵਿਸ਼ਲੇਸ਼ਣ ਵਰਤੋਂ",
        credits: "ਮੁਫਤ ਕ੍ਰੈਡਿਟ ਬਾਕੀ",
        activeModels: "ਸਰਗਰਮ ਮਾਡਲ",
        basedOn: "ਸਮਾਰਟ ਸਿਫਾਰਸ਼ ਤੇ ਅਧਾਰਿਤ",
      },
      comingSoon: "ਮੋਡੀਊਲ ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ",
      training: "ਪੈਦਾਵਾਰ ਮਲਟੀ-ਵੇਰੀਏਟ ਰੈਗਰੈਸ਼ਨ ਮਾਡਲ ਸਿਖਲਾਈ...",
      historyTitle: "ਇਤਿਹਾਸਕ ਪੈਦਾਵਾਰ ਦੇ ਰੁਝਾਨ",
      coreModules: "ਕੋਰ ML ਮੋਡੀਊਲ",
      cropRec: "ਫਸਲ ਦੀ ਸਿਫਾਰਸ਼",
      yieldPred: "ਪੈਦਾਵਾਰ ਦੀ ਭਵਿੱਖਬਾਣੀ",
      pestDet: "ਕੀੜਿਆਂ ਦੀ ਪਛਾਣ",
      demandFore: "ਮੰਗ ਦੀ ਭਵਿੱਖਬਾਣੀ",
      optimalSelection: "ਅਨੁਕੂਲ ਚੋਣ",
      betaPhase: "ਬੀਟਾ ਪੜਾਅ",
      trainingModel: "ਸਿਖਲਾਈ ਮਾਡਲ",
      uploadDesc: "ਨਿਦਾਨ ਲਈ ਤਸਵੀਰਾਂ ਅਪਲੋਡ ਕਰੋ।",
      dragDrop: "ਫਾਰਮ ਦੀ ਫੋਟੋ ਖਿੱਚੋ ਜਾਂ ਇੱਥੇ ਸੁੱਟੋ",
    },
    residue: {
      title: "ਫਸਲ ਦੀ ਰਹਿੰਦ-ਖੂੰਹਦ ਦਾ ਪ੍ਰਬੰਧਨ",
      subtitle:
        "ਖੇਤੀਬਾੜੀ ਦੀ ਰਹਿੰਦ-ਖੂੰਹਦ ਨੂੰ ਉੱਚ-ਮੁੱਲ ਵਾਲੇ ਪਸ਼ੂ ਫੀਡ ਵਿੱਚ ਬਦਲਣਾ।",
      methods: {
        physical: {
          title: "ਭੌਤਿਕ ਇਲਾਜ",
          desc: "ਕੱਟਣ, ਪੀਸਣ ਅਤੇ ਪੈਲੇਟਿੰਗ ਵਰਗੀਆਂ ਮਕੈਨੀਕਲ ਪ੍ਰਕਿਰਿਆਵਾਂ।",
          impact: "ਖਪਤ ਦਰਾਂ ਨੂੰ 15-20% ਵਧਾਉਂਦਾ ਹੈ ਅਤੇ ਬਰਬਾਦੀ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ।",
        },
        chemical: {
          title: "ਰਸਾਇਣਕ ਇਲਾਜ",
          desc: "ਯੂਰੀਆ ਜਾਂ ਅਮੋਨੀਆ ਦੇ ਇਲਾਜ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਪੌਸ਼ਟਿਕ ਤੱਤਾਂ ਨੂੰ ਵਧਾਉਣਾ।",
          impact:
            "ਕੱਚੇ ਪ੍ਰੋਟੀਨ ਦੀ ਮਾਤਰਾ ਵਧਾਉਂਦਾ ਹੈ ਅਤੇ ਲਿਗਨਿਨ ਦੇ ਪਾਚਨ ਵਿੱਚ ਸੁਧਾਰ ਕਰਦਾ ਹੈ।",
        },
        biological: {
          title: "ਜੀਵ-ਵਿਗਿਆਨਕ ਇਲਾਜ",
          desc: "ਰਹਿੰਦ-ਖੂੰਹਦ ਨੂੰ ਖਮੀਰ ਕਰਨ ਲਈ ਮਿੱਤਰ ਉੱਲੀ ਜਾਂ ਰੋਗਾਣੂਆਂ ਦੀ ਵਰਤੋਂ ਕਰਨਾ।",
          impact: "ਬਿਹਤਰ ਊਰਜਾ ਸਮਾਈ ਲਈ ਸੈਲੂਲੋਜ਼ ਦਾ ਤੇਜ਼ੀ ਨਾਲ ਟੁੱਟਣਾ।",
        },
        fortification: {
          title: "ਪੋਸ਼ਣ ਸੰਬੰਧੀ ਮਜ਼ਬੂਤੀ",
          desc: "ਗੁੜ, ਖਣਿਜ ਜਾਂ ਬਾਈਪਾਸ ਪ੍ਰੋਟੀਨ ਨਾਲ ਮਿਲਾਉਣਾ।",
          impact: "ਉੱਚ-ਉਪਜ ਵਾਲੇ ਪਸ਼ੂਆਂ ਲਈ ਇੱਕ ਸੰਪੂਰਨ ਸੰਤੁਲਿਤ ਖੁਰਾਕ ਬਣਾਉਂਦਾ ਹੈ।",
        },
      },
      benefitLabel: "ਲਾਭ",
      dashboardTitle: "ਰਹਿੰਦ-ਖੂੰਹਦ ਦੀ ਵਰਤੋਂ ਦਾ ਡੈਸ਼ਬੋਰਡ",
      processNow: "ਹੁਣੇ ਪ੍ਰਕਿਰਿਆ ਕਰੋ",
      addFortification: "ਮਜ਼ਬੂਤੀ ਜੋੜੋ",
      whyTitle: "ਰਹਿੰਦ-ਖੂੰਹਦ ਦਾ ਪ੍ਰਬੰਧਨ ਕਿਉਂ ਕਰੀਏ?",
      whyItems: [
        "ਵਾਤਾਵਰਣ ਪ੍ਰਦੂਸ਼ਣ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ (ਸੜਨ ਤੋਂ ਰੋਕਦਾ ਹੈ)",
        "ਪਸ਼ੂਆਂ ਲਈ ਘੱਟ ਲਾਗਤ ਵਾਲੀ ਫੀਡ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ",
        "ਫਾਰਮ ਦੀ ਸਥਿਰਤਾ ਨੂੰ ਵਧਾਉਂਦਾ",
        "ਕਿਸਾਨਾਂ ਲਈ ਵਾਧੂ ਆਮਦਨ ਦਾ ਸਰੋਤ",
      ],
      challengesTitle: "ਮੁੱਖ ਚੁਣੌਤੀਆਂ",
      challenges: {
        nutritional: {
          title: "ਪੋਸ਼ਣ ਸੰਬੰਧੀ ਅਸੰਤੁਲਨ",
          desc: "ਖੁਆਉਣ ਤੋਂ ਪਹਿਲਾਂ ਇਲਾਜ/ਮਜ਼ਬੂਤ ਕੀਤਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ।",
        },
        logistics: {
          title: "ਲੌਜਿਸਟਿਕਸ ਅਤੇ ਸਟੋਰੇਜ",
          desc: "ਭਾਰੀ ਰਹਿੰਦ-ਖੂੰਹਦ ਕਾਫ਼ੀ ਜਗ੍ਹਾ ਲੈਂਦੀ ਹੈ।",
        },
        awareness: {
          title: "ਜਾਗਰੂਕਤਾ ਦੀ ਘਾਟ",
          desc: "ਲਾਗੂ ਕਰਨ ਲਈ ਵਿਸ਼ੇਸ਼ ਸਿਖਲਾਈ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ।",
        },
      },
      industrialTitle: "ਉਦਯੋਗਿਕ ਸਮਰੱਥਾ",
      industrialDesc:
        "ਵਾਧੂ ਖੇਤੀ-ਕੂੜਾ ਵੇਚਣ ਜਾਂ ਇਸ ਨੂੰ ਉੱਚ-ਮੁੱਲ ਵਾਲੀ ਫੀਡ ਵਿੱਚ ਪ੍ਰੋਸੈਸ ਕਰਨ ਲਈ ਸਥਾਨਕ ਬਾਇਓ-ਰਿਫਾਇਨਰੀਆਂ ਨਾਲ ਜੁੜੋ।",
      findPartners: "ਨੇੜਲੇ ਭਾਈਵਾਲ ਲੱਭੋ",
      partnersModal: {
        title: "ਨੇੜਲੇ ਪ੍ਰੋਸੈਸਿੰਗ ਭਾਈਵਾਲ",
        subtitle:
          "ਆਪਣੀ ਫਸਲ ਦੀ ਰਹਿੰਦ-ਖੂੰਹਦ ਵੇਚਣ ਲਈ ਸਥਾਨਕ ਬਾਇਓ-ਰਿਫਾਇਨਰੀਆਂ ਅਤੇ ਫੀਡ ਪ੍ਰੋਸੈਸਿੰਗ ਯੂਨਿਟਾਂ ਨਾਲ ਜੁੜੋ।",
        distance: "ਕਿਮੀ ਦੂਰ",
        connect: "ਸੰਪਰਕ ਕਰੋ",
        close: "ਬੰਦ ਕਰੋ",
        partner1: {
          name: "ਪੰਜਾਬ ਬਾਇਓ-ਐਨਰਜੀ ਕਾਰਪੋਰੇਸ਼ਨ",
          type: "ਬਾਇਓ-ਰਿਫਾਇਨਰੀ",
          accepts: "ਕਣਕ ਦੀ ਪਰਾਲੀ, ਝੋਨੇ ਦੀ ਪਰਾਲੀ ਸਵੀਕਾਰ ਕਰਦਾ ਹੈ",
        },
        partner2: {
          name: "ਲੁਧਿਆਣਾ ਐਗਰੀ-ਫੀਡਜ਼",
          type: "ਫੀਡ ਪ੍ਰੋਸੈਸਰ",
          accepts: "ਮੱਕੀ ਦੀਆਂ ਟਾਂਡੀਆਂ, ਸਰ੍ਹੋਂ ਦੀਆਂ ਟਾਂਡੀਆਂ ਸਵੀਕਾਰ ਕਰਦਾ ਹੈ",
        },
        partner3: {
          name: "ਗ੍ਰੀਨ ਪਾਵਰ ਡਿਸਟਿਲਰੀਜ਼",
          type: "ਬਰੂਅਰੀ",
          accepts: "ਗੰਨੇ ਦੀ ਫੋਗ ਸਵੀਕਾਰ ਕਰਦਾ ਹੈ",
        },
      },
    },
  },
  mr: {
    languageName: "मराठी",
    nav: {
      home: "होम",
      dashboard: "डॅशबोर्ड",
      crops: "माझी पिके",
      market: "बाजार",
      signin: "साइन इन",
      profile: "प्रोफाइल",
      adminDashboard: "अ‍ॅडमिन कन्सोल",
      businessDashboard: "बिझनेस हब",
    },
    hero: {
      tagline: "भारतीय कृषी क्षेत्रात क्रांती",
      title: "डिजिटल इंटेलिजेंससह ग्राहकांचे सक्षमीकरण",
      subtitle:
        "डेटा-चालित सहकार्य, रिअल-टाइम अंतर्दृष्टी आणि शाश्वत पद्धतींद्वारे अल्पभूधारक ग्राहक आणि जागतिक बाजारपेठांमधील दरी कमी करणे.",
      getStarted: "सुरू करा",
      readReport: "प्रकल्प अहवाल वाचा",
      goDashboard: "डॅशबोर्डवर जा",
    },
    problem: {
      title: "समस्या",
      item1: "बाजार भाव निश्चितीमध्ये माहितीची विषमता।",
      item2: "थेट कॉर्पोरेट सहकाऱ्याचा अभाव।",
      item3: "अल्पभूधारक ग्राहकांसाठी अविश्वसनीय हवामान अंदाज।",
    },
    objectives: {
      title: "आमची उद्दिष्टे",
      item1: "ग्राहक पडताळणी (आधार/जमीन दस्तऐवज) सुव्यवस्थित करणे।",
      item2: "FPO-आधारित कॉर्पोरेट भागीदारी सुलभ करणे।",
      item3: "उच्च-अचूकता हवामान आणि माती विश्लेषण प्रदान करणे।",
    },
    collaboration: {
      title: "सहयोग मॉडेल",
      model1: {
        title: "कंत्राटी शेती",
        desc: "कापणीपूर्वीचे भाव करार सुरक्षित करा।",
      },
      model2: {
        title: "FPO पोर्टल",
        desc: "सामूहिक सौदेबाजीच्या शक्तीचा लाभ घ्या।",
      },
      model3: {
        title: "बाय-बॅक",
        desc: "जागतिक ब्रँड्सद्वारे खात्रीशीर खरेदी।",
      },
      model4: { title: "इनपुट सपोर्ट", desc: "थेट तंत्रज्ञान आणि बियाणे मदत।" },
    },
    caseStudies: {
      title: "सर्वोत्कृष्ट कडून शिकणे",
      desc: "अमूल, आयटीसी ई-चौपाल आणि पेप्सिको यांसारख्या दिग्गजांनी नाविन्य आणि सहकार्यातून भारतीय कृषी लँडस्केप कसे बदलले ते एक्सप्लोर करा।",
      link: "केस स्टडीज एक्सप्लोर करा",
    },
    mlImpact: {
      title: "ML केंद्र",
      desc: "आमचे पीक शिफारस इंजिन तुमच्या शेती योजनेला वैयक्तिकृत करण्यासाठी १० वर्षांहून अधिक ऐतिहासिक भारतीय हवामान आणि मंडी डेटा वापरते।",
      link: "तांत्रिक कागदपत्रे वाचा",
    },
    mlDocs: {
      back: "होमवर परत जा",
      version: "ML तांत्रिक वैशिष्ट्ये v1.0",
      title: "पीक शिफारस इंजिन",
      subtitle:
        "वन-टू-वन कनेक्शन प्लॅटफॉर्मला शक्ती देणाऱ्या बुद्धिमत्तेचा सखोल अभ्यास। आमचे इंजिन रिअल-टाइम विश्लेषणासह १०+ वर्षांच्या ऐतिहासिक डेटाला जोडते।",
      feature1: {
        title: "ऐतिहासिक डेटा प्रभुत्व",
        desc: "१० वर्षांहुन अधिक भारतीय हवामान नमुने आणि एगमार्कनेट मंडी किमती असलेल्या डेटासेटचा वापर करते।",
      },
      feature2: {
        title: "अनुकूल पीक मॉडेलिंग",
        desc: "मातीचे आरोग्य, सिंचन स्थिती आणि स्थानिक हवामान कल यावर आधारित संभाव्य उत्पन्नाचा अंदाज वर्तवते।",
      },
      arch: { title: "आर्किटेक्चर आणि डेटा पाइपलाइन" },
      pipeline1: {
        title: "हवामान API एकत्रीकरण",
        desc: "५-दिवसीय अचूक अंदाज प्रदान करण्यासाठी जागतिक हवामान उपग्रहांसह रिअल-टाइम सिंक।",
      },
      pipeline2: {
        title: "बाजार भाव सिंक",
        desc: "सरकारी एपीएमसी पोर्टलकडून दररोजचे अपडेट्स शेतकऱ्यांना नवीनतम किंमती मिळण्याची खात्री देतात।",
      },
      pipeline3: {
        title: "भू-स्थानिक टॅगिंग",
        desc: "अचूक पीक जुळणीसाठी स्थानिक मातीच्या नकाशांवर शेताच्या ठिकाणांचे मॅपिंग।",
      },
      verified: {
        title: "सत्यापित अचूकता",
        desc: "जमिनीवरील वास्तवाच्या अचूकतेची खात्री करण्यासाठी आमचे मॉडेल कृषी संशोधकांसह क्रॉस-रेफरन्स केलेले आहेत।",
        accuracy: "अचूकता दर",
        mandis: "मंडी ट्रॅकिंग",
        updates: "रिअल-टाइम",
      },
      data: {
        location: "लुधियाना, पंजाब",
        wheat: "गहू",
        acres: "एकर",
        growth: "वाढ",
        vsYesterday: "कालच्या तुलनेत",
        today: "आज",
      },
      footer: "होमपेजवर परत जा",
    },
    roles: {
      farmer: "ग्राहक",
      business: "व्यापारी / मंडी",
      salesman: "सेल्समन",
      admin: "प्रशासक",
    },
    signIn: {
      farmer: {
        title: "ग्राहक लॉगिन",
        subtitle: "तुमच्या फार्म विश्लेषण आणि पीक शिफारसींमध्ये प्रवेश करा।",
      },
      business: {
        title: "व्यापारी लॉगिन",
        subtitle: "मंडी ऑपरेशन्स आणि घाऊक व्यापार व्यवस्थापित करा।",
      },
      salesman: {
        title: "सेल्समन लॉगिन",
        subtitle: "लीड्स, करार आणि खरेदी व्यवस्थापित करा।",
      },
      admin: {
        title: "प्रशासक कन्सोल",
        subtitle:
          "सिस्टम हेल्थचे निरीक्षण करा आणि प्लॅटफॉर्म डेटा सत्यापित करा।",
      },
      backToHome: "होमवर परत जा",
      emailPhone: "ईमेल किंवा फोन नंबर",
      password: "पासवर्ड",
      forgotPassword: "पासवर्ड विसरलात?",
      rememberMe: "३० दिवसांसाठी लक्षात ठेवा",
      submit: "साइन इन",
      noAccount: "खाते नाही का?",
      createAccount: "खाते तयार करा",
    },
    adminDashboard: {
      panel: "अ‍ॅडमिन पॅनेल",
      sidebar: {
        dashboard: "डॅशबोर्ड",
        users: "वापरकर्ते",
        verifications: "सत्यापन",
        logs: "लॉग्स",
      },
      header: {
        title: "सिस्टम विहंगावलोकन",
        subtitle: "प्लॅटफॉर्म आरोग्य आणि सत्यापनाचे निरीक्षण करणे।",
        logout: "लॉगआउट",
      },
      stats: {
        farmers: "सत्यापित ग्राहक",
        companies: "सक्रिय सेल्समन",
        pending: "लंबित कागदपत्रे",
        uptime: "सिस्टम अपटाइम",
      },
      alerts: {
        title: "सिस्टम अलर्ट",
        latency: "पंजाब प्रदेशात पीक शिफारस इंजिनची विलंबता जास्त आहे।",
        unauthorized: "API एंडपॉइंटवर अनधिकृत लॉगिनचा प्रयत्न आढळला।",
      },
      queue: {
        title: "सत्यापन रांग",
        search: "ग्राहक शोधा...",
        name: "नाव",
        region: "प्रदेश",
        doc: "दस्तऐवज प्रकार",
        status: "स्थिती",
        actions: "कृती",
        review: "पुनरावलोकन करा",
        pending: "लंबित",
        inReview: "पुनरावलोकनाधीन",
      },
    },
    businessDashboard: {
      vault: "सेल्स वॉल्ट",
      sidebar: {
        overview: "विहंगावलोकन",
        post: "करार पोस्ट करा",
        projections: "अंदाज",
        procurement: "खरेदी",
        messages: "संदेश",
      },
      header: {
        title: "सेल्समन डॅशबोर्ड",
        subtitle: "सोर्सिंग आणि खरेदी हब",
        logout: "लॉगआउट",
      },
      stats: {
        live: "थेट",
        committed: "प्रतिबद्ध खरेदी",
        onboarded: "सत्यापित ग्राहक सामील झाले",
        disbursed: "एकूण वितरित (अग्रिम)",
      },
      actions: {
        post: "नवीन करार ऑफर पोस्ट करा",
        desc: "ML अंतर्दृष्टी वापरून विशिष्ट प्रदेश आणि पीक प्रकारांना लक्ष्य करते।",
      },
      offers: { title: "सक्रिय करार ऑफर", fulfilled: "पूर्ण" },
    },
    collaborationPortal: {
      title: "सहयोग पोर्टल",
      subtitle:
        "सेल्समन भागीदार आणि अन्न प्रक्रिया युनिट्सकडून करार ऑफरचे पुनरावलोकन करा।",
      contractor: "कंत्राटदार",
      crop: "पीक",
      price: "किंमत",
      perQuintal: "प्रति क्विंटल",
      duration: "कालावधी",
      actions: "क्रिया",
      accept: "स्वीकारा",
      reject: "नाकारा",
      details: "तपशील पहा",
      noContracts: "कोणतेही प्रलंबित करार आढळले नाहीत।",
      success: "करार यशस्वीरित्या स्वीकारला!",
      rejected: "ऑफर नाकारली।",
    },
    dashboard: {
      title: "ग्राहक डॅशबोर्ड",
      subtitle:
        "परत स्वागत आहे, राम सिंह। तुमच्या शेतात काय चालले आहे ते येथे आहे।",
      stats: {
        land: "एकूण जमीन",
        crop: "सध्याचे पीक",
        moisture: "मातीची ओलावा",
        value: "बाजार मूल्य",
      },
      weather: {
        title: "हवामान आणि ऑपरेशन्स",
        temp: "तापमान",
        humidity: "आर्द्रता",
        wind: "वारा",
        rain: "पाऊस",
        sunny: "सूर्यप्रकाश",
        moderate: "मध्यम",
        north: "उत्तर",
        nextDays: "पुढील ३ दिवस",
      },
      insight: {
        title: "गंभीर इशारे",
        desc: "सोमवारसाठी उच्च आर्द्रता आणि रात्रीच्या तापमानात घट होण्याचा अंदाज आहे। बटाटा पिकांमध्ये लेट ब्लाइटचा धोका।",
        preventionTitle: "लेट ब्लाइट प्रतिबंधात्मक उपाय",
        step1:
          "तापमानात अपेक्षित घट होण्यापूर्वी मॅन्कोझेब किंवा क्लोरोथालोनिल असलेले संरक्षणात्मक बुरशीनाशक वापरा।",
        step2:
          "बटाट्याच्या रोपांभोवती पाणी साचू नये म्हणून पुरेशी पाणी निचरा व्यवस्था सुनिश्चित करा।",
        step3:
          "रोगजनकांचा प्रसार रोखण्यासाठी कोणतीही प्रादुर्भावग्रस्त पाने त्वरित काढून टाका आणि नष्ट करा।",
      },
      activities: {
        title: "अलीकडील क्रियाकलाप",
        item1: {
          title: "बाजार भाव अलर्ट",
          desc: "लुधियाना मंडईत गव्हाचे भाव ५% ने वाढले।",
          time: "२ तासांपूर्वी",
        },
        item2: {
          title: "माती परीक्षण पूर्ण झाले",
          desc: "विभाग बी मध्ये एनपीके पातळी इष्टतम आहे।",
          time: "५ तासांपूर्वी",
        },
        item3: {
          title: "सरकारी योजना शिफारस",
          desc: "तुम्ही पीएम-किसान सबसिडीसाठी पात्र आहात।",
          time: "१ दिवसापूर्वी",
        },
      },
      collaboration: {
        title: "सहयोग",
        desc: "तुमच्याकडे पेप्सिको आणि आयटीसी ई-चौपाल कडून २ प्रलंबित कंत्राटी ऑफर आहेत।",
        button: "करारांचे पुनरावलोकन करा",
      },
      farmProfile: {
        title: "फार्म प्रोफाइल",
        holding: "एकूण धारण",
        location: "सध्याचे स्थान",
        profit: "एकूण हंगाम नफा",
        borewell: "बोरवेल स्थिती",
        borewellVal: "सक्रिय",
        soilType: "मातीचा प्रकार",
        soilVal: "गाळाची (पोयटा)",
      },
    },
    crops: {
      title: "पीक व्यवस्थापन",
      subtitle: "तुमच्या सक्रिय पीक चक्रांचे निरीक्षण आणि व्यवस्थापन करा।",
      addBtn: "नवीन पीक जोडा",
      activeTitle: "सक्रिय पिके",
      planted: "लावणी",
      stage: "वाढीचा टप्पा",
      health: "आरोग्य निर्देशांक",
      waterNeed: "पाण्याची गरज",
      viewDetails: "तपशील पहा",
      history: "मागील कापणीचा इतिहास",
      table: {
        type: "पिकाचा प्रकार",
        season: "हंगाम",
        yield: "उत्पन्न",
        profit: "निव्वळ नफा",
        status: "स्थिती",
        completed: "पूर्ण",
      },
    },
    market: {
      title: "बाजार भाव",
      subtitle: "जागतिक आणि स्थानिक भारतीय बाजारपेठांमधील रिअल-टाइम डेटा।",
      searchPlaceholder: "पीक किंवा बाजार शोधा...",
      mandiTitle: "भारतीय मंडी भाव",
      today: "आज",
      yesterday: "काल",
      table: {
        crop: "पीक",
        mandi: "बाजार (मंडी)",
        price: "किंमत (प्रति क्विंटल)",
        trend: "कल",
      },
      global: {
        title: "जागतिक निर्देशक",
        analysis: "विश्लेषण",
        analysisDesc:
          "कच्च्या तेलाच्या वाढत्या किमतींमुळे पुढील महिन्यात खरीप पिकांसाठी वाहतूक खर्च वाढू शकतो।",
      },
      export: {
        title: "निर्यात संधी",
        desc: "मेना (MENA) प्रदेशात भारतीय बासमती तांदळाला मोठी मागणी। खात्रीशीर बाय-बॅक कंत्राटे उपलब्ध।",
        button: "निर्यात भागीदार पहा",
      },
    },
    data: {
      wheat: "गहू",
      basmati: "बासमती तांदूळ",
      mustard: "मोहरी",
      cotton: "कापूस",
      soybean: "सोयाबीन",
      maize: "मका",
      location: "लुधियाना, पंजाब",
      karnal: "कर्नाल, हरियाणा",
      jaipur: "जयपूर, राजस्थान",
      nagpur: "नागपूर, महाराष्ट्र",
      indore: "इंदूर, एमपी",
      acres: "एकर",
      growth: "वाढ",
      vsYesterday: "कालच्या तुलनेत",
      today: "आज",
      quintals: "क्विंटल",
      lakhs: "लाख",
    },
    profile: {
      title: "ग्राहक प्रोफाइल",
      editBtn: "प्रोफाइल संपादित करा",
      id: "ID",
      editModal: {
        title: "तुमची प्रोफाइल संपादित करा",
        name: "पूर्ण नाव",
        phone: "फोन नंबर",
        location: "शेतीचे ठिकाण",
        landSize: "जमीन आकार (एकर)",
        soil: "प्राथमिक माती",
        cancel: "रद्द करा",
        save: "बदल जतन करा",
      },
      resources: {
        title: "जमीन आणि संसाधने",
        holding: "एकूण जमीनधारणा",
        soilType: "मातीचा प्रकार",
        water: "प्राथमिक पाण्याचा स्रोत",
        location: "जमिनीचे ठिकाण",
        lat: "अक्षांश",
        lng: "रेखांश",
        profit: "मागील वर्षाचा नफा",
        functional: "कार्यात्मक",
        borewell: "स्वतःची कूपनलिका",
      },
      documents: {
        title: "सत्यापित दस्तऐवज",
        aadhar: "आधार कार्ड (पडताळणी)",
        land: "जमीन रेकॉर्ड (खतौनी)",
        bank: "बँक पासबुक",
        verified: "सत्यापित",
        pending: "पुनरावलोकन प्रलंबित",
        updated: "ला अपडेट केले",
      },
      membership: {
        title: "सदस्यत्व",
        partner: "FPO भागीदार",
        since: "पासून सदस्य",
        points: "लॉयल्टी पॉइंट्स",
      },
      settings: {
        title: "त्वरित सेटिंग्ज",
        notifications: "सूचना प्राधान्ये",
        push: "पुश नोटिफिकेशन",
        sms: "SMS अलर्ट",
        language: "पसंतीची भाषा",
        signout: "साइन आउट",
      },
      roles: {
        adminTitle: "सिस्टम प्रशासक",
        salesmanTitle: "सोर्सिंग मॅनेजर",
        adminLocation: "ग्लोबल कमांड सेंटर",
        salesmanLocation: "प्रादेशिक कार्यालय",
      },
      salesman: {
        purchases: "व्यवस्थापित खरेदी",
        fpos: "सक्रिय FPOs",
        pending: "प्रलंबित करार",
        value: "एकूण मूल्य",
        activeFposTitle: "सक्रिय सोर्सिंग FPOs",
        recentTitle: "अलीकडील खरेदी क्रियाकलाप्",
        fpoData: [
          {
            name: "लुधियाना धान्य सहकारी",
            type: "गहू/बासमती",
            status: "हंगामात",
          },
          { name: "अमृतसर शेतकरी FPO", type: "बटाटा/ऊस", status: "समाप्ती" },
          {
            name: "जालंधर भाजीपाला संघ",
            type: "सेंद्रिय भाज्या",
            status: "सक्रिय",
          },
        ],
        logs: [
          {
            event: "करार अंतिम झाला",
            target: "M/S ITC ई-चौपाल",
            time: "२ तासांपूर्वी",
          },
          {
            event: "सोर्सिंग अलर्ट",
            target: "मूग डाळीच्या किमतीत वाढ",
            time: "५ तासांपूर्वी",
          },
          {
            event: "ऑडिट पूर्ण झाले",
            target: "सेक्शन सी सोर्सिंग",
            time: "काल",
          },
        ],
      },
      admin: {
        activeUsers: "सक्रिय वापरकर्ते",
        uptime: "सिस्टम अपटाइम",
        health: "सिस्टम आरोग्य",
        security: "सुरक्षा अलर्ट",
        oversight: "बहु-भूमिका देखरेख",
        criticalLogs: "गंभीर लॉग्स",
        noLogs: "मागील २४ तासांत कोणतेही गंभीर सिस्टम अलर्ट आढळले नाहीत.",
        viewAll: "सर्व ऑडिट लॉग पहा",
        clusters: {
          customer: "ग्राहक पोर्टल",
          salesman: "विक्रेता नेटवर्क",
          admin: "प्रशासक कोअर",
        },
      },
    },
    sidebar: {
      menu: "मेनू",
      dashboard: "डॅशबोर्ड",
      analytics: "एआय ॲनालिटिक्स",
      crops: "पीक व्यवस्थापन",
      residue: "अवशेष आणि चारा",
      weather: "हवामान",
      market: "बाजार भाव",
      profile: "प्रोफाइल",
      logout: "लॉग आउट",
    },
    weatherDetails: {
      title: "हवामान अंदाज",
      subtitle: "तुमच्या स्थानासाठी अचूक कृषी हवामान माहिती।",
      live: "थेट",
      lastUpdated: "अखेरचे अद्यतनित",
      forecast7Day: "७-दिवसांचा अंदाज",
      tomorrow: "उद्या",
      sunday: "रविवार",
      monday: "सोमवार",
      tuesday: "मंगळवार",
      wednesday: "बुधवार",
      mostlySunny: "मुख्यतः सूर्यप्रकाश",
      sunny: "थेट ऊन",
      lightShowers: "हलक्या सरी",
      rainy: "पाऊस",
      partlyCloudy: "अंशतः ढगाळ",
      alerts: "गंभीर इशारे",
      alertDesc:
        "सोमवारसाठी उच्च आर्द्रता आणि रात्रीच्या तापमानात घट होण्याचा अंदाज आहे। बटाटा पिकांमध्ये लेट ब्लाइटचा धोका।",
      viewPrevention: "प्रतिबंधात्मक पावले पहा",
      advice: "पेरणीचा सल्ला",
      adviceDesc:
        "मातीतील ओलावा सध्या ४२% आहे। ईशान्य भागात कडधान्ये पेरण्यासाठी परिस्थिती योग्य आहे। आमच्या वन-टू-वन इकोसिस्टममध्ये तुमचा प्रवास सुरू ठेवा।",
      optimalTemp: "इष्टतम मातीचे तापमान: १८-२४°C",
      nextIrrigation: "पुढील सिंचन: ३ दिवस",
    },
    analytics: {
      title: "AI इनसाइट्स पोर्टल",
      subtitle:
        "आपल्या शेताची उत्पादकता वाढवण्यासाठी, उत्पन्नाचा अंदाज घेण्यासाठी आणि बाजारातील मागणीचा अंदाज लावण्यासाठी प्रगत मशिन लर्निंग मॉडेल्सचा लाभ घ्या।",
      stats: {
        accuracy: "अंदाज अचूकता",
        roi: "अपेक्षित ROI",
        usage: "विश्लेषण वापर",
        credits: "मोफत क्रेडिट शिल्लक",
        activeModels: "सक्रिय मॉडेल्स",
        basedOn: "स्मार्ट शिफारसीवर आधारित",
      },
      comingSoon: "मॉड्यूल लवकरच येत आहे",
      training: "उत्पन्न मल्टी-व्हेरिएट रिग्रेशन मॉडेल प्रशिक्षण चालू आहे...",
      historyTitle: "ऐतिहासिक उत्पन्न कल",
      coreModules: "कोअर ML मॉडेल्स",
      cropRec: "पीक शिफारस",
      yieldPred: "उत्पन्न अंदाज",
      pestDet: "कीड ओळख",
      demandFore: "मागणीचा अंदाज",
      optimalSelection: "इष्टतम निवड",
      betaPhase: "बीटा टप्पा",
      trainingModel: "प्रशिक्षण मॉडेल",
      uploadDesc: "निदानासाठी चित्रे अपलोड करा।",
      dragDrop: "शेत फोटो खेचा किंवा इथे टाका",
    },
    residue: {
      title: "पीक अवशेष व्यवस्थापन",
      subtitle:
        "शेतीमधील टाकाऊ पदार्थांचे उच्च-मूल्य असलेल्या पशुखाद्यात रूपांतर करणे।",
      methods: {
        physical: {
          title: "भौतिक उपचार",
          desc: "कापणे, दळणे आणि पेलेटिंग यांसारख्या यांत्रिक प्रक्रिया।",
          impact: "खाद्य सेवनाचा दर १५-२०% वाढवतो आणि नासाडी कमी करतो।",
        },
        chemical: {
          title: "रासायनिक उपचार",
          desc: "युरिया किंवा अमोनिया उपचाराचा वापर करून पोषक तत्वे वाढवणे।",
          impact: "कच्च्या प्रथिनांचे प्रमाण वाढवते आणि लिग्निनचे पचन सुधारते।",
        },
        biological: {
          title: "जैविक उपचार",
          desc: "अवशेषांचे आंबवण करण्यासाठी मित्र बुरशी किंवा सूक्ष्मजीवांचा वापर करणे।",
          impact: "चांगल्या ऊर्जा शोषणासाठी सेल्युलोजचे वेगाने विघटन।",
        },
        fortification: {
          title: "पोषण सक्षमीकरण",
          desc: "गुळ, खनिजे किंवा बायपास प्रोटीनसह मिसळणे।",
          impact:
            "जास्त दूध देणाऱ्या जनावरांसाठी पूर्ण संतुलित आहार तयार करतो।",
        },
      },
      benefitLabel: "फायदा",
      dashboardTitle: "अवशेष वापर डॅशबोर्ड",
      processNow: "आताच प्रक्रिया करा",
      addFortification: "पोषक तत्वे जोडा",
      whyTitle: "अवशेष व्यवस्थापन का करावे?",
      whyItems: [
        "पर्यावरण प्रदूषण कमी करते (जाळण्यापासून रोखते)",
        "पशुधनासाठी कमी खर्चात खाद्य उपलब्ध करून देते",
        "शेतीची शाश्वतता वाढवते",
        "शेतकऱ्यांसाठी अतिरिक्त उत्पन्नाचा स्रोत",
      ],
      challengesTitle: "प्रमुख आव्हाने",
      challenges: {
        nutritional: {
          title: "पोषक तत्वांचे असंतुलन",
          desc: "खाद्य म्हणून वापरण्यापूर्वी उपचार/सक्षमीकरण करणे आवश्यक आहे।",
        },
        logistics: {
          title: "लॉजिस्टिक आणि स्टोरेज",
          desc: "अवजड अवशेष मोठी जागा व्यापतात।",
        },
        awareness: {
          title: "जागरूकतेचा अभाव",
          desc: "अंमलबजावणीसाठी विशेष प्रशिक्षणाची आवश्यकता आहे।",
        },
      },
      industrialTitle: "औद्योगिक क्षमता",
      industrialDesc:
        "अतिरिक्त कृषी-कचरा विकण्यासाठी या किंवा त्याचे उच्च-मूल्य असलेल्या खाद्यात रूपांतर करण्यासाठी स्थानिक जैव-रिफायनरींशी संपर्क साधा।",
      findPartners: "जवळचे भागीदार शोधा",
      partnersModal: {
        title: "जवळचे प्रक्रिया भागीदार",
        subtitle:
          "तुमचा पीक अवशेष विकण्यासाठी स्थानिक जैव-रिफायनरी आणि फीड प्रक्रिया युनिट्सशी संपर्क साधा।",
        distance: "किमी दूर",
        connect: "संपर्क करा",
        close: "बंद करा",
        partner1: {
          name: "पंजाब बायो-एनर्जी कॉर्प",
          type: "जैव-रिफायनरी",
          accepts: "गव्हाचा पेंढा, भाताचा पेंढा स्वीकारतो",
        },
        partner2: {
          name: "लुधियाना ॲग्री-फीड्स",
          type: "फीड प्रोसेसर",
          accepts: "मक्याची धाटं, मोहरीची धाटं स्वीकारतो",
        },
        partner3: {
          name: "ग्रीन पॉवर डिस्टिलरीज",
          type: "ब्रेव्हरी",
          accepts: "उसाची चिपाडे स्वीकारतो",
        },
      },
    },
  },
  te: {
    languageName: "తెలుగు",
    nav: {
      home: "హోమ్",
      dashboard: "డాష్‌బోర్డ్",
      crops: "నా పంటలు",
      market: "మార్కెట్",
      signin: "సైన్ ఇన్",
      profile: "ప్రొఫైల్",
      adminDashboard: "అడ్మిన్ కన్సోల్",
      businessDashboard: "బిజినెస్ హబ్",
    },
    hero: {
      tagline: "భారతీయ వ్యవసాయంలో విప్లవం",
      title: "డిజిటల్ ఇంటెలిజెన్స్‌తో కస్టమర్ల సాధికారత",
      subtitle:
        "డేటా ఆధారిత సహకారం, నిజ-సమయ అంతర్దృష్టులు మరియు స్థిరమైన పద్ధతుల ద్వారా చిన్న కస్టమర్లు మరియు ప్రపంచ మార్కెట్ల మధ్య అంతరాన్ని తగ్గించడం.",
      getStarted: "ప్రారంభించండి",
      readReport: "ప్రాజెక్ట్ నివేదిక చదవండి",
      goDashboard: "డాష్‌బోర్డ్‌కు వెళ్లండి",
    },
    problem: {
      title: "సమస్య",
      item1: "మార్కెట్ ధరల నిర్ణయంలో సమాచార అసమానత.",
      item2: "నేరుగా కార్పొరేట్ సహకారం లేకపోవడం.",
      item3: "చిన్న కస్టమర్లకు నమ్మదగని వాతావరణ అంచనా.",
    },
    objectives: {
      title: "మా లక్ష్యాలు",
      item1: "కస్టమర్ ధృవీకరణ (ఆధార్/భూమి పత్రాలు) క్రమబద్ధీకరించడం.",
      item2: "FPO-ఆధారిత కార్పొరేట్ భాగస్వామ్యాలను సులభతరం చేయడం.",
      item3: "అధిక-ఖచ్చితమైన వాతావరణం మరియు నేల విశ్లేషణను అందించడం.",
    },
    collaboration: {
      title: "సహకార నమూనాలు",
      model1: {
        title: "కాంట్రాక్ట్ వ్యవసాయం",
        desc: "పంట కోతకు ముందే ధర ఒప్పందాలను భరోసా చేసుకోండి.",
      },
      model2: {
        title: "FPO పోర్టల్స్",
        desc: "సామూహిక బేరసారాల శక్తిని ఉపయోగించుకోండి.",
      },
      model3: {
        title: "బై-బ్యాక్",
        desc: "గ్లోబల్ బ్రాండ్‌ల ద్వారా హామీతో కూడిన కొనుగోలు.",
      },
      model4: {
        title: "ఇన్‌పుట్ మద్దతు",
        desc: "నేరుగా టెక్ మరియు విత్తన సహాయం.",
      },
    },
    caseStudies: {
      title: "అత్యుత్తమ వ్యక్తుల నుండి నేర్చుకోవడం",
      desc: "అముల్, ఐటిసి ఇ-చౌపాల్ మరియు పెప్సికో వంటి దిగ్గజాలు ఆవిష్కరణ మరియు సహకారం ద్వారా భారతీయ వ్యవసాయ రంగాన్ని ఎలా మార్చాయో అన్వేషించండి.",
      link: "కేస్ స్టడీలను అన్వేషించండి",
    },
    mlImpact: {
      title: "ML ప్రభావం",
      desc: "మా పంట సిఫార్సు ఇంజిన్ మీ వ్యవసాయ ప్రణాళికను వ్యక్తిగతీకరించడానికి 10 సంవత్సరాలకు పైగా చారిత్రక భారతీయ వాతావరణం మరియు మండి డేటాను ఉపయోగిస్తుంది.",
      link: "సాంకేతిక పత్రాలను చదవండి",
    },
    mlDocs: {
      back: "హోమ్‌కు తిరిగి వెళ్ళు",
      version: "ML టెక్ స్పెక్స్ v1.0",
      title: "పంట సిఫార్సు ఇంజిన్",
      subtitle:
        "వన్-టు-వన్ కనెక్షన్ ప్లాట్‌ఫారమ్‌కు శక్తినిచ్చే మేధస్సుపై లోతైన అధ్యయనం. మా ఇంజిన్ 10+ సంవత్సరాల చారిత్రక డేటాను నిజ-సమయ విశ్లేషణలతో మిళితం చేస్తుంది.",
      feature1: {
        title: "చారిత్రక డేటా ప్రావీణ్యం",
        desc: "10 సంవత్సరాలకు పైగా భారతీయ వాతావరణ నమూనాలు మరియు అగ్‌మార్క్‌నెట్ మండి ధరలను కలిగి ఉన్న డేటాసెట్‌ను ఉపయోగిస్తుంది.",
      },
      feature2: {
        title: "ముందస్తు దిగుబడి మోడలింగ్",
        desc: "నేల ఆరోగ్యం, నీటి పారుదల స్థితి మరియు స్థానిక వాతావరణ పోకడల ఆధారంగా దిగుబడిని అంచనా వేస్తుంది.",
      },
      arch: { title: "ఆర్కిటెక్చర్ & డేటా పైప్‌లైన్" },
      pipeline1: {
        title: "వెదర్ API ఇంటిగ్రేషన్",
        desc: "5-రోజుల ఖచ్చితమైన వాతావరణ అంచనాలను అందించడానికి గ్లోబల్ వెదర్ శాటిలైట్‌లతో నిజ-సమయ సమకాలీకరణ.",
      },
      pipeline2: {
        title: "మార్కెట్ ధర సమకాలీకరణ",
        desc: "రైతులు తాజా ధరలను చూసేలా ప్రభుత్వ APMC పోర్టల్‌ల నుండి రోజువారీ అప్‌డేట్‌లు.",
      },
      pipeline3: {
        title: "జియోస్పేషియల్ ట్యాగింగ్",
        desc: "ఖచ్చితమైన పంట సరిపోలిక కోసం ఫార్మ్ స్థానాలను స్థానికీకరించిన నేల పటాలకు మ్యాపింగ్ చేయడం.",
      },
      verified: {
        title: "ధృవీకరించబడిన ఖచ్చితత్వం",
        desc: "గ్రౌండ్-రియాలిటీ ఖచ్చితత్వాన్ని నిర్ధారించడానికి మా నమూనాలు వ్యవసాయ పరిశోధకులతో క్రాస్-రిఫరెన్స్ చేయబడ్డాయి.",
        accuracy: "ఖచ్చితత్వ రేటు",
        mandis: "మండీలు ట్రాక్ చేయబడ్డాయి",
        updates: "రియల్ టైమ్",
      },
      data: {
        location: "లూధియానా, పంజాబ్",
        wheat: "గోధుమ",
        acres: "ఎకరాలు",
        growth: "వృద్ధి",
        vsYesterday: "నిన్నటితో పోలిస్తే",
        today: "ఈరోజు",
      },
      footer: "హోమ్‌పేజీకి తిరిగి వెళ్ళు",
    },
    roles: {
      farmer: "కస్టమర్",
      business: "వ్యాపారి / మండి",
      salesman: "సేల్స్ మ్యాన్",
      admin: "అడ్మిన్",
    },
    signIn: {
      farmer: {
        title: "కస్టమర్ లాగిన్",
        subtitle: "మీ ఫారమ్ విశ్లేషణ మరియు పంట సిఫార్సులను యాక్సెస్ చేయండి.",
      },
      business: {
        title: "వ్యాపారి లాగిన్",
        subtitle: "మండి కార్యకలాపాలు మరియు టోకు వ్యాపారాలను నిర్వహించండి.",
      },
      salesman: {
        title: "సేల్స్ మ్యాన్ లాగిన్",
        subtitle: "లీడ్స్, ఒప్పందాలు మరియు సేకరణలను నిర్వహించండి.",
      },
      admin: {
        title: "అడ్మిన్ కన్సోల్",
        subtitle:
          "సిస్టమ్ ఆరోగ్యాన్ని పర్యవేక్షించండి మరియు ప్లాట్‌ఫారమ్ డేటాను ధృవీకరించండి.",
      },
      backToHome: "హోమ్‌కు తిరిగి వెళ్ళు",
      emailPhone: "ఈమెయిల్ లేదా ఫోన్ నంబర్",
      password: "పాస్‌వర్డ్",
      forgotPassword: "పాస్‌వర్డ్ మరిచిపోయారా?",
      rememberMe: "30 రోజుల పాటు గుర్తుంచుకో",
      submit: "సైన్ ఇన్",
      noAccount: "ఖాతా లేదా?",
      createAccount: "ఖాతాను సృష్టించండి",
    },
    adminDashboard: {
      panel: "అడ్మిన్ ప్యానెల్",
      sidebar: {
        dashboard: "డ్యాష్‌బోర్డ్",
        users: "వినియోగదారులు",
        verifications: "ధృవీకరణలు",
        orders: "ఇటీవలి ఆర్డర్లు",
        logs: "లాగ్స్",
      },
      header: {
        title: "సిస్టమ్ అవలోకనం",
        subtitle: "ప్లేట్‌ఫారమ్ ఆరోగ్యం మరియు ధృవీకరణల పర్యవేక్షణ.",
        logout: "లాగ్ అవుట్",
      },
      stats: {
        farmers: "ధృవీకరించబడిన కస్టమర్లు",
        companies: "క్రియాశీల సేల్స్ మ్యాన్లు",
        pending: "పెండింగ్ పత్రాలు",
        uptime: "సిస్టమ్ అప్‌టైమ్",
      },
      alerts: {
        title: "సిస్టమ్ హెచ్చరికలు",
        latency: "పంజాబ్ ప్రాంతంలో పంట సిఫార్సు ఇంజిన్ ఆలస్యం ఎక్కువగా ఉంది.",
        unauthorized:
          "API ఎండ్‌పాయింట్‌లో అనధికారిక లాగిన్ ప్రయత్నం గుర్తించబడింది.",
      },
      queue: {
        title: "ధృవీకరణ వరుస",
        search: "కస్టమర్ కోసం వెతకండి...",
        name: "పేరు",
        region: "ప్రాంతం",
        doc: "పత్రం రకం",
        status: "స్థితి",
        actions: "చర్యలు",
        review: "సమీక్షించండి",
        pending: "పెండింగ్",
        inReview: "సమీక్షలో ఉంది",
      },
    },
    businessDashboard: {
      vault: "సేల్స్ వాల్ట్",
      sidebar: {
        overview: "అవలోకనం",
        post: "ఒప్పందాన్ని పోస్ట్ చేయండి",
        projections: "అంచనాలు",
        procurement: "సేకరణ",
        messages: "సందేశాలు",
      },
      header: {
        title: "సేల్స్ మ్యాన్ డాష్‌బోర్డ్",
        subtitle: "సోర్సింగ్ & సేకరణ కేంద్రం",
        logout: "లాగ్ అవుట్",
      },
      stats: {
        live: "లైవ్",
        committed: "అంగీకరించిన సేకరణ",
        onboarded: "ధృవీకరించబడిన కస్టమర్లు చేరారు",
        disbursed: "మొత్తం పంపిణీ (అడ్వాన్స్)",
      },
      actions: {
        post: "కొత్త ఒప్పంద ఆఫర్‌ను పోస్ట్ చేయండి",
        desc: "ML అంతర్దృష్టులను ఉపయోగించి నిర్దిష్ట ప్రాంతాలు మరియు పంట రకాలను లక్ష్యంగా చేసుకుంటుంది.",
      },
      offers: { title: "క్రియాశీల ఒప్పంద ఆఫర్లు", fulfilled: "పూర్తయింది" },
    },
    collaborationPortal: {
      title: "సహకార పోర్టల్",
      subtitle:
        "సేల్స్ మ్యాన్ భాగస్వాములు మరియు ఆహార ప్రాసెసింగ్ యూనిట్ల నుండి కాంట్రాక్ట్ ఆఫర్‌లను సమీక్షించండి.",
      contractor: "కాంట్రాక్టర్",
      crop: "పంట",
      price: "ధర",
      perQuintal: "క్వింటాల్‌కి",
      duration: "వ్యవధి",
      actions: "చర్యలు",
      accept: "అంగీకరించు",
      reject: "తిరస్కరించు",
      details: "వివరాలను చూడు",
      noContracts: "పెండింగ్‌లో ఉన్న ఒప్పందాలు ఏవీ లేవు.",
      success: "ఒప్పందం విజయవంతంగా అంగీకరించబడింది!",
      rejected: "ఆఫర్ తిరస్కరించబడింది.",
    },
    dashboard: {
      title: "కస్టమర్ డాష్‌బోర్డ్",
      subtitle:
        "తిరిగి స్వాగతం, రామ్ సింగ్. మీ పొలంలో ఏమి జరుగుతుందో ఇక్కడ చూడండి.",
      stats: {
        land: "మొత్తం భూమి",
        crop: "ప్రస్తుత పంట",
        moisture: "నేల తేమ",
        value: "మార్కెట్ విలువ",
      },
      weather: {
        title: "వాతావరణం & కార్యకలాపాలు",
        temp: "ఉష్ణోగ్రత",
        humidity: "తేమ",
        wind: "గాలి",
        rain: "వర్షం",
        sunny: "ఎండగా",
        moderate: "మితంగా",
        north: "ఉత్తరం",
        nextDays: "తదుపరి 3 రోజులు",
      },
      insight: {
        title: "తీవ్రమైన హెచ్చరికలు",
        desc: "సోమవారం నాడు అధిక తేమ మరియు రాత్రి ఉష్ణోగ్రతలలో తగ్గుదల అంచనా వేయబడింది. బంగాళాదుంప పంటలలో లేట్ బ్లైట్ ప్రమాదం.",
        preventionTitle: "లేట్ బ్లైట్ నివారణ చర్యలు",
        step1:
          "ఉష్ణోగ్రతలు తగ్గుతాయని అంచనా వేసినందున, దానికి ముందే మాంకోజెబ్ లేదా క్లోరోథలోనిల్ ఉన్న రక్షిత శిలీంద్రనాశకాలను పిచికారీ చేయండి.",
        step2:
          "బంగాళాదుంప మొక్కల చుట్టూ నీరు నిల్వ ఉండకుండా తగిన మురుగునీటి పారుదల ఉండేలా చూసుకోండి.",
        step3:
          "వ్యాధికారక వ్యాప్తిని అరికట్టడానికి వ్యాధి సోకిన ఆకులను వెంటనే తొలగించి నాశనం చేయండి.",
      },
      activities: {
        title: "ఇటీవలి కార్యకలాపాలు",
        item1: {
          title: "మార్కెట్ ధర హెచ్చరిక",
          desc: "లూధియానా మండీలో గోధుమ ధరలు 5% పెరిగాయి.",
          time: "2 గంటల క్రితం",
        },
        item2: {
          title: "నేల పరీక్ష పూర్తయింది",
          desc: "సెక్షన్ బిలో ఎన్పీకే స్థాయిలు సరైనవి.",
          time: "5 గంటల క్రితం",
        },
        item3: {
          title: "ప్రభుత్వ పథకం సిఫార్సు",
          desc: "మీరు పీఎం-కిసాన్ సబ్సిడీకి అర్హులు.",
          time: "1 రోజు క్రితం",
        },
      },
      collaboration: {
        title: "సహకారం",
        desc: "పెప్సికో మరియు ఐటీసీ ఈ-చౌపాల్ నుండి మీకు 2 పెండింగ్ కాంట్రాక్ట్ ఆఫర్‌లు ఉన్నాయి.",
        button: "కాంట్రాక్టులను సమీక్షించండి",
      },
      farmProfile: {
        title: "ఫార్మ్ ప్రొఫైల్",
        holding: "మొత్తం హోల్డింగ్",
        location: "ప్రస్తుత ప్రాంతం",
        profit: "మొత్తం సీజన్ లాభం",
        borewell: "బోర్వెల్ స్థితి",
        borewellVal: "క్రియాశీలం",
        soilType: "నేల రకం",
        soilVal: "ఒండ్రు మట్టి (లోమీ)",
      },
    },
    crops: {
      title: "పంట నిర్వహణ",
      subtitle: "మీ క్రియాశీల పంట చక్రాలను పర్యవేక్షించండి మరియు నిర్వహించండి.",
      addBtn: "కొత్త పంటను జోడించండి",
      activeTitle: "క్రియాశీల పంటలు",
      planted: "నాటిన తేదీ",
      stage: "పెరుగుదల దశ",
      health: "ఆరోగ్య సూచిక",
      waterNeed: "నీటి అవసరం",
      viewDetails: "వివరాలు చూడండి",
      history: "గత కోత చరిత్ర",
      table: {
        type: "పంట రకం",
        season: "సీజన్",
        yield: "దిగుబడి",
        profit: "నికర లాభం",
        status: "స్థితి",
        completed: "పూర్తయింది",
      },
    },
    market: {
      title: "మార్కెట్ ధరలు",
      subtitle: "ప్రపంచ మరియు స్థానిక భారతీయ మార్కెట్ల నుండి నిజ-సమయ డేటా.",
      searchPlaceholder: "పంట లేదా మార్కెట్ కోసం వెతకండి...",
      mandiTitle: "భారతీయ మండీ ధరలు",
      today: "ఈ రోజు",
      yesterday: "నిన్న",
      table: {
        crop: "పంట",
        mandi: "మార్కెట్ (మండీ)",
        price: "ధర (క్వింటాల్‌కి)",
        trend: "ధోరణి",
      },
      global: {
        title: "ప్రపంచ సూచికలు",
        analysis: "విశ్లేషణ",
        analysisDesc:
          "ముడి చమురు ధరల పెరుగుదల వచ్చే నెలలో ఖరీఫ్ పంటల రవాణా ఖర్చులను పెంచవచ్చు.",
      },
      export: {
        title: "ఎగుమతి అవకాశాలు",
        desc: "మెనా (MENA) ప్రాంతాల్లో భారతీయ బాస్మతీ బియ్యానికి అధిక డిమాండ్. హామీ ఇవ్వబడిన బై-బ్యాక్ ఒప్పందాలు అందుబాటులో ఉన్నాయి.",
        button: "ఎగుమతి భాగస్వాములను చూడండి",
      },
    },
    data: {
      wheat: "గోధుమ",
      basmati: "బాస్మతీ బియ్యం",
      mustard: "ఆవాలు",
      cotton: "పత్తి",
      soybean: "సోయాబీన్",
      maize: "మొక్కజొన్న",
      location: "లూధియానా, పంజాబ్",
      karnal: "కర్నాల్, హర్యానా",
      jaipur: "జైపూర్, రాజస్థాన్",
      nagpur: "నాగపూర్, మహారాష్ట్ర",
      indore: "ఇండోర్, ఎంపీ",
      acres: "ఎకరాలు",
      growth: "పెరుగుదల",
      vsYesterday: "నిన్నటితో పోలిస్తే",
      today: "నేడు",
      quintals: "క్వింటాళ్లు",
      lakhs: "లక్షలు",
    },
    profile: {
      title: "కస్టమర్ ప్రొఫైల్",
      editBtn: "ప్రొఫైల్‌ను సవరించు",
      id: "ID",
      editModal: {
        title: "మీ ప్రొఫైల్‌ను సవరించుకోండి",
        name: "పూర్తి పేరు",
        phone: "ఫోన్ నంబర్",
        location: "ఫార్మ్ స్థానం",
        landSize: "భూమి పరిమాణం (ఎకరాలు)",
        soil: "ప్రాతమిక నేల",
        cancel: "రద్దు చేయి",
        save: "మార్పులను సేవ్ చేయి",
      },
      resources: {
        title: "భూమి & వనరులు",
        holding: "మొత్తం భూమి",
        soilType: "నేల రకం",
        water: "ప్రాథమిక నీటి వనరు",
        location: "భూమి స్థానం",
        lat: "అక్షాంశం",
        lng: "రేఖాంశం",
        profit: "గత సంవత్సరం లాభం",
        functional: "పని చేస్తోంది",
        borewell: "సొంత బోరు బావి",
      },
      documents: {
        title: "ధృవీకరించబడిన పత్రాలు",
        aadhar: "ఆధార్ కార్డు (ధృవీకరణ)",
        land: "భూమి రికార్డు (ఖతౌనీ)",
        bank: "బ్యాంక్ పాస్‌బుక్",
        verified: "ధృవీకరించబడింది",
        pending: "సమీక్ష పెండింగ్‌లో ఉంది",
        updated: "న నవీకరించబడింది",
      },
      membership: {
        title: "సభ్యత్వం",
        partner: "FPO భాగస్వామి",
        since: "నుండి సభ్యుడు",
        points: "లాయల్టీ పాయింట్లు",
      },
      settings: {
        title: "త్వరిత సెట్టింగ్‌లు",
        notifications: "నోటిఫికేషన్ ప్రాధాన్యతలు",
        push: "పుష్ నోటిఫికేషన్లు",
        sms: "SMS హెచ్చరికలు",
        language: "ఇష్టమైన భాష",
        signout: "సైన్ అవుట్",
      },
      roles: {
        adminTitle: "సిస్టమ్ అడ్మినిస్ట్రేటర్",
        salesmanTitle: "సోర్సింగ్ మేనేజర్",
        adminLocation: "గ్లోబల్ కమాండ్ సెంటర్",
        salesmanLocation: "ప్రాంతీయ కార్యాలయం",
      },
      salesman: {
        purchases: "నిర్వహించబడిన కొనుగోళ్లు",
        fpos: "క్రియాశీల FPOలు",
        pending: "పెండింగ్ ఒప్పందాలు",
        value: "మొత్తం విలువ",
        activeFposTitle: "క్రియాశీల సోర్సింగ్ FPOలు",
        recentTitle: "ఇటీవలి కొనుగోలు కార్యకలాపాలు",
        fpoData: [
          {
            name: "లూథియానా గ్రైన్ కోఆపరేటివ్",
            type: "గోధుమ/బాస్మతీ",
            status: "సీజన్‌లో",
          },
          {
            name: "అమృతసర్ రైతు FPO",
            type: "బంగాళదుంప/చెరకు",
            status: "ముగింపు",
          },
          {
            name: "జలంధర్ కూరగాయల సంఘం",
            type: "సేంద్రీయ కూరగాయలు",
            status: "క్రియాశీలం",
          },
        ],
        logs: [
          {
            event: "ఒప్పందం ఖరారైంది",
            target: "M/S ITC ఈ-చౌపాల్",
            time: "2 గంటల క్రితం",
          },
          {
            event: "సోర్సింగ్ అలర్ట్",
            target: "పెసర పప్పులో ధర పెరుగుదల",
            time: "5 గంటల క్రితం",
          },
          {
            event: "ఆడిట్ పూర్తయింది",
            target: "సెక్షన్ సి సోర్సింగ్",
            time: "నిన్న",
          },
        ],
      },
      admin: {
        activeUsers: "క్రియాశీల వినియోగదారులు",
        uptime: "సిస్టమ్ అప్‌టైమ్",
        health: "సిస్టమ్ ఆరోగ్యం",
        security: "భద్రతా హెచ్చరికలు",
        oversight: "బహుళ-పాత్రల పర్యవేక్షణ",
        criticalLogs: "క్లిష్టమైన లాగ్స్",
        noLogs:
          "గడచిన 24 గంటల్లో ఎటువంటి క్లిష్టమైన సిస్టమ్ హెచ్చరికలు కనుగొనబడలేదు.",
        viewAll: "అన్ని ఆడిట్ లాగ్‌లను వీక్షించండి",
        clusters: {
          customer: "కస్టమర్ పోర్టల్",
          salesman: "సేల్స్‌మెన్ నెట్‌వర్క్",
          admin: "అడ్మిన్ కోర్",
        },
      },
    },
    sidebar: {
      menu: "మెనూ",
      dashboard: "డాష్‌బోర్డ్",
      analytics: "AI విశ్లేషణలు",
      crops: "పంట నిర్వహణ",
      residue: "అవశేషాలు & మేత",
      weather: "వాతావరణం",
      market: "మార్కెట్ ధరలు",
      profile: "ప్రొఫైల్",
      logout: "లాగ్ అవుట్",
    },
    weatherDetails: {
      title: "వాతావరణ సూచన",
      subtitle: "మీ ప్రాంతం కోసం ఖచ్చితమైన వ్యవసాయ వాతావరణ సమాచారం.",
      live: "లైవ్",
      lastUpdated: "చివరిగా అప్‌డేట్ చేయబడింది",
      forecast7Day: "7-రోజుల సూచన",
      tomorrow: "రేపు",
      sunday: "ఆదివారం",
      monday: "సోమవారం",
      tuesday: "మంగళవారం",
      wednesday: "బుధవారం",
      mostlySunny: "ఎక్కువగా ఎండగా",
      sunny: "ఎండగా",
      lightShowers: "తేలికపాటి జల్లులు",
      rainy: "వర్షం",
      partlyCloudy: "పాక్షికంగా మేఘావృతం",
      alerts: "తీవ్రమైన హెచ్చరికలు",
      alertDesc:
        "సోమవారం నాడు అధిక తేమ మరియు రాత్రి ఉష్ణోగ్రతలలో తగ్గుదల అంచనా వేయబడింది. బంగాళాదుంప పంటలలో లేట్ బ్లైట్ ప్రమాదం.",
      viewPrevention: "నివారణ చర్యలను చూడండి",
      advice: "విత్తే సలహా",
      adviceDesc:
        "నేల తేమ ప్రస్తుతం 42% ఉంది. ఈశాన్య భాగంలో పప్పుధాన్యాలను విత్తడానికి పరిస్థితులు అనుకూలంగా ఉన్నాయి. మా వన్-టు-వన్ పర్యావరణ వ్యవస్థలో మీ ప్రయాణాన్ని కొనసాగించండి.",
      optimalTemp: "సరైన నేల ఉష్ణోగ్రత: 18-24°C",
      nextIrrigation: "తదుపరి నీటి పారుదల: 3 రోజులు",
    },
    analytics: {
      title: "AI ఇన్సైట్స్ పోర్టల్",
      subtitle:
        "మీ పొలం ఉత్పాదకతను పెంచడానికి, దిగుబడిని అంచనా వేయడానికి మరియు మార్కెట్ డిమాండ్‌ను లెక్కించడానికి అధునాతన మెషిన్ లెర్నింగ్ మోడళ్లను ఉపయోగించండి.",
      stats: {
        accuracy: "అంచనా ఖచ్చితత్వం",
        roi: "అంచనా వేసిన ROI",
        usage: "విశ్లేషణ వినియోగం",
        credits: "ఉచిత క్రెడిట్స్ మిగిలి ఉన్నాయి",
        activeModels: "క్రియాశీల మోడల్స్",
        basedOn: "స్మార్ట్ రికమెండేషన్ ఆధారంగా",
      },
      comingSoon: "మాడ్యూల్ త్వరలో వస్తుంది",
      training: "దిగుబడి మల్టీ-వేరియేట్ రిగ్రెషన్ మోడల్ శిక్షణ పొందుతోంది...",
      historyTitle: "చారిత్రక దిగుబడి ధోరణులు",
      coreModules: "కోర్ ML మాడ్యూల్స్",
      cropRec: "పంట సిఫార్సు",
      yieldPred: "దిగుబడి అంచనా",
      pestDet: "కీటకాల గుర్తింపు",
      demandFore: "డిమాండ్ అంచనా",
      optimalSelection: "సరైన ఎంపిక",
      betaPhase: "బీటా దశ",
      trainingModel: "ట్రైనింగ్ మోడల్",
      uploadDesc: "రోగ నిర్ధారణ కోసం చిత్రాలను అప్‌లోడ్ చేయండి.",
      dragDrop: "పొలం ఫోటోను ఇక్కడ లాగండి లేదా వదలండి",
    },
    residue: {
      title: "పంట వ్యర్థాల నిర్వహణ",
      subtitle: "వ్యవసాయ వ్యర్థాలను అధిక-విలువైన పశుగ్రాసంగా మార్చడం.",
      methods: {
        physical: {
          title: "భౌతిక చికిత్స",
          desc: "కోయడం, గ్రైండింగ్ మరియు పెల్లెటింగ్ వంటి యాంత్రిక ప్రక్రియలు.",
          impact:
            "మేత వినియోగాన్ని 15-20% పెంచుతుంది మరియు వృధాను తగ్గిస్తుంది.",
        },
        chemical: {
          title: "రసాయన చికిత్స",
          desc: "యూరియా లేదా అమ్మోనియా చికిత్సను ఉపయోగించి పోషకాలను పెంచడం.",
          impact:
            "ముడి ప్రోటీన్ కంటెంట్‌ను పెంచుతుంది మరియు లిగ్నిన్ జీర్ణక్రియను మెరుగుపరుస్తుంది.",
        },
        biological: {
          title: "జీవ చికిత్స",
          desc: "వ్యర్థాలను పులియబెట్టడానికి స్నేహపూర్వక శిలీంద్రాలు లేదా సూక్ష్మజీవులను ఉపయోగించడం.",
          impact:
            "మెరుగైన శక్తి శోషణ కోసం సెల్యులోజ్‌ను వేగంగా విచ్ఛిన్నం చేస్తుంది.",
        },
        fortification: {
          title: "పోషక పెంపుదల",
          desc: "మొలాసిస్, ఖనిజాలు లేదా బైపాస్ ప్రోటీన్‌తో కలపడం.",
          impact:
            "అధిక దిగుబడి ఇచ్చే పశువుల కోసం పూర్తి సమతుల్య రేషన్‌ను సృష్టిస్తుంది.",
        },
      },
      benefitLabel: "ప్రయోజనం",
      dashboardTitle: "వ్యర్థాల వినియోగ డాష్‌బోర్డ్",
      processNow: "ఇప్పుడే ప్రాసెస్ చేయండి",
      addFortification: "పెంపుదల జోడించండి",
      whyTitle: "వ్యర్థాలను ఎందుకు నిర్వహించాలి?",
      whyItems: [
        "పర్యావరణ కాలుష్యాన్ని తగ్గిస్తుంది (తగులబెట్టకుండా నిరోధిస్తుంది)",
        "పశువుల కోసం తక్కువ ఖర్చుతో కూడిన మేతను అందిస్తుంది",
        "పొలం యొక్క స్థిరత్వాన్ని పెంచుతుంది",
        "రైతులకు అదనపు ఆదాయ వనరు",
      ],
      challengesTitle: "కీలక సవాళ్లు",
      challenges: {
        nutritional: {
          title: "పోషకాహార అసమతుల్యత",
          desc: "మేతగా వేసే ముందు చికిత్స/పెంపుదల చేయాలి.",
        },
        logistics: {
          title: "లాజిస్టిక్స్ & నిల్వ",
          desc: "భారీ వ్యర్థాలు చాలా స్థలాన్ని ఆక్రమిస్తాయి.",
        },
        awareness: {
          title: "అవగాహన లోపం",
          desc: "అమలు కోసం ప్రత్యేక శిక్షణ అవసరం.",
        },
      },
      industrialTitle: "పారిశ్రామిక సామర్థ్యం",
      industrialDesc:
        "అదనపు వ్యవసాయ వ్యర్థాలను విక్రయించడానికి లేదా అధిక-విలువైన ఫీడ్‌గా ప్రాసెస్ చేయడానికి స్థానిక బయో-రిఫైనరీలతో కనెక్ట్ అవ్వండి.",
      findPartners: "సమీప భాగస్వాములను కనుగొనండి",
      partnersModal: {
        title: "సమీప ప్రాసెసింగ్ భాగస్వాములు",
        subtitle:
          "మీ పంట వ్యర్థాలను విక్రయించడానికి స్థానిక బయో-రిఫైనరీలు మరియు ఫీడ్ ప్రాసెసింగ్ యూనిట్లతో కనెక్ట్ అవ్వండి.",
        distance: "కి.మీ దూరం",
        connect: "కనెక్ట్ అవ్వండి",
        close: "మూసివేయు",
        partner1: {
          name: "పంజాబ్ బయో-ఎనర్జీ కార్ప్",
          type: "బయో-రిఫైనరీ",
          accepts: "గోధుమ పొట్టు, వరి పొట్టు ఆమోదిస్తుంది",
        },
        partner2: {
          name: "లూధియానా అగ్రి-ఫీడ్స్",
          type: "ఫీడ్ ప్రాసెసర్",
          accepts: "మొక్కజొన్న కాడలు, ఆవాల కాడలు ఆమోదిస్తుంది",
        },
        partner3: {
          name: "గ్రీన్ పవర్ డిస్టిలరీస్",
          type: "బ్రూవరీ",
          accepts: "చెరకు పిప్పి ఆమోదిస్తుంది",
        },
      },
    },
  },
};
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tObj: <T = Record<string, string>>(key: string) => T;
  translate: (text: string) => Promise<string>;
}
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [allTranslations] =
    useState<Record<Language, Record<string, unknown>>>(translationsData);
  const [language, setLanguageState] = useState<Language>("en");
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && ["en", "hi", "pa", "mr", "te", "gu"].includes(savedLang)) {
      setLanguageState(savedLang);
      void i18n.changeLanguage(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    void i18n.changeLanguage(lang);
  };
  // Helper function to get translation
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: Record<string, unknown> | unknown = allTranslations[language];
    for (const k of keys) {
      if (
        value &&
        typeof value === "object" &&
        value !== null &&
        k in (value as Record<string, unknown>)
      ) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
        // Fallback to key if not found
      }
    }
    return typeof value === "string" ? value : key;
  };
  // Helper function to get translation object
  const tObj = <T = Record<string, string>,>(key: string): T => {
    const keys = key.split(".");
    let value: unknown = allTranslations[language];
    for (const k of keys) {
      if (
        value &&
        typeof value === "object" &&
        value !== null &&
        k in (value as Record<string, unknown>)
      ) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return {} as T;
      }
    }
    return value as T;
  };
  // Helper function for dynamic translation
  const translate = async (text: string): Promise<string> => {
    if (language === "en") return text;
    return translationService.translateText(text, language);
  };
  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, tObj, translate }}
    >
      {" "}
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
