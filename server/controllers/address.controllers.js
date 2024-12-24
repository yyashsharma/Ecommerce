import { User } from "../models/user.model.js";



export const addNewAddress = async (req, res, next) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // Validate the incoming data
        const { firstName, lastName, street, city, state, postalCode, country, phone } = req.body;
        if (!firstName || !lastName || !street || !city || !state || !postalCode || !country || !phone) {
            return next(errorHandler(400, "All fields are required"));
        }

        // Create and add the new address
        const newAddress = {
            firstName,
            lastName,
            street,
            city,
            state,
            postalCode,
            country,
            phone,
        };
        user.addresses.push(newAddress);
        await user.save();

        // Retrieve the newly added address (with its _id)
        const addedAddress = user.addresses[user.addresses.length - 1];

        // Send the response
        res.status(201).json({ message: "Address added", address: addedAddress });
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
        if (firstName) address.firstName = firstName;
        if (lastName) address.lastName = lastName;
        if (street) address.street = street;
        if (city) address.city = city;
        if (state) address.state = state;
        if (postalCode) address.postalCode = postalCode;
        if (country) address.country = country;
        if (phone) address.phone = phone;

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

        // Find the index of the address in the addresses array
        const addressIndex = user.addresses.findIndex(
            (address) => address._id.toString() === req.params.addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Remove the address by index
        user.addresses.splice(addressIndex, 1);

        // Save the updated user
        await user.save();

        res.status(200).json({ message: "Address deleted" });
    } catch (error) {
        next(error);
    }
};