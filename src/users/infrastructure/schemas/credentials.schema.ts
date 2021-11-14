import { Schema } from 'mongoose';

const PasswordSchema = new Schema(
  {
    hashedPassword: { type: String, required: true },
    salt: { type: String, required: true },
  },
  { _id: false },
);

export const CredentialsSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: PasswordSchema,
});
