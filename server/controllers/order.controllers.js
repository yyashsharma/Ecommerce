
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import { stripe } from "../index.js";
import { Cart } from "../models/cart.model.js";

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

        // Clear the cart for the user
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = []; // Clear all items
            await cart.save();
        }

        // Get the created order ID
        const createdOrderID = savedUser.orders[savedUser.orders.length - 1];

        if (paymentMethod === 'Cash') {
            // Update payment status for Cash on Delivery
            const orderIndex = user.orders.findIndex(order => order._id.toString() === createdOrderID._id.toString());

            if (orderIndex !== -1) {
                user.orders[orderIndex].paymentStatus = "cashOnDelivery";
                await user.save();
            }

            // Update stock for each product in the order
            for (const item of products) {
                const product = await Product.findById(item.productId);
                if (!product) continue; // Skip if product is not found

                // Ensure stock does not go negative
                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Insufficient stock for product: ${product.name}`,
                    });
                }

                product.stock -= item.quantity; // Deduct the quantity
                await product.save();
                console.log(product.stock)
            }

            // Redirect to success page with order ID for cash payment
            return res.status(200).json({
                message: 'Order created successfully',
                redirectUrl: `${process.env.CLIENT_URL}/order-placed/success?order_id=${createdOrderID._id}`,
            });
        }

        // Initiate Stripe Payment
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
            cancel_url: `${process.env.CLIENT_URL}/payment/cancel?order_id=${createdOrderID._id}`,
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

export const getOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find the user
        const user = await User.findById(userId).select('orders'); // Fetch only the orders field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Filter orders by paymentStatus
        const filteredOrders = user.orders.filter(order =>
            order.paymentStatus === 'cashOnDelivery' || order.paymentStatus === 'paid'
        ).sort((a, b) => b.orderDate - a.orderDate); // Sort by orderDate in descending orders

        res.status(200).json({ orders: filteredOrders });
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



export const getAllOrders = async (req, res) => {
    try {
        // Fetch all users with their orders populated
        const users = await User.find({}, "username email orders")
            .populate({
                path: "orders.products.productId",
                select: "name price image", // Adjust fields based on your Product schema
            });

        const allOrders = users.map((user) => ({
            userId: user._id,
            username: user.username,
            email: user.email,
            orders: user.orders,
        }));

        res.status(200).json({
            success: true,
            message: "All orders fetched successfully",
            data: allOrders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching orders",
            error: error.message,
        });
    }
};





