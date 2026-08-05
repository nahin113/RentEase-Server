import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Public / General routes
router.get('/users', UserController.getUsers);

// Current User profile routes (Must be registered BEFORE /users/:id to avoid conflict)
router.get('/users/me/:id', UserController.getCurrentUser);
router.patch('/users/profile', UserController.updateProfile);

// Parameter routes
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);

export default router;