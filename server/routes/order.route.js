import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createOrder } from '../controllers/order.controllers.js';

const router = express.Router();

router.post('/create-order', createOrder)

// router.get('/getproducts', getProducts)

// router.delete('/deleteproduct/:productId/:userId', verifyToken, deleteProduct)

// router.put('/updateproduct/:productId/:userId', verifyToken, updateProduct)



export default router;