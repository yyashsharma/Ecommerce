
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import { stripe } from "../index.js";

export const createOrder = async (req, res) => {
    try {
        const { userId, products, totalPrice, addressId, paymentMethod } = req.body;

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
        const savedUser = await user.save();

        // Get the created order ID
        const createdOrderID = savedUser.orders[savedUser.orders.length - 1];
        console.log("orderid", createdOrderID._id);  // Should now log the correct ID

        const redirectUrl= `${process.env.CLIENT_URL}/payment/success?order_id=${createdOrderID._id}`;
        console.log("redirectUrl",redirectUrl)

        if (paymentMethod === 'Cash') {
            // Redirect to success page with order ID for cash payment
            console.log(createdOrderID._id)
            return res.status(200).json({
                message: 'Order created successfully',
                redirectUrl: `${process.env.CLIENT_URL}/payment/success?order_id=${createdOrderID._id}`,
            });
        }

        // Initiate Stripe Payment
        // const lineItems = products.map((item) => ({
        //     price_data: {
        //         currency: 'usd',
        //         product_data: {
        //             name: `Product ID: ${item.productId}`, // Replace with actual product name if available
        //         },
        //         unit_amount: Math.round(( totalPrice / products.length) * 100), // Calculate price correctly
        //     },
        //     quantity: item.quantity,
        // }));
        const lineItems = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Order Total', // Represent the total price of the entire order
                    },
                    unit_amount: Math.round(totalPrice * 100), // Convert total price to cents
                },
                quantity: 1, // Quantity is 1 since it represents the whole order
            },
        ];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&order_id=${createdOrderID._id}`,
            cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
            metadata: {
                userId,
                orderId: createdOrderID._id.toString(),
            },
        });

        res.status(200).json({ url: session.url });


    } catch (error) {
        console.error('Error creating order:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

