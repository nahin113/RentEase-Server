import mongoose, { Schema, Document } from 'mongoose';

// TypeScript Interface
export interface IUser extends Document {
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    role: 'user' | 'admin' | 'moderator';
    banned: boolean;
    accountType: 'student' | 'professional' | 'other';
    bio?: string;
    skills: string[];
    phoneNumber?: string;
    university?: string;
    department?: string;
    academicYear?: string;
    targetMoveInDate?: Date;
    leaseDuration?: string;
    budgetRange?: {
        min: number;
        max: number;
    };
    preferredNeighborhoods?: string[];
    roomType?: string;
    lifestyleHabits?: {
        cleanliness?: string;
        sleepSchedule?: string;
        guestPolicy?: string;
        diet?: string;
        smoking?: string;
        pets?: string;
    };
    roommateBio?: string;
    socialLinks?: {
        facebook?: string;
        instagram?: string;
    };
    profileCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose Schema
const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        image: {
            type: String,
            default: 'https://i.ibb.co/7tSrQNBP/Gemini-Generated-Image-p9hr7up9hr7up9hr.png'
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'moderator'],
            default: 'user'
        },
        banned: {
            type: Boolean,
            default: false
        },
        accountType: {
            type: String,
            enum: ['student', 'professional', 'other'],
            default: 'student'
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
            default: ''
        },
        skills: {
            type: [String],
            default: []
        },
        phoneNumber: {
            type: String,
            default: ''
        },
        university: {
            type: String,
            default: ''
        },
        department: {
            type: String,
            default: ''
        },
        academicYear: {
            type: String,
            default: ''
        },
        targetMoveInDate: {
            type: Date
        },
        leaseDuration: {
            type: String,
            default: ''
        },
        budgetRange: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 }
        },
        preferredNeighborhoods: {
            type: [String],
            default: []
        },
        roomType: {
            type: String,
            default: ''
        },
        lifestyleHabits: {
            cleanliness: { type: String, default: '' },
            sleepSchedule: { type: String, default: '' },
            guestPolicy: { type: String, default: '' },
            diet: { type: String, default: '' },
            smoking: { type: String, default: '' },
            pets: { type: String, default: '' }
        },
        roommateBio: {
            type: String,
            default: ''
        },
        socialLinks: {
            facebook: { type: String, default: '' },
            instagram: { type: String, default: '' }
        },
        profileCompleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true // auto adds createdAt & updatedAt
    }
);

// Index for faster queries
// UserSchema.index({ email: 1 }); // unique index already
UserSchema.index({ role: 1, banned: 1 });
UserSchema.index({ skills: 1 });

// Virtual property
UserSchema.virtual('isActive').get(function() {
    return !this.banned && this.emailVerified;
});

// Instance method
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.__v; // remove version key
    return user;
};

export const User = mongoose.model<IUser>('User', UserSchema, 'user');