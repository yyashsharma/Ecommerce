import { Product } from "../models/product.model.js"
import { errorHandler } from "../utils/error.js"

export const createProduct = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'))
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
        const sortDirections = req.query.order === 'asc' ? 1 : -1;
       
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ]
            }),
            approved: true
        })
            .sort({ updatedAt: sortDirections })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(201).json({
            success: true,
            posts,
            totalPosts,
            lastMonthPosts
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
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({ success: true, message: "Post has been deleted successfully" });
    } catch (error) {
        next(error)
    }

}

export const updateProduct = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this post'))
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image,
            }
        },
            { new: true });
        res.status(200).json({ success: true, message: "Post has been updated successfully", updatedPost });
    } catch (error) {
        next(error)
    }
}

