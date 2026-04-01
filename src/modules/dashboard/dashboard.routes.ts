import { Router } from 'express';
import * as dashboardController from './dashboard.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// All dashboard routes require authentication (any role can view)
router.use(authenticate);

router.get('/summary', dashboardController.getSummary);
router.get('/category-summary', dashboardController.getCategorySummary);
router.get('/trends', dashboardController.getMonthlyTrends);
router.get('/recent', dashboardController.getRecentActivity);

export default router;
