// import mongoose, { Schema, Document } from 'mongoose';

// export interface IFlat extends Document {
//     title: string;
//     desc: string;
//     fullDescription: string;
//     price: number;
//     priceMin?: number;
//     priceMax?: number;
//     location: string;
//     neighborhood: "Rupnagar Abashik" | "itb-bandung" | "coblong" | "all-city";
//     neighborhoodLabel: string;
//     type: "Private Room" | "Entire Flat" | "Shared Co-Living";
//     targetAudience: "bachelor" | "family";
//     amenities: string[];
//     image: string;
//     status: "available" | "rented" | "pending";
//     landlordId: mongoose.Types.ObjectId;
//     createdAt: Date;
//     updatedAt: Date;
// }

// const FlatSchema = new Schema<IFlat>(
//     {
//         title: {
//             type: String,
//             required: [true, 'Title is required'],
//             trim: true
//         },
//         desc: {
//             type: String,
//             required: [true, 'Short summary description is required'],
//             trim: true
//         },
//         fullDescription: {
//             type: String,
//             required: [true, 'Full description is required'],
//             trim: true
//         },
//         price: {
//             type: Number,
//             required: [true, 'Price is required']
//         },
//         priceMin: {
//             type: Number
//         },
//         priceMax: {
//             type: Number
//         },
//         location: {
//             type: String,
//             required: [true, 'Location is required'],
//             trim: true
//         },
//         neighborhood: {
//             type: String,
//             enum: ["Rupnagar Abashik", "itb-bandung", "coblong", "all-city"],
//             required: [true, 'Neighborhood is required']
//         },
//         neighborhoodLabel: {
//             type: String,
//             required: [true, 'Neighborhood label is required'],
//             trim: true
//         },
//         type: {
//             type: String,
//             enum: ["Private Room", "Entire Flat", "Shared Co-Living"],
//             required: [true, 'Property type is required']
//         },
//         targetAudience: {
//             type: String,
//             enum: ["bachelor", "family"],
//             required: [true, 'Target audience is required']
//         },
//         amenities: {
//             type: [String],
//             default: []
//         },
//         image: {
//             type: String,
//             required: [true, 'Image URL is required']
//         },
//         status: {
//             type: String,
//             enum: ["available", "rented", "pending"],
//             default: "available"
//         },
//         landlordId: {
//             type: Schema.Types.ObjectId,
//             ref: 'User',
//             required: [true, 'Landlord ID is required']
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// // Indexes
// FlatSchema.index({ landlordId: 1 });
// FlatSchema.index({ status: 1 });
// FlatSchema.index({ price: 1 });

// export const Flat = mongoose.model<IFlat>('Flat', FlatSchema, 'flat');

import mongoose, { Schema, Document } from 'mongoose';

export interface IFlat extends Document {
    title: string;
    desc: string;
    fullDescription: string;
    price: number;
    priceMin?: number;
    priceMax?: number;
    location: string;
    neighborhood: "Rupnagar Abashik" | "itb-bandung" | "coblong" | "all-city";
    neighborhoodLabel: string;
    type: "Private Room" | "Entire Flat" | "Shared Co-Living";
    targetAudience: "bachelor" | "family";
    amenities: string[];
    image: string;
    images?: string[];
    status: "available" | "rented" | "pending";
    landlordId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const FlatSchema = new Schema<IFlat>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true
        },
        desc: {
            type: String,
            required: [true, 'Short summary description is required'],
            trim: true
        },
        fullDescription: {
            type: String,
            required: [true, 'Full description is required'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Price is required']
        },
        priceMin: {
            type: Number
        },
        priceMax: {
            type: Number
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true
        },
        neighborhood: {
            type: String,
            enum: ["Rupnagar Abashik", "itb-bandung", "coblong", "all-city"],
            required: [true, 'Neighborhood is required']
        },
        neighborhoodLabel: {
            type: String,
            required: [true, 'Neighborhood label is required'],
            trim: true
        },
        type: {
            type: String,
            enum: ["Private Room", "Entire Flat", "Shared Co-Living"],
            required: [true, 'Property type is required']
        },
        targetAudience: {
            type: String,
            enum: ["bachelor", "family"],
            required: [true, 'Target audience is required']
        },
        amenities: {
            type: [String],
            default: []
        },
        image: {
            type: String,
            required: [true, 'Primary image URL is required']
        },
        images: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: ["available", "rented", "pending"],
            default: "available"
        },
        landlordId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Landlord ID is required']
        }
    },
    {
        timestamps: true
    }
);

// Indexes
FlatSchema.index({ landlordId: 1 });
FlatSchema.index({ status: 1 });
FlatSchema.index({ price: 1 });

export const Flat = mongoose.model<IFlat>('Flat', FlatSchema, 'flat');