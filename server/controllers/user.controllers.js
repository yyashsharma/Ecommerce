import { User } from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.send("test api is working")
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(401, "Unauthorized"))
    }

    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, "Password must be atleast 6 characters"))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, "Username must be between 7 and 20 characters"))
        }

        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, "Username cannot contain space"))
        }

        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, "Username must be lowercase"))
        }

        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, "Username can only contain letters and numbers"))
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                },
            },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json({ success: true, message: "User Updated Successfully", rest });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(401, "Unauthorized"))
    }

    try {
        await User.findByIdAndDelete(req.params.userId);

        res.status(200).json({ success: true, message: "User has been Deleted Successfully" });
    } catch (error) {
        next(error);
    }
}



export const getusers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to all users"))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirections = req.query.order === 'asc' ? 1 : -1;

        const users = await User.find({
            ...(req.query.userId && { _id: req.query.userId }),

            ...(req.query.searchTerm && {
                $or: [
                    { username: { $regex: req.query.searchTerm, $options: 'i' } },
                    { email: { $regex: req.query.searchTerm, $options: 'i' } },
                ]
            })
        })
            .select('-password') // Exclude the 'password' field
            .sort({ updatedAt: sortDirections })
            .skip(startIndex)
            .limit(limit);

        const totalUsers = await User.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(201).json({
            success: true,
            users,
            totalUsers,
            lastMonthUsers
        });
    } catch (error) {
        next(error);
    }
}


export const getuser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('-password') // Exclude the 'password' field

        if (!user) {
            return next(errorHandler(403, "User not found"))
        }

        res.status(200).json({
            success: true,
            user,

        });
    } catch (error) {
        next(error);
    }
}

export const getMonthlyUserData = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to view this data"));
    }

    try {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const monthlyUserCounts = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfYear },
                },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        const months = [
            "January", "February", "March", "April", "May",
            "June", "July", "August", "September", "October", "November", "December",
        ];
        const monthlyUsers = Array(12).fill(0);
        monthlyUserCounts.forEach(entry => {
            monthlyUsers[entry._id - 1] = entry.count;
        });

        res.status(200).json({
            success: true,
            months,
            monthlyUsers,
        });
    } catch (error) {
        next(error);
    }
};



