import { Schema } from 'mongoose';

export const RSAKeyPairSchema = new Schema({
  privateKey: String,
  publicKey: String,
});
