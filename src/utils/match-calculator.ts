import { IUser } from '../models/user.models.js';

export interface MatchResult {
  matchScore: number;
  isBasicProfile: boolean;
  breakdown: {
    locationAndUniversity: number;
    budgetCompatibility: number;
    lifestyleHabits: number;
    housingPreference: number;
    softHabits: number;
  };
}

// export function calculateMatchScore(currentUser: Partial<IUser>, targetUser: Partial<IUser>): MatchResult {
//   // Exclusion Rule
//   if (
//     (targetUser.accountType as string) === 'admin' || 
//     (targetUser.accountType as string) === 'landlord' ||
//     targetUser.role === 'admin' ||
//     targetUser.role === 'moderator' || 
//     (currentUser._id && targetUser._id && targetUser._id.toString() === currentUser._id.toString())
//   ) {
//     return {
//       matchScore: 0,
//       isBasicProfile: false,
//       breakdown: { locationAndUniversity: 0, budgetCompatibility: 0, lifestyleHabits: 0, housingPreference: 0, softHabits: 0 }
//     };
//   }

//   // Incomplete Profile Fallback
//   if (currentUser.profileCompleted === false || targetUser.profileCompleted === false) {
//     return {
//       matchScore: 0,
//       isBasicProfile: true,
//       breakdown: { locationAndUniversity: 0, budgetCompatibility: 0, lifestyleHabits: 0, housingPreference: 0, softHabits: 0 }
//     };
//   }

//   let locationAndUniversity = 0;
//   if (currentUser.university && currentUser.university === targetUser.university) {
//     locationAndUniversity += 15;
//   }
//   if (currentUser.preferredNeighborhoods && targetUser.preferredNeighborhoods) {
//     const overlap = currentUser.preferredNeighborhoods.filter(n => targetUser.preferredNeighborhoods?.includes(n));
//     if (overlap.length > 0) locationAndUniversity += 15;
//   }

//   let budgetCompatibility = 0;
//   if (currentUser.budgetRange && targetUser.budgetRange) {
//     const { min: cMin, max: cMax } = currentUser.budgetRange;
//     const { min: tMin, max: tMax } = targetUser.budgetRange;
//     if (cMin <= tMax && tMin <= cMax) budgetCompatibility = 20;
//   }

//   let lifestyleHabits = 0;
//   if (currentUser.lifestyleHabits && targetUser.lifestyleHabits) {
//     const keys: (keyof typeof currentUser.lifestyleHabits)[] = ['cleanliness', 'sleepSchedule', 'guestPolicy', 'diet', 'smoking', 'pets'];
//     for (const key of keys) {
//       if (currentUser.lifestyleHabits[key] && currentUser.lifestyleHabits[key] === targetUser.lifestyleHabits[key]) {
//         lifestyleHabits += 5.8;
//       }
//     }
//   }

//   let housingPreference = 0;
//   if (currentUser.roomType && currentUser.roomType === targetUser.roomType) {
//     housingPreference = 10;
//   }

//   let softHabits = 0;
//   if (currentUser.habits && targetUser.habits) {
//     const overlap = currentUser.habits.filter(h => targetUser.habits?.includes(h));
//     if (overlap.length > 0) softHabits = 5;
//   }

//   const matchScore = Math.min(100, Math.round(locationAndUniversity + budgetCompatibility + lifestyleHabits + housingPreference + softHabits));

//   return {
//     matchScore,
//     isBasicProfile: false,
//     breakdown: { locationAndUniversity, budgetCompatibility, lifestyleHabits, housingPreference, softHabits }
//   };
// }


