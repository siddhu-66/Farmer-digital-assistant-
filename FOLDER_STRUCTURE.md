# 📁 PROJECT FOLDER STRUCTURE - ORGANIZED

## 🗂️ **FRONTEND FOLDERS**

### **Core Structure:**
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/           # Auth routes group
│   │   │   ├── signin/
│   │   │   └── register/
│   │   ├── farmer/           # Farmer-specific pages
│   │   │   ├── dashboard/
│   │   │   ├── listings/
│   │   │   └── profile/
│   │   ├── admin/            # Admin pages
│   │   │   ├── dashboard/
│   │   │   ├── verifications/
│   │   │   └── analytics/
│   │   ├── business/         # Business pages
│   │   │   ├── dashboard/
│   │   │   ├── market/
│   │   │   └── orders/
│   │   └── api/             # API routes
│   ├── components/            # Reusable components
│   │   ├── ui/              # Basic UI components
│   │   ├── layout/           # Layout components
│   │   ├── forms/            # Form components
│   │   └── charts/          # Chart components
│   ├── lib/                 # Utility libraries
│   ├── hooks/               # Custom React hooks
│   ├── store/               # State management
│   ├── types/               # TypeScript types
│   └── utils/               # Helper functions
├── public/                 # Static assets
├── docs/                   # Documentation
└── tests/                  # Test files
```

### **Current Frontend Files to Organize:**
- ✅ `src/app/` - Already organized
- ✅ `src/components/` - Already exists
- ✅ `src/lib/` - Already exists
- ✅ `src/utils/` - Need to create
- ✅ `src/hooks/` - Need to create
- ✅ `src/types/` - Need to create
- ✅ `src/store/` - Need to create

---

## 🗂️ **BACKEND FOLDERS**

### **Core Structure:**
```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js
│   │   ├── auth.js
│   │   └── external-apis.js
│   ├── controllers/         # Route controllers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── listing.controller.js
│   │   ├── bid.controller.js
│   │   ├── admin.controller.js
│   │   └── ml.controller.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── error.middleware.js
│   │   └── logging.middleware.js
│   ├── models/              # Database models
│   │   ├── User.model.js
│   │   ├── Farmer.model.js
│   │   ├── Business.model.js
│   │   ├── Listing.model.js
│   │   ├── Bid.model.js
│   │   ├── Order.model.js
│   │   ├── Notification.model.js
│   │   └── AuditLog.model.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── listing.routes.js
│   │   ├── bid.routes.js
│   │   ├── admin.routes.js
│   │   └── ml.routes.js
│   ├── services/            # Business logic
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── listing.service.js
│   │   ├── notification.service.js
│   │   ├── external-api.service.js
│   │   └── ml.service.js
│   ├── utils/               # Helper functions
│   │   ├── logger.js
│   │   ├── validator.js
│   │   ├── helpers.js
│   │   └── constants.js
│   └── tests/               # Test files
│       ├── unit/
│       ├── integration/
│       └── e2e/
├── ml-models/              # ML model files
│   ├── crop-recommendation.py
│   ├── price-prediction.py
│   └── disease-detection.py
├── docs/                   # Documentation
│   ├── api.md
│   └── deployment.md
├── uploads/                # File uploads
├── .env.example           # Environment template
├── package.json           # Dependencies
├── server.js              # Server entry point
└── app.js                # Express app
```

### **Current Backend Files to Organize:**
- ✅ `config/` - Already exists
- ✅ `controllers/` - Already exists
- ✅ `middleware/` - Already exists
- ✅ `models/` - Already exists
- ✅ `routes/` - Already exists
- ✅ `services/` - Already exists
- ✅ `utils/` - Already exists
- ✅ `tests/` - Already exists

---

## 🗂️ **ROUTES LIST**

### **Current Routes:**
```
/api/
├── auth/
│   ├── POST /register
│   ├── POST /login
│   ├── POST /refresh
│   └── POST /logout
├── farmer/
│   ├── POST /register
│   ├── GET /status
│   ├── GET /all
│   ├── PUT /:id
│   ├── POST /:id/update
│   ├── DELETE /:id
│   └── GET /sell-requests
├── business/
│   ├── POST /register
│   ├── GET /status
│   ├── GET /verified-farmer-listings
│   └── GET /all
├── admin/
│   ├── GET /analytics
│   ├── GET /pending-verifications
│   ├── GET /users
│   ├── POST /verify-user
│   ├── POST /moderate-listing
│   └── GET /transactions
├── listings/
│   ├── GET / (all listings)
│   ├── POST / (create listing)
│   ├── GET /:id
│   ├── PUT /:id
│   └── DELETE /:id
├── bids/
│   ├── POST / (place bid)
│   ├── GET /my-bids
│   └── GET /:id
├── orders/
│   ├── GET / (get orders)
│   ├── POST / (create order)
│   ├── PUT /:id
│   └── GET /:id
├── schemes/
│   ├── GET / (get schemes)
│   ├── POST / (create scheme)
│   └── GET /:id
└── crops/
    └── POST /predict (ML prediction)
