// import { Request, Response } from 'express';
// import { Flat } from '../models/flat.models.js';
// import { Application } from '../models/application.models.js';
// import { asyncHandler } from '../utils/async-handler.js';
// import { ApiResponse } from '../utils/api-response.js';
// import { APIError } from '../utils/api-error.js';
// import mongoose from 'mongoose';

// export class LandlordController {
  
//   // 1. Get stats overview
//   static getLandlordStats = asyncHandler(async (req: Request, res: Response) => {
//     const landlordId = (req as any).user?.id;
//     if (!landlordId) {
//       throw new APIError(401, 'Unauthorized access', []);
//     }

//     const landlordObjectId = new mongoose.Types.ObjectId(landlordId);

//     // Run aggregations/queries in parallel
//     const [totalProperties, rentedProperties, activeApplications] = await Promise.all([
//       Flat.countDocuments({ landlordId: landlordObjectId }),
//       Flat.countDocuments({ landlordId: landlordObjectId, status: 'rented' }),
//       Application.countDocuments({ landlordId: landlordObjectId, status: 'pending' })
//     ]);

//     // Calculate estimated revenue (sum of price of rented flats)
//     const revenueAggregation = await Flat.aggregate([
//       { $match: { landlordId: landlordObjectId, status: 'rented' } },
//       { $group: { _id: null, totalRevenue: { $sum: '$price' } } }
//     ]);
//     const estimatedRevenue = revenueAggregation[0]?.totalRevenue || 0;

//     // Monthly listing and views data mock/simulation (for Recharts)
//     // In a real production system, this might query an analytics collection, 
//     // but returning a structured baseline here ensures the frontend graphs render beautifully immediately.
//     const monthlyViews = [
//       { month: 'Jan', views: 120, inquiries: 8 },
//       { month: 'Feb', views: 180, inquiries: 15 },
//       { month: 'Mar', views: 240, inquiries: 18 },
//       { month: 'Apr', views: 310, inquiries: 22 },
//       { month: 'May', views: 450, inquiries: 30 },
//       { month: 'Jun', views: 520, inquiries: 42 },
//       { month: 'Jul', views: 600, inquiries: 55 }
//     ];

//     const occupancyTrend = [
//       { name: 'Rented', value: rentedProperties },
//       { name: 'Available', value: totalProperties - rentedProperties }
//     ];

//     const stats = {
//       totalProperties,
//       rentedProperties,
//       activeApplications,
//       estimatedRevenue,
//       monthlyViews,
//       occupancyTrend
//     };

//     return res.status(200).json(
//       new ApiResponse(200, stats, 'Landlord statistics fetched successfully')
//     );
//   });

//   // 2. Get landlord's properties
//   static getLandlordProperties = asyncHandler(async (req: Request, res: Response) => {
//     const landlordId = (req as any).user?.id;
//     if (!landlordId) {
//       throw new APIError(401, 'Unauthorized access', []);
//     }

//     const properties = await Flat.find({ landlordId }).sort({ createdAt: -1 });

//     return res.status(200).json(
//       new ApiResponse(200, properties, 'Properties retrieved successfully')
//     );
//   });

//   // 3. Create a new property
//   static createProperty = asyncHandler(async (req: Request, res: Response) => {
//     const landlordId = (req as any).user?.id;
//     if (!landlordId) {
//       throw new APIError(401, 'Unauthorized access', []);
//     }

//     const {
//       title,
//       desc,
//       fullDescription,
//       price,
//       priceMin,
//       priceMax,
//       location,
//       neighborhood,
//       neighborhoodLabel,
//       type,
//       targetAudience,
//       amenities,
//       image
//     } = req.body;

//     if (!title || !desc || !fullDescription || !price || !location || !neighborhood || !neighborhoodLabel || !type || !targetAudience || !image) {
//       throw new APIError(400, 'All required fields must be provided', []);
//     }

//     const flat = await Flat.create({
//       title,
//       desc,
//       fullDescription,
//       price,
//       priceMin,
//       priceMax,
//       location,
//       neighborhood,
//       neighborhoodLabel,
//       type,
//       targetAudience,
//       amenities: amenities || [],
//       image,
//       status: 'available',
//       landlordId
//     });

//     return res.status(201).json(
//       new ApiResponse(201, flat, 'Property created successfully')
//     );
//   });

//   // 4. Update property details or status
//   static updateProperty = asyncHandler(async (req: Request, res: Response) => {
//     const landlordId = (req as any).user?.id;
//     const { id } = req.params;

