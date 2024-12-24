import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { handlePaymentFailed, handlePaymentSuccess } from '../controllers/payment.controllers.js';

const router = express.Router();



router.post('/handlePaymentSuccess', handlePaymentSuccess)

router.post('/handlePaymentFailed', handlePaymentFailed)




export default router;