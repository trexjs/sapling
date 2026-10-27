import mongoose, { Document, Schema } from 'mongoose';

export interface IForm extends Document {
  title: string;
  description?: string;
  questions: IQuestion[];
  settings: {
    isPublished: boolean;
    allowMultipleResponses: boolean;
    collectEmail: boolean;
    showProgressBar: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  id: string;
  type: 'text' | 'textarea' | 'email' | 'number' | 'select' | 'radio' | 'checkbox' | 'rating' | 'date';
  title: string;
  description?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  placeholder?: string;
  min?: number; // For number, rating
  max?: number; // For number, rating
  step?: number; // For number
}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  type: { type: String, required: true, enum: ['text', 'textarea', 'email', 'number', 'select', 'radio', 'checkbox', 'rating', 'date'] },
  title: { type: String, required: true },
  description: { type: String },
  required: { type: Boolean, default: false },
  options: [{ type: String }],
  placeholder: { type: String },
  min: { type: Number },
  max: { type: Number },
  step: { type: Number }
});

const FormSchema = new Schema<IForm>({
  title: { type: String, required: true },
  description: { type: String },
  questions: [QuestionSchema],
  settings: {
    isPublished: { type: Boolean, default: false },
    allowMultipleResponses: { type: Boolean, default: true },
    collectEmail: { type: Boolean, default: false },
    showProgressBar: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

export default mongoose.model<IForm>('Form', FormSchema);
