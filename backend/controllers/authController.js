import express from "express"

import jwt from "jsonwebtoken"
import UserModel from "../models/User.model.js";

import Company from "../models/companyModel.js";
import bcrypt from "bcryptjs";

// REGISTER CONTROLLER
export const register = async (req, res) => {
    try {
        const { name, email, password, role, country, currency } = req.body;

        // Validate fields
        if (!name || !email || !password || !country || !currency) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check existing user
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let company;

        // If Admin: create new Company (auto)
        if (role === "Admin") {
            company = new Company({
                name: `${name}'s Company`,
                country,
                currency,
                createdBy: email,
            });
            await company.save();
        }
        // If not Admin: must belong to an existing company
        else {
            company = await Company.findOne({ country });
            if (!company) {
                return res.status(400).json({ message: "No existing company found for this country. Please ask Admin to create one." });
            }
        }

        // Create new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role,
            country,
            currency,
            company: company._id,
        });

        await newUser.save();

        // Add employee/manager under company
        company.employees.push(newUser._id);
        await company.save();

        // Create JWT
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                company: company.name,
                currency,
            },
            token,
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


//login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Check if user exists
        const user = await UserModel.findOne({ email }).populate("company");
        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role, companyId: user.company?._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Prepare user data for frontend
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            country: user.country,
            currency: user.currency,
            company: user.company?.name || null,
        };

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userData,
            token,
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        if (!users) {
            return res.status(500).json({
                message: "No users find"
            })
        }
        return res.status(200).json({
            users
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error in fetching all users",
            error: error.message
        })
    }
}

export const getManagers = async (req, res) => {
    try {
        const managers = await UserModel.find({ role: "Manager" })
            .select('name email role') // Select only necessary fields
            .sort({ name: 1 }); // Sort alphabetically by name
        res.status(200).json({
            success: true,
            count: managers.length,
            data: managers
        });
    } catch (error) {
        console.error('Error fetching managers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch managers',
            error: error.message
        });
    }
}
