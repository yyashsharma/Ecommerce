import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createProduct, getProducts, deleteProduct, updateProduct, getMonthlyProductData } from '../controllers/product.controllers.js';

const router = express.Router();

router.post('/create-product', verifyToken, createProduct)

router.get('/getproducts', getProducts)

router.get('/getMonthlyProductData', verifyToken, getMonthlyProductData)

router.delete('/deleteproduct/:productId/:userId', verifyToken, deleteProduct)

router.put('/updateproduct/:productId/:userId', verifyToken, updateProduct)





export default router;