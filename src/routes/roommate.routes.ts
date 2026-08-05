import { Router } from 'express';
import { RoommateController } from '../controllers/roommate.controller.js';

const router = Router();

router.get('/roommates/:id', RoommateController.getRoommates);
router.get('/v1/:current/:target', RoommateController.getRoommateById);

export default router;
