import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { Observable } from 'rxjs';

import { FileFetcherService } from '@file-encoder-api/common';

describe('FileFetcherService', () => {
  let httpService: HttpService;
  let fileFetcher: FileFetcherService;

  const url = 'file-url';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockReturnValue({
              subscribe: jest.fn(),
            } as unknown as Observable<any>),
          },
        },
        FileFetcherService,
      ],
    }).compile();

    httpService = module.get(HttpService);
    fileFetcher = module.get(FileFetcherService);
  });

  it('should be defined', () => {
    expect(httpService).toBeDefined();
  });

  describe('fetchFile', () => {
    it('should call get method of HttpService with specified url', async () => {
      fileFetcher.fetchFile(url);

      expect(httpService.get).toHaveBeenCalledWith(url, {
        responseType: 'blob',
      });
    });

    it('should return a promise', async () => {
      const result = fileFetcher.fetchFile(url);

      expect(result).toBeInstanceOf(Promise);
    });
  });
});
