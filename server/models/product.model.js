import mongoose from "mongoose";

// Review Schema for storing user reviews on products
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Ratings between 1 and 5
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Main Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be a positive number'],
  },
  stock: {
    type: Number,
    required: [true, 'Stock count is required'],
    min: [0, 'Stock must be a positive number'],
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  colors: {
    type: [String], // Array of colors (e.g., ['red', 'blue', 'green'])
    default: [], // Default to an empty array
  },
  sizes: {
    type: [String], // Array of colors (e.g., ['red', 'blue', 'green'])
    default: [], // Default to an empty array
  },
  images: {
    type: [String], // Array of image URLs
    default: [], // Default to an empty array
  },
  reviews: [reviewSchema], // Array of embedded reviews
  averageRating: {
    type: Number,
    default: 0, // Calculated from the `reviews`
  },
},
{timestamps:true}
);

export const Product = mongoose.model("Product", productSchema);
