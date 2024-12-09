import { User } from "../models/user.model";



export const addNewAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        req.user = user;

        const { street, city, state, postalCode, country } = req.body;

        if (!street || !city || !state || !postalCode || !country) {
            return next(errorHandler(400, "All fields are required"));
            
        }

        const newAddress = { street, city, state, postalCode, country };
        req.user.addresses.push(newAddress);
        await req.user.save();

        res.status(201).json({ message: "Address added", address: newAddress });
    } catch (error) {
        next(error);
    }
};


export const getAllAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        req.user = user;


        res.status(200).json(req.user.addresses);

    } catch (error) {
        next(error);
    }
};


export const updateAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        req.user = user;


        const address = req.user.addresses.id(req.params.addressId);//.id() is built in method og mongoose which search (address id )each subdocument in addresses array and return to const address without looping
        if (!address) {
            return next(errorHandler(404, "address not found"));

        }

        const { street, city, state, postalCode, country } = req.body;
        if (street) address.street = street;
        if (city) address.city = city;
        if (state) address.state = state;
        if (postalCode) address.postalCode = postalCode;
        if (country) address.country = country;

        await req.user.save();

        res.status(200).json({ message: "Address updated", address });

    } catch (error) {
        next(error);
    }
};


export const deleteAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        req.user = user;

        const address = req.user.addresses.id(req.params.addressId);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        address.remove();
        await req.user.save();

        res.status(200).json({ message: "Address deleted" });

    } catch (error) {
        next(error);
    }
};