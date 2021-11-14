import { User, RSAKeyPair } from './user';

describe('User', () => {
  const userId = 'user-id';
  const email = 'email@email.com';
  const rsaKeyPair: RSAKeyPair = {
    pubKey: 'pubKey',
    privKey: 'privKey',
  };

  let user: User;

  beforeEach(() => {
    user = new User(userId, email);
  });

  it('should be instantiatable', () => {
    const newUser = new User(userId, email);

    expect(newUser).toBeInstanceOf(User);
  });

  describe('getId', () => {
    it("should return user's id", () => {
      expect(user.getId()).toEqual(userId);
    });
  });

  describe('getEmail', () => {
    it("should return user's email", () => {
      expect(user.getEmail()).toEqual(email);
    });
  });

  describe('updateRsaKeyPair', () => {
    it('should set the RSA key pair if its not set', () => {
      user.updateRsaKeyPair(rsaKeyPair);

      expect(user.getRsaKeyPair()).toEqual(rsaKeyPair);
    });

    it('should update the RSA key pair if its set', () => {
      user.updateRsaKeyPair(rsaKeyPair);

      const newPair: RSAKeyPair = {
        pubKey: 'new-pubKey',
        privKey: 'new-privKey',
      };

      user.updateRsaKeyPair(newPair);

      expect(user.getRsaKeyPair()).toEqual(newPair);
    });
  });

  describe('getRsaKeyPair', () => {
    it('should return undefined if user has no RSA key pair', () => {
      expect(user.getRsaKeyPair()).toEqual(undefined);
    });

    it('should return RSA key pair if it is set', () => {
      user.updateRsaKeyPair(rsaKeyPair);

      expect(user.getRsaKeyPair()).toEqual(rsaKeyPair);
    });
  });
});
