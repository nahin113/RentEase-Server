import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = Router();

router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);

export default router;