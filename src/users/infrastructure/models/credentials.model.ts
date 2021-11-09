export interface CredentialsModel {
  id: string;
  email: string;
  password: {
    hashedPassword: string;
    salt: string;
  };
}
