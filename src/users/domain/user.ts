import { RSAKeyPair } from './rsa-key-pair';

export class User {
  constructor(
    private readonly email: string,
    private password: string,
    private rsaKeyPair?: RSAKeyPair,
  ) {}

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  updatePassword(): void {
    this.password;
  }

  updateRSAKeyPair(newKeyPair: RSAKeyPair): void {
    this.rsaKeyPair = {
      ...this.rsaKeyPair,
      ...newKeyPair,
    };
  }
}
