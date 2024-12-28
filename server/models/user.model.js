import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), // Generate a unique ID for each address
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    }
});

const orderSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            price: {
                type: Number,
                required: true,
            },
            name: {
                type: String,
                required: true, 
            },
            image:{
                type: String,
                required: true,
            }
        },
    ],
   
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed','cashOnDelivery'],
        default: 'pending',
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'shipped', 'cancelled', 'dispatched', 'delivered'],
        default: 'pending',
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    orders: [orderSchema], // Embedded subdocuments for user orders
    addresses: [addressSchema], // Embedded subdocuments for user addresses

},
    { timestamps: true }
);

//create a model
export const User = mongoose.model("User", userSchema);
