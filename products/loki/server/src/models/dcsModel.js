import mongoose from "mongoose";

const PocSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  escalation_mail: { type: String, default: "" },
  oncall_id: { type: String, default: "" },
});

const DcsSchema = new mongoose.Schema(
  {
    exp: { type: String, default: "1hr" }, // Expiry like '1hr', '30days', etc.
    type: { type: String, enum: ["EXP", "NO_EXP"], default: "NO_EXP" },
    created_by: { type: String, default: "" },
    updated_by: { type: String, default: "" },
    poc: { type: PocSchema, default: {} },
    name: { type: String, required: true, unique: true },
    associated_accounts: { type: [String], default: [] },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);


export const DCS = mongoose.model("DCS", DcsSchema);

