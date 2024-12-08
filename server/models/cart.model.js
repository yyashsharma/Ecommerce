import mongoose from "mongoose";

// Define the schema for cart items
const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }, // Price of the product at the time of addition
    quantity: { type: Number, required: true, min: 1 },
});

// Define the schema for the cart
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
});

// Export the Cart model
export const Cart = mongoose.model('Cart', cartSchema);



