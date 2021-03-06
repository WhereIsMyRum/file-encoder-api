import { ApiProperty } from '@nestjs/swagger';

export class RSAKeyPair {
  @ApiProperty()
  pubKey!: string;

  @ApiProperty()
  privKey!: string;
}

export type UserParameters = {
  id: string;
  email: string;
  rsaKeyPair?: RSAKeyPair;
};

export interface UserCredentials {
  id: string;
  email: string;
  password: {
    salt: string;
    hashedPassword: string;
  };
}

export class User {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private rsaKeyPair?: RSAKeyPair,
  ) {}

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getRsaKeyPair(): RSAKeyPair | undefined {
    return this.rsaKeyPair;
  }

  updateRsaKeyPair(newKeyPair: RSAKeyPair): void {
    this.rsaKeyPair = {
      ...this.rsaKeyPair,
      ...newKeyPair,
    };
  }

  parameters(): UserParameters {
    return {
      id: this.id,
      email: this.email,
      rsaKeyPair: this.rsaKeyPair,
    };
  }
}
