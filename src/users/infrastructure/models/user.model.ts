import { RSAKeyPair } from 'src/users/domain/rsa-key-pair';

export interface UserModel {
  id: string;
  email: string;
  password: string;
  rsaKeyPair: RSAKeyPair;
}
