const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB id');

const publicRoles = z.enum(['farmer', 'business', 'salesman']);

/** Strict empty query — rejects unexpected query parameters */
exports.emptyQuery = z.object({}).strict();

const locationSchema = z
  .object({
    state: z.string().max(120).optional(),
    district: z.string().max(120).optional(),
    village: z.string().max(120).optional(),
  })
  .optional();

exports.authRegisterBody = z.object({
  name: z.string().trim().min(1).max(200),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
  email: z.union([z.string().email().max(320), z.literal('')]).optional(),
  password: z.string().min(6).max(128),
  role: publicRoles,
});

exports.authLoginBody = z
  .object({
    email: z.string().email().max(320).optional(),
    identifier: z.string().min(3).max(320).optional(),
    mobile: z.string().regex(/^\d{10}$/).optional(),
    password: z.string().min(1).max(128),
  })
  .refine((d) => Boolean(d.email?.trim()) || Boolean(d.identifier?.trim()) || Boolean(d.mobile), {
    message: 'Provide email, identifier (email or phone), or 10-digit mobile',
    path: ['email'],
  });

exports.authVerifyOtpBody = z.object({
  mobile: z.string().regex(/^\d{10}$/),
  code: z.string().min(3).max(10),
});

exports.farmerRegisterBody = z.object({
  registrationData: z.object({
    landArea: z.union([z.string(), z.number()]).optional(),
    landType: z.string().max(100).optional(),
    irrigationType: z.string().max(100).optional(),
    location: z
      .object({
        village: z.string().max(120).optional(),
        district: z.string().max(120).optional(),
      })
      .optional(),
  }),
});

exports.farmerIdParams = z.object({
  id: z.string().min(1).max(64),
});

exports.farmerUpdateBody = z.object({
  landSize: z.union([z.string(), z.number()]).optional(),
  location: z.string().max(500).optional(),
});

exports.businessRegisterBody = z.object({
  businessData: z
    .object({
      companyName: z.string().max(200).optional(),
      gstNumber: z.string().max(32).optional(),
      address: z.string().max(500).optional(),
    })
    .passthrough(),
});

exports.orderCreateBody = z.object({
  customerName: z.string().trim().min(1).max(200),
  crop: z.string().trim().min(1).max(120),
  quantity: z.coerce.number().positive(),
  pricePerQtl: z.coerce.number().nonnegative().optional(),
  deliveryLocation: z.string().max(500).optional(),
  deliveryDate: z.coerce.date().optional().nullable(),
});

exports.orderUpdateStatusBody = z.object({
  orderId: objectId,
  status: z.enum(['Pending', 'Approved', 'Assigned', 'In Progress', 'Completed', 'Rejected']).optional(),
  rejectionReason: z.string().max(1000).optional(),
  adminNotes: z.string().max(2000).optional(),
});

exports.orderAssignFarmersBody = z.object({
  orderId: objectId,
  farmerIds: z.array(objectId).min(1),
});

exports.adminVerifyUserBody = z
  .object({
    userId: objectId,
    action: z.enum(['approve', 'reject']),
    rejectionReason: z.string().max(1000).optional(),
    roleType: z.enum(['farmer', 'business', 'salesman']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.action === 'reject' && (!data.rejectionReason || !String(data.rejectionReason).trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'rejectionReason is required when action is reject',
        path: ['rejectionReason'],
      });
    }
  });

exports.adminModerateListingBody = z.object({
  listingId: objectId,
  action: z.literal('delete'),
});

exports.listingCreateBody = z.object({
  crop: z.string().trim().min(1).max(120),
  variety: z.string().max(120).optional(),
  quantity: z.coerce.number().positive(),
  unit: z.string().max(20).optional(),
  pricePerUnit: z.coerce.number().positive(),
  qualityGrade: z.enum(['A+', 'A', 'B', 'C']).optional(),
  location: locationSchema,
  description: z.string().max(5000).optional(),
  images: z.array(z.string().max(1200)).max(20).optional(),
  expiryDate: z.coerce.date().optional(),
});

