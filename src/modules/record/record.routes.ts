import { Router } from 'express';
import * as recordController from './record.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { createRecordSchema, updateRecordSchema, listRecordsQuerySchema } from './record.schema.js';

const router = Router();

// All record routes require authentication
router.use(authenticate);

// Read access for all authenticated roles
router.get('/', validate(listRecordsQuerySchema, 'query'), recordController.listRecords);
router.get('/:id', recordController.getRecord);

// Write access for ADMIN only
router.post('/', requireRole('ADMIN'), validate(createRecordSchema), recordController.createRecord);
router.patch('/:id', requireRole('ADMIN'), validate(updateRecordSchema), recordController.updateRecord);
router.delete('/:id', requireRole('ADMIN'), recordController.deleteRecord);

export default router;
