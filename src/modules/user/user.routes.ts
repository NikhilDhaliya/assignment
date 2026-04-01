import { Router } from 'express';
import * as userController from './user.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { createUserSchema, updateUserSchema, listUsersQuerySchema } from './user.schema.js';

const router = Router();

// All user management routes require ADMIN role
router.use(authenticate, requireRole('ADMIN'));

router.post('/', validate(createUserSchema), userController.createUser);
router.get('/', validate(listUsersQuerySchema, 'query'), userController.listUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', validate(updateUserSchema), userController.updateUser);

export default router;
