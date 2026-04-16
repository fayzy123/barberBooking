import { Router } from "express";
import { retrieveBookings } from "../controllers/booking.controller";

const router = Router();

router.get('/', retrieveBookings)

export default router;