```

---

## 🗂️ **MODELS LIST**

### **Current Models:**
```
models/
├── User.js                 # User base model
├── Farmer.js              # Farmer profile
├── Business.js             # Business profile
├── Listing.js             # Product listings
├── Bid.js                 # Bids on listings
├── Order.js               # Orders/transactions
└── SellRequest.js         # Sell requests
```

### **Models to Add:**
```
models/
├── Notification.js        # Notifications system
├── AuditLog.js           # Activity logging
├── Weather.js            # Weather data cache
├── MarketPrice.js        # Market price cache
├── CropRecommendation.js  # ML recommendations
└── DiseaseDetection.js    # Disease detection results
```

---

## 🗂️ **ML FILES LIST**

### **Current ML Structure:**
```
ml-service/                 # Already exists
├── app.py                 # Flask app
├── requirements.txt        # Dependencies
└── crop_prediction.py     # Basic prediction

ml-server/                 # Already exists
├── server.py              # ML server
└── predict.py            # Prediction logic
```

### **ML Files to Organize:**
```
ml-models/
├── crop-recommendation/
│   ├── train.py           # Training script
│   ├── predict.py         # Prediction API
│   ├── models/            # Saved models
│   └── data/             # Training data
├── price-prediction/
│   ├── train.py
│   ├── predict.py
│   ├── models/
│   └── data/
├── disease-detection/
│   ├── train.py
│   ├── predict.py
│   ├── models/
│   └── data/
├── utils/
│   ├── data_preprocessing.py
│   ├── model_utils.py
│   └── api_utils.py
└── app.py                # Main Flask app
```

---

## 🎯 **ORGANIZATION ACTIONS NEEDED**

### **Frontend:**
1. Create `src/utils/` folder
2. Create `src/hooks/` folder
3. Create `src/types/` folder
4. Create `src/store/` folder
5. Organize `src/components/` into subfolders

### **Backend:**
1. Reorganize `controllers/` with proper naming
2. Reorganize `routes/` with proper naming
3. Add missing model files
4. Create proper `services/` structure
5. Organize `utils/` with proper files

### **ML:**
1. Merge `ml-service/` and `ml-server/`
2. Create `ml-models/` with structure
3. Add training scripts
4. Add model files
5. Add data preprocessing

---

## 🚀 **NEXT STEPS**

1. **Create missing frontend folders**
2. **Reorganize backend structure**
3. **Consolidate ML services**
4. **Add missing model files**
5. **Create proper documentation**
6. **Update imports and references**

This organization will make your project:
- ✅ **More maintainable**
- ✅ **Easier to understand**
- ✅ **Better for collaboration**
- ✅ **Placement-ready**
- ✅ **Production-ready**
