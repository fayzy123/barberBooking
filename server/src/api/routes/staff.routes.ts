import { Router } from 'express';
import { retrieveAllStaff, retrieveStaffById } from '../controllers/staff.controller';

const router = Router();

router.get('/', retrieveAllStaff)
router.get('/:id', retrieveStaffById)

export default router