import { Router } from 'express';
import { editShop, retrieveShop } from '../controllers/shop.controller';

const router = Router()

router.get('/', retrieveShop)
router.patch('/', editShop)

export default router