import { Schema } from 'mongoose';
import { RSAKeyPairSchema } from './rsa-key-pair.schema';

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rsaKeyPair: RSAKeyPairSchema,
});
