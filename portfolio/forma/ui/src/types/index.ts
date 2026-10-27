export interface Question {
  id: string;
  type: 'text' | 'textarea' | 'email' | 'number' | 'select' | 'radio' | 'checkbox' | 'rating' | 'date';
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface FormSettings {
  isPublished: boolean;
  allowMultipleResponses: boolean;
  collectEmail: boolean;
  showProgressBar: boolean;
}

export interface Form {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
  settings: FormSettings;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number;
}

export interface Response {
  _id: string;
  formId: string;
  answers: Answer[];
  submittedAt: string;
  userEmail?: string;
}

export interface ResponseStats {
  totalResponses: number;
  uniqueResponses: number;
}
