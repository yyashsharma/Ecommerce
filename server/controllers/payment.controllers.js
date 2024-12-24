
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import { stripe } from "../index.js"



export const handlePaymentSuccess = async (req, res) => {
    const { session_id, order_id } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session.payment_status || session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment not successful." });
        }

        const user = await User.findOne({ "orders._id": order_id });
        if (!user) return res.status(404).json({ message: "Order not found" });

        const orderIndex = user.orders.findIndex(order => order._id.toString() === order_id);
        if (orderIndex !== -1) {
            user.orders[orderIndex].paymentStatus = "paid";
            await user.save();
        }

        res.status(200).json({ message: "Payment successful and order updated." });
    } catch (error) {
        console.error("Error updating payment status:", error.message);
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