import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import recordRoutes from '../modules/record/record.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/records', recordRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
