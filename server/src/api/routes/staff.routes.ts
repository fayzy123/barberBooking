import { Router } from 'express';
import { addStaff, editAvailability, editStaff, retrieveAllStaff, retrieveStaffById } from '../controllers/staff.controller';

const router = Router();

router.get('/', retrieveAllStaff)
router.get('/:id', retrieveStaffById)
router.post('/', addStaff)
router.patch('/:id', editStaff)
router.patch('/:id/availability', editAvailability)

export default router