import {inject, TestBed} from '@angular/core/testing';

import { VouchersService } from './vouchers.service';
import {HttpClient} from '@angular/common/http';
import {Voucher} from '../models/voucher';
import {Observable} from 'rxjs';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('VouchersService', () => {
  let httpClientSpy;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', {
      url: 'backend',
      get() {
        console.log('get method');
        voucher.title = 'title';
        return new Observable<Voucher>();
      }
    });
    let voucher = new Voucher();

    httpClientSpy.get.and.returnValue(
        new Observable<Voucher>()
      );
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
    console.log('test start');
    const service: VouchersService = new VouchersService(httpClientSpy);
    service.getVoucher('code').subscribe((voucher: Voucher) => {

      console.log('subscribe');
      console.log(voucher);
      expect(httpClientSpy.get).toHaveBeenCalled();
    });
  });
  // it('should get voucher dto', () => {
  //   const service: VouchersService = new VouchersService(httpClientSpy);
  //   service.getVoucher('code').subscribe((voucher: Voucher) => {
  //     expect(voucher.title).toBe('title');
  //   });
  // });
});
