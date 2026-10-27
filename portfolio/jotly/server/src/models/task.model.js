import mongoose from "mongoose";

const { Schema } = mongoose;

const SubtaskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    isCompleted: { type: Boolean, default: false },
    notes: { type: String, trim: true },
    dueDate: { type: Date },
  },
  { _id: false }
);

const ReminderSchema = new Schema(
  {
    time: { type: Date, required: true },
    message: { type: String, trim: true },
  },
  { _id: false }
);

const AttachmentSchema = new Schema(
  {
    label: { type: String, trim: true },
    url: { type: String, trim: true },
    type: {
      type: String,
      enum: ["file", "image", "video", "link"],
      default: "file",
    },
  },
  { _id: false }
);

const RepeatSchema = new Schema(
  {
    pattern: {
      type: String,
      enum: [
        "none",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "custom",
      ],
      default: "none",
    },
    interval: { type: Number, min: 1, default: 1 },
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6,
    }],
    endsOn: { type: Date },
  },
  { _id: false }
);

const TaskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true },
    isFavorite: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    dueDate: { type: Date },
    reminders: [ReminderSchema],
    repeat: RepeatSchema,
    notes: { type: String, trim: true },
    attachments: [AttachmentSchema],
    subtasks: [SubtaskSchema],
  },
  { timestamps: true }
);

TaskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate || this.status === "completed") return false;
  return new Date() > this.dueDate;
});

TaskSchema.method("duplicate", function () {
  const doc = this.toObject({ depopulate: true });
  delete doc._id;
  delete doc.id;
  doc.title = `${doc.title} (Copy)`;
  doc.status = "pending";
  doc.isFavorite = false;
  doc.createdAt = undefined;
  doc.updatedAt = undefined;
  return doc;
});

export const Task = mongoose.model("Task", TaskSchema);
