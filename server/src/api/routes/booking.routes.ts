import { Router } from "express";
import { cancelBooking, createBooking, reassignStaff, retrieveBookingById, retrieveBookings } from "../controllers/booking.controller";

const router = Router();

router.get('/', retrieveBookings)
router.get('/:id', retrieveBookingById)
router.post('/', createBooking)
router.patch('/:id/cancel', cancelBooking)
router.patch('/:id/reassign', reassignStaff)

export default router;