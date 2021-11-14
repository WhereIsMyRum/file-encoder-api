import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileFetcherService {
  constructor(private readonly httpService: HttpService) {}

  fetchFile(url: string) {
    const response = this.httpService.get(url, {
      responseType: 'blob',
    });

    return new Promise((resolve) => {
      response.subscribe((response) => resolve(response.data));
    });
  }
}
