import { Router } from "express";
import { retrieveBookingById, retrieveBookings } from "../controllers/booking.controller";

const router = Router();

router.get('/', retrieveBookings)
router.get('/:id', retrieveBookingById)

export default router;