import { Router } from "express";
import { addService, editService, getAllServices, removeService } from "../controllers/barberService.controller";

const router = Router();

router.get("/", getAllServices)
router.post("/", addService)
router.delete("/:id", removeService)
router.patch("/:id", editService)

export default router