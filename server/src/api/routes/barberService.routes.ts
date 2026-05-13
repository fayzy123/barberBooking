import { Router } from "express";
import { getAllServices } from "../controllers/barberService.controller";

const router = Router();

router.get("/", getAllServices)

export default router