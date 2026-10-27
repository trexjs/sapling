import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    data: { type: Object, required: true },
    version: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const config = mongoose.model("config", configSchema);
