import { Router } from "express";
import { cancelBooking, createBooking, getAvailableSlots, reassignStaff, retrieveBookingById, retrieveBookings } from "../controllers/booking.controller";

const router = Router();

router.get('/', retrieveBookings)
router.get('/available-slots', getAvailableSlots)
router.get('/:id', retrieveBookingById)
router.post('/', createBooking)
router.patch('/:id/cancel', cancelBooking)
router.patch('/:id/reassign', reassignStaff)

export default router;