//     if (!landlordId) {
//       throw new APIError(401, 'Unauthorized access', []);
//     }

//     const flat = await Flat.findOne({ _id: id, landlordId });
//     if (!flat) {
//       throw new APIError(404, 'Property not found or access denied', []);
//     }

//     const updateFields = [
//       'title', 'desc', 'fullDescription', 'price', 'priceMin', 
//       'priceMax', 'location', 'neighborhood', 'neighborhoodLabel', 
//       'type', 'targetAudience', 'amenities', 'image', 'status'
//     ];

//     updateFields.forEach(field => {
//       if (req.body[field] !== undefined) {
//         (flat as any)[field] = req.body[field];
//       }
//     });

//     await flat.save();

//     return res.status(200).json(
//       new ApiResponse(200, flat, 'Property updated successfully')
//     );
//   });

//   // 5. Delete property
//   static deleteProperty = asyncHandler(async (req: Request, res: Response) => {
//     const landlordId = (req as any).user?.id;
//     const { id } = req.params;

//     if (!landlordId) {
//       throw new APIError(401, 'Unauthorized access', []);
//     }

//     const flat = await Flat.findOneAndDelete({ _id: id, landlordId });
//     if (!flat) {
//       throw new APIError(404, 'Property not found or access denied', []);
//     }

//     // Optionally delete associated applications too
//     await Application.deleteMany({ flatId: id });

//     return res.status(200).json(
//       new ApiResponse(200, null, 'Property deleted successfully')
//     );
//   });

//   // 6. Get landlord properties' applications
//   static getLandlordApplications = asyncHandler(async (req: Request, res: Response) => {
//     const landlordId = (req as any).user?.id;
//     if (!landlordId) {
//       throw new APIError(401, 'Unauthorized access', []);
//     }

//     // Retrieve and populate applications
//     const applications = await Application.find({ landlordId })
//       .populate('studentId', 'name image email')
//       .populate('flatId', 'title')
//       .sort({ createdAt: -1 });

//     return res.status(200).json(
//       new ApiResponse(200, applications, 'Applications retrieved successfully')
//     );
//   });