exports.listingIdParams = z.object({
  id: objectId,
});

exports.listingPatchBody = z.object({
  status: z.enum(['active', 'sold', 'expired', 'removed']),
});

exports.bidCreateBody = z.object({
  listingId: objectId,
  offeredPrice: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
  notes: z.string().max(2000).optional(),
});

exports.bidListingIdParams = z.object({
  listingId: objectId,
});

exports.bidIdParams = z.object({
  id: objectId,
});

exports.bidPatchBody = z.object({
  status: z.enum(['pending', 'accepted', 'rejected', 'cancelled', 'completed']),
});

exports.partnerNearbyQuery = z
  .object({
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    radiusKm: z.coerce.number().positive().max(500).optional(),
  })
  .strict();

exports.partnerCreateBody = z.object({
  name: z.string().trim().min(1).max(200),
  type: z.enum(['Bio-Refinery', 'Feed Processor', 'Power Plant', 'Other']).optional(),
  location: z.string().trim().min(1).max(500),
  distance: z.coerce.number().nonnegative().optional(),
  accepts: z.array(z.string().max(120)).max(50).optional(),
  contactPerson: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  email: z.union([z.string().email().max(320), z.literal('')]).optional(),
  active: z.boolean().optional(),
});

exports.schemeQuery = z
  .object({
    category: z.enum(['subsidy', 'insurance', 'loan', 'training', 'other']).optional(),
    state: z.string().max(120).optional(),
  })
  .strict();

exports.schemeCreateBody = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10000),
  eligibility: z.string().max(5000).optional(),
  benefits: z.string().max(5000).optional(),
  applyLink: z.union([z.string().url().max(2000), z.literal('')]).optional(),
  category: z.enum(['subsidy', 'insurance', 'loan', 'training', 'other']).optional(),
  state: z.string().max(120).optional(),
  active: z.boolean().optional(),
});

// ─── Sell Requests (Farmer → Admin → Business) ─────────────────────────────

const sellRequestStatusEnum = z.enum([
  'PENDING',
  'APPROVED_BY_ADMIN',
  'REJECTED_BY_ADMIN',
  'SENT_TO_BUSINESS',
  'ACCEPTED_BY_BUSINESS',
  'REJECTED_BY_BUSINESS',
  'COMPLETED',
]);

exports.sellRequestStatusEnum = sellRequestStatusEnum;

exports.sellRequestsQuery = z
  .object({
    status: sellRequestStatusEnum.optional(),
  })
  .strict();

exports.sellRequestIdParams = z.object({
  id: objectId,
});

exports.sellRequestCreateBody = z
  .object({
    cropName: z.string().trim().min(1).max(200),
    quantity: z.coerce.number().positive(),
    quantityUnit: z.enum(['kg', 'quintal', 'ton', 'bushel']).optional(),
    expectedPrice: z.coerce.number().nonnegative(),
    currency: z.string().max(10).optional(),
    location: z.string().trim().min(1).max(500),
    country: z.string().max(100).optional(),
    state: z.string().max(120).optional(),
    district: z.string().max(120).optional(),
    village: z.string().max(120).optional(),
    pincode: z.string().max(10).optional(),
    description: z.string().trim().max(5000).optional(),
    image: z.string().max(200000).optional(),
    cropGrade: z.enum(['A+', 'A', 'B', 'C']).optional(),
    season: z.string().max(100).optional(),
  })
  .strict();

exports.sellRequestAssignBody = z
  .object({
    assignedBusinessId: objectId,
    adminRemarks: z.string().trim().max(1000).optional(),
  })
  .strict();

exports.sellRequestRejectAdminBody = z
  .object({
    adminRemarks: z.string().trim().max(1000).optional(),
  })
  .strict();

// Used for both accept and reject by business.
exports.sellRequestBusinessActionBody = z
  .object({
    businessRemarks: z.string().trim().max(1000).optional(),
  })
  .strict();
