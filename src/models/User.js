import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      gender: { type: String, enum: ['Male', 'Female'], required: true }
});

export default mongoose.models['Users'] || mongoose.model('Users', UserSchema);