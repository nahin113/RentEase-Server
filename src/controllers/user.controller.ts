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

    // Update user profile
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