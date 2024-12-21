
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import { stripe } from "../index.js";

export const createOrder = async (req, res) => {
    try {
        const { userId, products, totalPrice, addressId, paymentMethod } = req.body;
        console.log(userId, products, totalPrice, addressId, paymentMethod)

        // Validate request data
        if (!userId || !products || !totalPrice || !addressId || !paymentMethod) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get selected address
        const address = user.addresses.id(addressId);
        if (!address) return res.status(404).json({ message: 'Address not found' });

        // Create a new order
        const newOrder = {
            products,
            totalPrice,
            paymentStatus: 'pending',
            orderDate: Date.now(),
        };

        // Add order to user's orders array
        user.orders.push(newOrder);
        await user.save();

        // Initiate Stripe Payment
        const lineItems = products.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `Product ID: ${item.productId}`, // Replace with actual product name if available
                },
                unit_amount: Math.round(totalPrice / products.length * 100), // Divide price equally (example logic)
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
            metadata: {
                userId
            },
        });

        res.status(200).json({ url: session.url });


    } catch (error) {
        console.error('Error creating order:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

