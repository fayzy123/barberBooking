import { Router } from 'express';
import { addStaff, editShift, editStaff, retrieveAllStaff, retrieveStaffById } from '../controllers/staff.controller';

const router = Router();

router.get('/', retrieveAllStaff)
router.get('/:id', retrieveStaffById)
router.post('/', addStaff)
router.patch('/:id', editStaff)
router.patch('/:id/shifts', editShift)

export default router