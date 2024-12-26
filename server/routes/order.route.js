import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createOrder, getOrders } from '../controllers/order.controllers.js';

const router = express.Router();

router.post('/create-order', createOrder)

router.get('/getOrders/:userId', getOrders)

// router.delete('/deleteproduct/:productId/:userId', verifyToken, deleteProduct)

// router.put('/updateproduct/:productId/:userId', verifyToken, updateProduct)



export default router;