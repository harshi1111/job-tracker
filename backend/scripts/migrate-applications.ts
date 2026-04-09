import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from '../src/models/Application';

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Update all applications that don't have resumeSuggestions field
    const result = await Application.updateMany(
      { resumeSuggestions: { $exists: false } },
      { 
        $set: { 
          resumeSuggestions: [],
          jobDescription: '',
          skills: []
        } 
      }
    );

    console.log(`Updated ${result.modifiedCount} applications`);
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();