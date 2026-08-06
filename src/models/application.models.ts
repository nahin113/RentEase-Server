import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
    flatId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    landlordId: mongoose.Types.ObjectId;
    message?: string;
    moveInDate?: Date;
    status: "pending" | "accepted" | "denied";
    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
    {
        flatId: {
            type: Schema.Types.ObjectId,
            ref: 'Flat',
            required: [true, 'Flat ID is required']
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student ID is required']
        },
        landlordId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Landlord ID is required']
        },
        message: {
            type: String,
            default: ''
        },
        moveInDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "denied"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

// Indexes
ApplicationSchema.index({ landlordId: 1 });
ApplicationSchema.index({ studentId: 1 });
ApplicationSchema.index({ flatId: 1 });

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema, 'application');
