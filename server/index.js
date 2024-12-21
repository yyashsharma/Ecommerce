import express from 'express'
import { connectDb } from './utils/db.js';
import { config } from 'dotenv'
// import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import productRoutes from './routes/product.route.js'
import cartRoutes from './routes/cart.route.js'
import addressRoutes from './routes/address.route.js'
import orderRoutes from './routes/order.route.js'
import paymentRoutes from './routes/payment.route.js'
import { ErrorHandlerMiddleware } from './middlewares/Errormiddleware.js';
import cookieParser from 'cookie-parser';
import Stripe from 'stripe';

// import path from 'path'


config();

// const __dirname = path.resolve();

export const stripe = Stripe("sk_test_51OfRY7SCwY1yayrOQIP5cjIa39K9Gc2EY1XYc9gaE2dpV1sBmvHNkXD1lHwHCntb7Pv44pt9wuDPxnISq2EHgbwr00P3vOBinh"); // Replace with your Stripe Secret Key

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDb();



app.get('/', (req, res) => {
    res.send("api is working")
})

app.use('/api/v1/auth', authRoutes)
// app.use('/api/v1/user', userRoutes)
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/address', addressRoutes)
app.use('/api/v1/order', orderRoutes)
app.use('/api/v1/payment', paymentRoutes)
// app.use('/api/v1',mailRoutes)


//it run the index.html file in client side
// app.use(express.static(path.join(__dirname, '/client/dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
// })

// error middleware for handling errors
app.use(ErrorHandlerMiddleware)


app.listen(process.env.PORT || 5000, () => {
    console.log(`server is running on ${process.env.PORT}!`)
})