import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      default: 'application/pdf',
    },
  },
  {
    timestamps: true,
  }
);

// Limit to 6 resumes per user (handled in controller)
ResumeSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IResume>('Resume', ResumeSchema);