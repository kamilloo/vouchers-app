import {inject, TestBed} from '@angular/core/testing';

import { VouchersService } from './vouchers.service';
import {HttpClient} from '@angular/common/http';
import {Voucher} from '../models/voucher';
import {Observable, of} from 'rxjs';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('VouchersService', () => {
  let httpClientSpy;
  const id = 1;
  const price = 100;
  const type = 'service';
  const title = 'title';
  const expectedVoucher = new Voucher();
  expectedVoucher.id = id;
  expectedVoucher.title = title;
  expectedVoucher.price = price;
  expectedVoucher.type = type;


  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['url', 'get']);
    httpClientSpy.get.and.returnValue(of(expectedVoucher));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
          VouchersService,
        { provide: HttpClient, useValue: httpClientSpy}
      ]
    });

  });

  it('should be created', () => {
    const service: VouchersService = new VouchersService(httpClientSpy);
    expect(service).toBeTruthy();
  });
  it('should call http get', () => {
    const service: VouchersService = new VouchersService(httpClientSpy);
    service.getVoucher('code');
    expect(httpClientSpy.get).toHaveBeenCalled();

  });
  it('should get voucher dto', () => {
    const service: VouchersService = new VouchersService(httpClientSpy);
    service.getVoucher('code').subscribe((voucher: Voucher) => {
      expect(voucher.id).toBe(id);
      expect(voucher.title).toBe(title);
      expect(voucher.price).toBe(price);
      expect(voucher.type).toBe(type);
    });
  });
});
