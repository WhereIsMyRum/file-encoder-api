import { Schema } from 'mongoose';
import { RSAKeyPairSchema } from './rsa-key-pair.schema';

export const UserSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  rsaKeyPair: RSAKeyPairSchema,
});
