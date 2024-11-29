import express from 'express'
import { connectDb } from './utils/db.js';
import { config } from 'dotenv'
// import userRoutes from './routes/user.route.js'
// import authRoutes from './routes/auth.route.js'

// import { ErrorHandlerMiddleware } from './middlewares/Errormiddleware.js';
import cookieParser from 'cookie-parser';
// import path from 'path'


config();

// const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDb();

app.get('/', (req, res) => {
    res.send("api is working")
})

// app.use('/api/v1/auth', authRoutes)
// app.use('/api/v1/user', userRoutes)
// app.use('/api/v1/post', postRoutes)
// app.use('/api/v1/comment', commentRoutes)
// app.use('/api/v1',mailRoutes)


//it run the index.html file in client side
// app.use(express.static(path.join(__dirname, '/client/dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
// })

//error middleware for handling errors
// app.use(ErrorHandlerMiddleware)


app.listen(process.env.PORT || 5000, () => {
    console.log(`server is running on ${process.env.PORT}!`)
})