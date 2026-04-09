import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  jobDescriptionLink?: string;
  notes?: string;
  dateApplied: Date;
  status: string;
  salaryRange?: string;
  skills?: string[];
  resumeSuggestions?: string[];  // MUST HAVE THIS
  jobDescription?: string;        // MUST HAVE THIS
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  jobDescriptionLink: {
    type: String
  },
  notes: {
    type: String
  },
  dateApplied: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['applied', 'phone-screen', 'interview', 'offer', 'rejected'],
    default: 'applied'
  },
  salaryRange: {
    type: String
  },
  skills: [{
    type: String
  }],
  resumeSuggestions: [{   // MUST HAVE THIS
    type: String
  }],
  jobDescription: {       // MUST HAVE THIS
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);