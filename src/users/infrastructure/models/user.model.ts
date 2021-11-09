import { RSAKeyPair } from '../../../users/domain';

export interface UserModel {
  id: string;
  email: string;
  rsaKeyPair?: RSAKeyPair;
}
