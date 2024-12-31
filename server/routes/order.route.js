import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createOrder, getAllOrders, getMonthlyOrderAndSalesData, getOrders, updateOrder } from '../controllers/order.controllers.js';

const router = express.Router();
// for creating a new order
router.post('/create-order', createOrder)

// for getting all orders
router.get('/getAllOrders', getAllOrders)

//for getting monthly order and sales data
router.get('/getMonthlyOrderAndSalesData', verifyToken, getMonthlyOrderAndSalesData)

// for getting all orders of a user
router.get('/getOrders/:userId', getOrders)
//
router.put('/updateOrder/:orderId/:userId', verifyToken, updateOrder)

// router.delete('/deleteproduct/:productId/:userId', verifyToken, deleteProduct)




export default router;