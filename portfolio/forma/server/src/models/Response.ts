import mongoose, { Document, Schema } from 'mongoose';

export interface IResponse extends Document {
  formId: string;
  answers: IAnswer[];
  submittedAt: Date;
  userEmail?: string;
}

export interface IAnswer {
  questionId: string;
  value: string | string[] | number;
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true }
});

const ResponseSchema = new Schema<IResponse>({
  formId: { type: String, required: true },
  answers: [AnswerSchema],
  submittedAt: { type: Date, default: Date.now },
  userEmail: { type: String }
});

export default mongoose.model<IResponse>('Response', ResponseSchema);