export function calculateMatchScore(currentUser: Partial<IUser>, targetUser: Partial<IUser>): MatchResult {
  // 1. Exclusion Rule (FIXED: compare currentUser._id against targetUser._id)
  const isSelfMatch = 
    currentUser?._id && 
    targetUser?._id && 
    currentUser._id.toString() === targetUser._id.toString();

  if (
    (targetUser.accountType as string) === 'admin' || 
    (targetUser.accountType as string) === 'landlord' ||
    targetUser.role === 'admin' ||
    targetUser.role === 'moderator' || 
    isSelfMatch
  ) {
    return {
      matchScore: 0,
      isBasicProfile: false,
      breakdown: { locationAndUniversity: 0, budgetCompatibility: 0, lifestyleHabits: 0, housingPreference: 0, softHabits: 0 }
    };
  }

  let earnedPoints = 0;
  let possiblePoints = 0;

  // 2. Location & University (30 pts max)
  let locationAndUniversity = 0;
  if (currentUser.university || targetUser.university) {
    possiblePoints += 15;
    if (currentUser.university && targetUser.university && currentUser.university.toLowerCase() === targetUser.university.toLowerCase()) {
      locationAndUniversity += 15;
    }
  }

  if ((currentUser.preferredNeighborhoods && currentUser.preferredNeighborhoods.length > 0) || 
      (targetUser.preferredNeighborhoods && targetUser.preferredNeighborhoods.length > 0)) {
    possiblePoints += 15;
    if (currentUser.preferredNeighborhoods?.length && targetUser.preferredNeighborhoods?.length) {
      const overlap = currentUser.preferredNeighborhoods.filter(n => targetUser.preferredNeighborhoods?.includes(n));
      if (overlap.length > 0) locationAndUniversity += 15;
    }
  }
  earnedPoints += locationAndUniversity;

  // 3. Budget Compatibility (20 pts max)
  let budgetCompatibility = 0;
  if (currentUser.budgetRange || targetUser.budgetRange) {
    possiblePoints += 20;
    if (currentUser.budgetRange && targetUser.budgetRange) {
      const { min: cMin, max: cMax } = currentUser.budgetRange;
      const { min: tMin, max: tMax } = targetUser.budgetRange;
      if (cMin <= tMax && tMin <= cMax) {
        budgetCompatibility = 20;
        earnedPoints += 20;
      }
    }
  }

  // 4. Lifestyle Habits (35 pts max -> ~5.83 pts per key)
  let lifestyleHabits = 0;
  if (currentUser.lifestyleHabits || targetUser.lifestyleHabits) {
    const keys: (keyof NonNullable<typeof currentUser.lifestyleHabits>)[] = [
      'cleanliness', 
      'sleepSchedule', 
      'guestPolicy', 
      'diet', 
      'smoking', 
      'pets'
    ];
    const ptsPerKey = 35 / keys.length;

    for (const key of keys) {
      const cVal = currentUser.lifestyleHabits?.[key];
      const tVal = targetUser.lifestyleHabits?.[key];

      if (cVal || tVal) {
        possiblePoints += ptsPerKey;
        if (cVal && tVal && cVal === tVal) {
          lifestyleHabits += ptsPerKey;
          earnedPoints += ptsPerKey;
        }
      }
    }
  }

  // 5. Housing Preference (10 pts max)
  let housingPreference = 0;
  if (currentUser.roomType || targetUser.roomType) {
    possiblePoints += 10;
    if (currentUser.roomType && targetUser.roomType && currentUser.roomType === targetUser.roomType) {
      housingPreference = 10;
      earnedPoints += 10;
    }
  }

  // 6. Soft Habits (5 pts max)
  let softHabits = 0;
  if ((currentUser.habits && currentUser.habits.length > 0) || (targetUser.habits && targetUser.habits.length > 0)) {
    possiblePoints += 5;
    if (currentUser.habits?.length && targetUser.habits?.length) {
      const overlap = currentUser.habits.filter(h => targetUser.habits?.includes(h));
      if (overlap.length > 0) {
        softHabits = 5;
        earnedPoints += 5;
      }
    }
  }

  const matchScore = possiblePoints > 0 
    ? Math.round((earnedPoints / possiblePoints) * 100) 
    : 50;

  const isBasic = !currentUser.profileCompleted || !targetUser.profileCompleted;

  return {
    matchScore: Math.min(100, matchScore),
    isBasicProfile: isBasic,
    breakdown: { 
      locationAndUniversity: Math.round(locationAndUniversity), 
      budgetCompatibility: Math.round(budgetCompatibility), 
      lifestyleHabits: Math.round(lifestyleHabits), 
      housingPreference: Math.round(housingPreference), 
      softHabits: Math.round(softHabits) 
    }
  };
}