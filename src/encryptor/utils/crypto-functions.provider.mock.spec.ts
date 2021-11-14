import { CryptoFunctionsProvider } from './crypto-functions.provider';

export const cryptoFunctionsProviderMock = {
  provide: CryptoFunctionsProvider,
  useValue: {
    generateKeyPair: jest.fn(),
    randomBytes: jest.fn(),
    createCipheriv: jest.fn(),
    createDecipheriv: jest.fn(),
    publicEncrypt: jest.fn(),
    privateDecript: jest.fn(),
    constants: { RSA_PKCS1_OEP_PADDING: 10 },
  },
};
