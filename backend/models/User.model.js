import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["Admin", "Manager", "Employee"],
        default: "Admin"
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
})

export default mongoose.model("User", userSchema);