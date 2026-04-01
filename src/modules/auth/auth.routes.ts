import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authLimiter } from '../../middleware/rateLimit.middleware.js';
import { loginSchema } from './auth.schema.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;
