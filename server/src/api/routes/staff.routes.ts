import { Router } from 'express';
import { addStaff, editShift, editStaff, removeStaff, retrieveAllStaff, retrieveStaffById } from '../controllers/staff.controller';

const router = Router();

router.get('/', retrieveAllStaff)
router.get('/:id', retrieveStaffById)
router.delete('/:id', removeStaff)
router.post('/', addStaff)
router.patch('/:id', editStaff)
router.patch('/:id/shifts', editShift)

export default router