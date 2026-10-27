import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String },
    video: { type: String },
    pdf: { type: String },
    duration: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['published', 'draft', 'unpublish'],
      default: 'draft',
    },
    deletedAt: { type: Date },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const chapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    sections: [sectionSchema],
    order: { type: Number, default: 0 },
    deletedAt: { type: Date },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    prerequisites: { type: [String], default: [] },
    image: { type: String },
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    category: { type: String, index: true },
    subCategory: { type: String },
    tags: { type: [String], default: [] },
    instructors: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    students: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    rating: { type: Number, default: 0 },
    reviews: [reviewSchema],
    enrollments: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['published', 'draft', 'unpublish'],
      default: 'draft',
      index: true,
    },
    chapters: [chapterSchema],
    deletedAt: { type: Date },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ tags: 1 });

export const Course = mongoose.model('Course', courseSchema);
