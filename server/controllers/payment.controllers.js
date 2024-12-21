
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import { stripe } from "../index.js"

export const createPaymentIntent = async (req, res, next) => {


    try {
        const { amount, currency } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert amount to smallest currency unit (e.g., cents)
            currency: currency || "usd",
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating PaymentIntent:", error.message);
        res.status(500).send({ error: "Failed to create PaymentIntent" });
    }
}
