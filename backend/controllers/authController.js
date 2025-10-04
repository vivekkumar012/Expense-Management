import express from "express"

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import UserModel from "../models/User.model.js";

//register
export const register = async (req, res) => {
    try {
        const {email, password, name, role} = req.body;
        if(!email || !password || !name) {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const ExitsUser = await UserModel.findOne({email});
        if(ExitsUser) {
            return res.status(400).json({
                success:false,
                message:"User already exists Please Login!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            email,
            password: hashedPassword,
            name,
            role
        })
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User register successfully ",
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

//login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};