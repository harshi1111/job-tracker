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
  resumeSuggestions?: string[];
  jobDescription?: string;
  // NEW FIELDS FOR REMINDERS
  followUpDate?: Date;        // When to follow up
  reminderNotes?: string;      // Notes about what to follow up on
  lastReminded?: Date;         // Last time reminder was sent
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
  resumeSuggestions: [{
    type: String
  }],
  jobDescription: {
    type: String
  },
  // NEW FIELDS - Follow-up reminders
  followUpDate: {
    type: Date,
    default: null
  },
  reminderNotes: {
    type: String,
    default: ''
  },
  lastReminded: {
    type: Date,
    default: null
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