import { Router } from 'express';
import { addStaff, editStaff, retrieveAllStaff, retrieveStaffById } from '../controllers/staff.controller';

const router = Router();

router.get('/', retrieveAllStaff)
router.get('/:id', retrieveStaffById)
router.post('/', addStaff)
router.patch('/:id', editStaff)

export default router