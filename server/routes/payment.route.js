import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createPaymentIntent } from '../controllers/payment.controllers.js';

const router = express.Router();

// Initiate Payment
router.post('/create-payment-intent', createPaymentIntent)

// router.get('/getproducts', getProducts)

// router.delete('/deleteproduct/:productId/:userId', verifyToken, deleteProduct)

// router.put('/updateproduct/:productId/:userId', verifyToken, updateProduct)



export default router;