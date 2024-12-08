import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { clearCartItems, getCartItems, removeCartItem, updateCartItem } from '../controllers/cart.controllers.js';

const router = express.Router();

// Fetch the cart for a specific user
router.get('/getCartItems/:userId', getCartItems)

// Add or update an item in the user's cart
router.post('/updateCartItem/:userId', updateCartItem)

// Remove a specific item by productId.
router.delete('/removeCartItem/:userId/:productId', removeCartItem)


// Remove all items from the cart for a specific user.
router.delete('/clearCartItems/:userId', clearCartItems)



export default router;