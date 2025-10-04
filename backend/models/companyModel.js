import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    currency: { type: String, required: true },
    createdBy: { type: String },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    approvalFlows: [
      {
        step: Number,
        approverRole: String, // e.g., Manager, Finance, Director
        isManagerApprover: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
