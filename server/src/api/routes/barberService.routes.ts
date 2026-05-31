import { Router } from "express";
import { addService, editService, getAllServices } from "../controllers/barberService.controller";

const router = Router();

router.get("/", getAllServices)
router.post("/", addService)
router.patch("/:id", editService)

export default router