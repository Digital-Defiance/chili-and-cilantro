import {
  ActionModel,
  ChefModel,
  EmailTokenModel,
  GameModel,
  UserModel,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { resolve } from 'path';

// Load .env file from the root directory
config({ path: resolve(__dirname, '../../../chili-and-cilantro-api/.env') });

const mongoUri =
  process.env.MONGO_URI || 'mongodb://localhost:27017/chili-and-cilantro';

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    console.log('Connecting with mongo URI:', mongoUri);
    const db = await mongoose.connect(mongoUri, {});

    console.log('Connected to MongoDB');

    // Initialize models/schemas
    await UserModel(db.connection).createCollection();
    await ChefModel(db.connection).createCollection();
    await EmailTokenModel(db.connection).createCollection();
    await GameModel(db.connection).createCollection();
    await ActionModel(db.connection).createCollection();

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
