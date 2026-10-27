import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const propertySchema = new Schema({}, { strict: false, _id: false });

const nodeSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    parent: { type: String },
    props: propertySchema,
    displayName: String,
    custom: propertySchema,
    linkedNodes: propertySchema,
    nodes: [String],
  },
  { _id: false }
);

const pageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    rootNodeId: {
      type: String,
      required: true,
    },
    nodes: [nodeSchema],
  },
  {
    timestamps: true,
  }
);

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
    pages: [pageSchema],
    settings: propertySchema,
    publishedAt: Date,
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ owner: 1 });
projectSchema.index({ 'pages.slug': 1 });

const Project = model('Project', projectSchema);

export default Project;
