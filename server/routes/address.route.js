import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { clearCartItems, getCartItems, removeCartItem, updateCartItem } from '../controllers/cart.controllers.js';

const router = express.Router();

// Add a new address
router.post("addNewAddress/:userId",addNewAddress);

// Get all addresses for a user
router.get("getAllAddress/:userId",getAllAddress);

// Update an address
router.put("updateAddress/:userId/:addressId",updateAddress);

// Delete an address
router.delete("deleteAddress/:userId/:addressId",deleteAddress);

export default router;