//   // 7. Update status of application
//   static updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
//     const landlordId = (req as any).user?.id;
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!landlordId) {
//       throw new APIError(401, 'Unauthorized access', []);
//     }

//     if (!['accepted', 'denied'].includes(status)) {
//       throw new APIError(400, 'Invalid status value. Must be accepted or denied.', []);
//     }

//     const application = await Application.findOne({ _id: id, landlordId });
//     if (!application) {
//       throw new APIError(404, 'Application not found or access denied', []);
//     }

//     application.status = status;
//     await application.save();

//     // If accepted, we can optionally mark the property status as pending or rented if desired.
//     // For this specification, we just update application status.

//     return res.status(200).json(
//       new ApiResponse(200, application, `Application status updated to ${status}`)
//     );
//   });
// }


import { Request, Response } from 'express';
import { Flat } from '../models/flat.models.js';
import { Application } from '../models/application.models.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiResponse } from '../utils/api-response.js';
import { APIError } from '../utils/api-error.js';
import mongoose from 'mongoose';

// Helper to derive landlord ID without enforcing token verification
const getLandlordId = (req: Request): string => {
  return (
    (req as any).user?.id ||
    req.body?.landlordId ||
    (req.query?.landlordId as string) ||
    req.headers['x-landlord-id'] ||
    '650000000000000000000000' // Default fallback ID for unauthenticated dev usage
  );
};

export class LandlordController {
  
  // 1. Get stats overview
  static getLandlordStats = asyncHandler(async (req: Request, res: Response) => {
    const landlordId = getLandlordId(req);
    const landlordObjectId = mongoose.Types.ObjectId.isValid(landlordId) 
      ? new mongoose.Types.ObjectId(landlordId) 
      : null;

    const matchQuery = landlordObjectId ? { landlordId: landlordObjectId } : {};

    // Run aggregations/queries in parallel
    const [totalProperties, rentedProperties, activeApplications] = await Promise.all([
      Flat.countDocuments(matchQuery),
      Flat.countDocuments({ ...matchQuery, status: 'rented' }),
      Application.countDocuments({ ...(landlordObjectId ? { landlordId: landlordObjectId } : {}), status: 'pending' })
    ]);

    // Calculate estimated revenue (sum of price of rented flats)
    const revenueAggregation = await Flat.aggregate([
      { $match: { ...matchQuery, status: 'rented' } },
      { $group: { _id: null, totalRevenue: { $sum: '$price' } } }
    ]);
    const estimatedRevenue = revenueAggregation[0]?.totalRevenue || 0;

    const monthlyViews = [
      { month: 'Jan', views: 120, inquiries: 8 },
      { month: 'Feb', views: 180, inquiries: 15 },
      { month: 'Mar', views: 240, inquiries: 18 },
      { month: 'Apr', views: 310, inquiries: 22 },
      { month: 'May', views: 450, inquiries: 30 },
      { month: 'Jun', views: 520, inquiries: 42 },
      { month: 'Jul', views: 600, inquiries: 55 }
    ];

    const occupancyTrend = [
      { name: 'Rented', value: rentedProperties },
      { name: 'Available', value: Math.max(0, totalProperties - rentedProperties) }
    ];

    const stats = {
      totalProperties,
      rentedProperties,
      activeApplications,
      estimatedRevenue,
      monthlyViews,
      occupancyTrend
    };

    return res.status(200).json(
      new ApiResponse(200, stats, 'Landlord statistics fetched successfully')
    );
  });

  // 2. Get landlord's properties
  static getLandlordProperties = asyncHandler(async (req: Request, res: Response) => {
    const landlordId = getLandlordId(req);

    // Fetch properties matching landlordId (or all if omitted/empty)
    const filter = landlordId ? { landlordId } : {};
    const properties = await Flat.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, properties, 'Properties retrieved successfully')
    );
  });

  // 3. Create a new property
  static createProperty = asyncHandler(async (req: Request, res: Response) => {
    const landlordId = getLandlordId(req);

    const {
      title,
      desc,
      fullDescription,
      price,
      priceMin,
      priceMax,
      location,
      neighborhood,
      neighborhoodLabel,
      type,
      targetAudience,
      amenities,
      image,
      images
    } = req.body;

    if (!title || !desc || !fullDescription || !price || !location || !neighborhood || !neighborhoodLabel || !type || !targetAudience) {
      throw new APIError(400, 'All required fields must be provided', []);
    }

    const primaryImage = image || (images && images.length > 0 ? images[0] : '');

    const flat = await Flat.create({
      title,
      desc,
      fullDescription,
      price: Number(price),
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      location,
      neighborhood,
      neighborhoodLabel,
      type,
      targetAudience,
      amenities: amenities || [],
      image: primaryImage,
      images: images || (primaryImage ? [primaryImage] : []),
      status: 'available',
      landlordId
    });

    return res.status(201).json(
      new ApiResponse(201, flat, 'Property created successfully')
    );
  });

  // 4. Update property details or status
  static updateProperty = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const flat = await Flat.findById(id);
    if (!flat) {
      throw new APIError(404, 'Property not found', []);
    }

    const updateFields = [
      'title', 'desc', 'fullDescription', 'price', 'priceMin', 
      'priceMax', 'location', 'neighborhood', 'neighborhoodLabel', 
      'type', 'targetAudience', 'amenities', 'image', 'images', 'status'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        (flat as any)[field] = req.body[field];
      }
    });

    await flat.save();

    return res.status(200).json(
      new ApiResponse(200, flat, 'Property updated successfully')
    );
  });

  // 5. Delete property
  static deleteProperty = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const flat = await Flat.findByIdAndDelete(id);
    if (!flat) {
      throw new APIError(404, 'Property not found', []);
    }

    // Clean up associated applications
    await Application.deleteMany({ flatId: id });

    return res.status(200).json(
      new ApiResponse(200, null, 'Property deleted successfully')
    );
  });

  // 6. Get landlord properties' applications
  static getLandlordApplications = asyncHandler(async (req: Request, res: Response) => {
    const landlordId = getLandlordId(req);
    const filter = landlordId ? { landlordId } : {};

    const applications = await Application.find(filter)
      .populate('studentId', 'name image email')
      .populate('flatId', 'title')
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, applications, 'Applications retrieved successfully')
    );
  });

  // 7. Update status of application
  static updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'denied', 'pending'].includes(status)) {
      throw new APIError(400, 'Invalid status value. Must be accepted, denied, or pending.', []);
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('studentId', 'name image email')
      .populate('flatId', 'title');

    if (!application) {
      throw new APIError(404, 'Application not found', []);
    }

    return res.status(200).json(
      new ApiResponse(200, application, `Application status updated to ${status}`)
    );
  });
}