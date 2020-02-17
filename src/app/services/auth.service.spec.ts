import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {VouchersService} from '../api/vouchers.service';
import {HttpClient} from '@angular/common/http';
import {EnvService} from './env.service';

describe('AuthService', () => {
  let httpClientSpy;
  let envSpy;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      { provide: HttpClient, useValue: httpClientSpy},
      { provide: EnvService, useValue: envSpy}
    ]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
