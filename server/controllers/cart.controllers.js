import { Cart } from "../models/cart.model.js"
import { errorHandler } from "../utils/error.js"


export const getCartItems = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return next(errorHandler(404, 'Cart not found'));
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalCartItems = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.status(200).json({
      success: true,
      cart: {
        ...cart.toObject(),
        totalPrice, // Include calculated totalPrice
        totalCartItems
      },
    });
  } catch (error) {
    next(error);
  }
};

//add existing and update
export const updateCartItem = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { productId, name, price, quantity, color, size, image, action } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If the cart does not exist, create a new one
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
    if (existingItem) {
      if (action === "replace") {
        // Replace quantity with the new quantity
        existingItem.quantity = quantity;
      } else {
        // Default: Increment quantity
        existingItem.quantity += quantity;
      }
    } else {
      // Add a new item to the cart
      cart.items.push({ productId, name, price, quantity, color, size, image });
    }

    await cart.save();

    // Calculate total price
    const totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    res.status(200).json({
      success: true,
      cart: {
        ...cart.toObject(),
        totalPrice, // Include calculated totalPrice
      },
    });
  } catch (error) {
    next(error);
  }
};





export const removeCartItem = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return next(errorHandler(404, 'Cart not found'));
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    // Calculate total price
    const totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    res.status(200).json({
      success: true,
      cart: {
        ...cart.toObject(),
        totalPrice, // Include calculated totalPrice
      },
    });
  } catch (error) {
    next(error);
  }
};


export const clearCartItems = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return next(errorHandler(404, 'Cart not found'));
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      cart: {
        ...cart.toObject(),
        totalPrice: 0, // Total price is 0 when the cart is empty
      },
    });
  } catch (error) {
    next(error);
  }
};

