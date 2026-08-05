import { User } from '../models/user.models.js';
import { calculateMatchScore } from '../utils/match-calculator.js';
import { asyncHandler } from '../utils/async-handler.js';
import { APIError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';

export const RoommateController = {
  getRoommates: asyncHandler(async (req: any, res: any) => {
    const { id } = req.params;
    const currentUser = await User.findById(id);
    if (!currentUser) throw new APIError(401, 'Unauthorized', []);

    const candidates = await User.find({ accountType: 'renter', banned: false });
    
    const results = candidates.map(candidate => {
      const matchResult = calculateMatchScore(currentUser, candidate);
      return {
        ...candidate.toJSON(),
        matchScore: matchResult.matchScore,
        matchBreakdown: matchResult.breakdown,
        isBasicProfile: matchResult.isBasicProfile
      };
    }).filter(candidate => candidate._id.toString() !== currentUser._id.toString());
    
    results.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json(new ApiResponse(200, results, 'Roommates retrieved successfully'));
  }),

  getRoommateById: asyncHandler(async (req: any, res: any) => {
    console.log(req.params)
    const { current,target } = req.params;
    console.log(current,target)
    const currentUser = await User.findById(current);
    if (!currentUser) throw new APIError(401, 'Unauthorized', []);

    const targetUser = await User.findById(target);

    // console.log(currentUser,targetUser)
    if (!targetUser) throw new APIError(404, 'User not found', []);
    
    if ((targetUser.accountType as string) === 'landlord' || (targetUser.accountType as string) === 'admin') {
      throw new APIError(404, 'User not found', []);
    }

    const matchResult = calculateMatchScore(currentUser, targetUser);
    
    const result = {
      ...targetUser.toJSON(),
      matchScore: matchResult.matchScore,
      matchBreakdown: matchResult.breakdown,
      isBasicProfile: matchResult.isBasicProfile
    };

    res.status(200).json(new ApiResponse(200, result, 'Roommate retrieved successfully'));
  })
};
