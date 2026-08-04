import { Request, Response } from 'express';
import { User } from '../models/user.models.js';
import { ApiResponse } from '../utils/api-response.js';
import { APIError } from '../utils/api-error.js';


export class UserController {
    // Get all users with filters
    static async getUsers(req: Request, res: Response) {
        try {
            const { role, accountType, skill, search } = req.query;
            
            const filter: any = {};
            if (role) filter.role = role;
            if (accountType) filter.accountType = accountType;
            if (skill) filter.skills = { $in: [skill] };
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            
            const users = await User.find(filter)
                .select('-__v')
                .limit(20)
                .sort({ createdAt: -1 });
            
            res.status(200).json(
                new ApiResponse(200, users, 'Users fetched successfully')
            );
        } catch (error) {
            throw new APIError(500, 'Failed to fetch users',[],"");
        }
    }

    // Get current authenticated user
    static async getCurrentUser(req: Request, res: Response) {
        try {
            let userId = (req as any).user?.id;
            if (!userId) {
                // Mock user for testing without auth token
                const mockUser = await User.findOne();
                if (mockUser) userId = mockUser._id.toString();
                else throw new APIError(401, 'Unauthorized request (No users in DB to mock)', []);
            }

            const user = await User.findById(userId).select('-__v');
            if (!user) {
                throw new APIError(404, 'User not found', []);
            }

            res.status(200).json(
                new ApiResponse(200, user, 'Current user profile fetched successfully')
            );
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch current user'
            });
        }
    }

    // Get single user
    static async getUserById(req: Request, res: Response) {
        try {
            const user = await User.findById(req.params.id);
            
            if (!user) {
                throw new APIError(404, 'User not found',[],"");
            }
            
            res.status(200).json(
                new ApiResponse(200, user, 'User fetched successfully')
            );
        } catch (error) {
            throw error;
        }
    }

    // Update profile (authenticated renter)
    static async updateProfile(req: Request, res: Response) {
        try {
            let userId = (req as any).user?.id;
            if (!userId) {
                // Mock user for testing without auth token
                const mockUser = await User.findOne();
                if (mockUser) userId = mockUser._id.toString();
                else throw new APIError(401, 'Unauthorized request (No users in DB to mock)', []);
            }

            const {
                phoneNumber,
                university,
                department,
                academicYear,
                targetMoveInDate,
                leaseDuration,
                budgetRange,
                preferredNeighborhoods,
                roomType,
                lifestyleHabits,
                roommateBio,
                socialLinks,
                bio
            } = req.body;

            // Fetch user first to apply changes and calculate completeness
            const user = await User.findById(userId);
            if (!user) {
                throw new APIError(404, 'User not found', []);
            }

            // Update fields
            if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
            if (university !== undefined) user.university = university;
            if (department !== undefined) user.department = department;
            if (academicYear !== undefined) user.academicYear = academicYear;
            if (targetMoveInDate !== undefined) user.targetMoveInDate = targetMoveInDate ? new Date(targetMoveInDate) : undefined;
            if (leaseDuration !== undefined) user.leaseDuration = leaseDuration;
            if (budgetRange !== undefined) {
                user.budgetRange = {
                    min: Number(budgetRange.min || 0),
                    max: Number(budgetRange.max || 0)
                };
            }
            if (preferredNeighborhoods !== undefined) user.preferredNeighborhoods = preferredNeighborhoods;
            if (roomType !== undefined) user.roomType = roomType;
            if (lifestyleHabits !== undefined) {
                user.lifestyleHabits = {
                    cleanliness: lifestyleHabits.cleanliness || '',
                    sleepSchedule: lifestyleHabits.sleepSchedule || '',
                    guestPolicy: lifestyleHabits.guestPolicy || '',
                    diet: lifestyleHabits.diet || '',
                    smoking: lifestyleHabits.smoking || '',
                    pets: lifestyleHabits.pets || ''
                };
            }
            if (roommateBio !== undefined) user.roommateBio = roommateBio;
            if (socialLinks !== undefined) {
                user.socialLinks = {
                    facebook: socialLinks.facebook || '',
                    instagram: socialLinks.instagram || ''
                };
            }
            if (bio !== undefined) user.bio = bio;

            // Calculate profile completeness
            const requiredFields = [
                user.phoneNumber,
                user.university,
                user.department,
                user.academicYear,
                user.targetMoveInDate,
                user.leaseDuration,
                user.roomType,
                user.roommateBio,
                user.budgetRange?.min,
                user.budgetRange?.max,
                user.lifestyleHabits?.cleanliness,
                user.lifestyleHabits?.sleepSchedule,
                user.lifestyleHabits?.guestPolicy,
                user.lifestyleHabits?.diet,
                user.lifestyleHabits?.smoking,
                user.lifestyleHabits?.pets,
            ];
            
            const hasNeighborhoods = Array.isArray(user.preferredNeighborhoods) && user.preferredNeighborhoods.length > 0;
            const hasSocials = !!(user.socialLinks?.facebook || user.socialLinks?.instagram);

            user.profileCompleted = requiredFields.every(field => field !== undefined && field !== null && field !== '') && hasNeighborhoods && hasSocials;

            await user.save();

            res.status(200).json(
                new ApiResponse(200, user, 'Profile updated successfully')
            );
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to update profile'
            });
        }
    }

    // Update user profile (general)
    static async updateUser(req: Request, res: Response) {
        try {
            const { name, bio, skills, accountType } = req.body;
            
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { name, bio, skills, accountType },
                { new: true, runValidators: true }
            );
            
            if (!user) {
                throw new APIError(404, 'User not found',[],"");
            }
            
            res.status(200).json(
                new ApiResponse(200, user, 'User updated successfully')
            );
        } catch (error) {
            throw error;
        }
    }
}