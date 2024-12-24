
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import { stripe } from "../index.js"



export const handlePaymentSuccess = async (req, res) => {
    const { session_id, order_id } = req.body;

    try {
        // Verify the payment session with Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session.payment_status || session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment not successful." });
        }

        // Find the user and the corresponding order
        const user = await User.findOne({ "orders._id": order_id });
        if (!user) return res.status(404).json({ message: "Order not found" });

        const orderIndex = user.orders.findIndex(order => order._id.toString() === order_id);
        if (orderIndex === -1) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update payment status
        user.orders[orderIndex].paymentStatus = "paid";
        const order = user.orders[orderIndex];

        // Update stock for each product in the order
        for (const item of order.products) {
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
        }

        // Save user with updated order payment status
        await user.save();

        res.status(200).json({ message: "Payment successful, order updated, and stock adjusted." });
    } catch (error) {
        console.error("Error updating payment status and stock:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const handlePaymentFailed = async (req, res) => {
    const { orderId } = req.body;

    try {
        const user = await User.findOne({ "orders._id": orderId });
        if (!user) return res.status(404).json({ message: "Order not found" });

        const orderIndex = user.orders.findIndex(order => order._id.toString() === orderId);
        if (orderIndex !== -1) {
            user.orders[orderIndex].paymentStatus = "failed";
            await user.save();
        }

        res.status(200).json({ message: "Payment status updated to failed." });
    } catch (error) {
        console.error("Error updating payment status:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};