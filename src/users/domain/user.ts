import { ApiProperty } from '@nestjs/swagger';

export class RSAKeyPair {
  @ApiProperty()
  publicKey!: string;

  @ApiProperty()
  privateKey!: string;
}

export class User {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private password: string,
    private rsaKeyPair?: RSAKeyPair,
  ) {}

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  updatePassword(): void {
    this.password;
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
}
