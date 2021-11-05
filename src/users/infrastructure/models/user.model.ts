import { RSAKeyPair } from '../../../users/domain';

export interface UserModel {
  id: string;
  email: string;
  password: string;
  rsaKeyPair?: RSAKeyPair;
}
