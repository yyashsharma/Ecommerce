import { Product } from "../models/product.model.js"
import { errorHandler } from "../utils/error.js"

export const createProduct = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a product'))
    }

    if (!req.body.name || !req.body.description || !req.body.price || !req.body.stock || !req.body.category || !req.body.colors || !req.body.images) {
        return next(errorHandler(400, 'Please provide all required fields '))
    }


    const newProduct = new Product({
        ...req.body
    })
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, message: "Post created Successfully", savedProduct });
    } catch (error) {
        next(error)
    }
}

export const getProducts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirections = req.query.order === 'asc' ? -1 : 1;
        const priceOrder = req.query.priceOrder === 'lowToHigh' ? 1 : req.query.priceOrder === 'highToLow' ? -1 : null;

        const products = await Product.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.productId && { _id: req.query.productId }),

            ...(req.query.searchTerm && {
                $or: [
                    { name: { $regex: req.query.searchTerm, $options: 'i' } },
                    { description: { $regex: req.query.searchTerm, $options: 'i' } },
                    { category: { $regex: req.query.searchTerm, $options: 'i' } },

                ]
            })
        })
            .sort(priceOrder !== null ? { price: priceOrder } : { updatedAt: sortDirections })
            .skip(startIndex)
            .limit(limit);

        const totalProducts = await Product.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthProducts = await Product.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(201).json({
            success: true,
            products,
            totalProducts,
            lastMonthProducts
        });


    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this post'))
    }
    try {
        await Product.findByIdAndDelete(req.params.productId);
        res.status(200).json({ success: true, message: "Product has been deleted successfully" });
    } catch (error) {
        next(error)
    }

}

export const updateProduct = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this post'))
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, {
            $set: {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                stock: req.body.stock,
                category: req.body.category,
                colors: req.body.colors,
                images: req.body.images,
                sizes: req.body.sizes,
            }
        },
            { new: true });
        res.status(200).json({ success: true, message: "Product has been updated successfully", updatedProduct });
    } catch (error) {
        next(error)
    }
}

export const getMonthlyProductData = async (req, res, next) => {
    try {
      // Group products by the month they were created
      const data = await Product.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" }, // Group by month
            totalProducts: { $sum: 1 },    // Count total products
          },
        },
        { $sort: { _id: 1 } }, // Sort by month in ascending order
      ]);
  
      // Month names for better visualization
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
  
      // Initialize array for monthly product data
      const monthlyProducts = Array(12).fill(0);
  
      // Map the aggregated data to the `monthlyProducts` array
      data.forEach(({ _id, totalProducts }) => {
        monthlyProducts[_id - 1] = totalProducts; // Month indexes are 0-based
      });
  
      res.status(200).json({
        success: true,
        months,
        monthlyProducts,
      });
    } catch (error) {
      next(error); // Pass error to middleware
    }
  };
