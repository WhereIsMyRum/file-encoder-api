import { Schema } from 'mongoose';

const RSAKeyPairSchema = new Schema(
  {
    privKey: String,
    pubKey: String,
  },
  { _id: false },
);

export const UserSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  rsaKeyPair: RSAKeyPairSchema,
});
