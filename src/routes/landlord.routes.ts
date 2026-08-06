import { Router } from 'express';
import { LandlordController } from '../controllers/landlord.controller.js';
// import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply authentication middleware to all landlord endpoints
// router.use(authMiddleware);

// Statistics
router.get('/stats', LandlordController.getLandlordStats);

// Properties CRUD
router.get('/properties', LandlordController.getLandlordProperties);
router.post('/properties', LandlordController.createProperty);
router.put('/properties/:id', LandlordController.updateProperty);
router.delete('/properties/:id', LandlordController.deleteProperty);

// Applications
router.get('/applications', LandlordController.getLandlordApplications);
router.patch('/applications/:id', LandlordController.updateApplicationStatus);

export default router;
