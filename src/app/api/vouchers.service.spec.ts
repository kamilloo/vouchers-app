import {inject, TestBed} from '@angular/core/testing';

import { VouchersService } from './vouchers.service';
import {HttpClient} from '@angular/common/http';
import {Voucher} from '../models/voucher';
import {Observable, of, throwError} from 'rxjs';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import {PaymentConfirmation} from '../models/payment.confirmation';
import {HttpError} from '../exceptions/http.error';
import {AuthService} from '../services/auth.service';

describe('VouchersService', () => {
  let httpClientSpy;
  let authServiceSpy;

  const id = 1;
  const price = 100;
  const type = 'service';
  const title = 'title';
  const expectedVoucher = new Voucher();
  expectedVoucher.id = id;
  expectedVoucher.title = title;
  expectedVoucher.price = price;
  expectedVoucher.type = type;
  const successfulPaymentConfirmation = new PaymentConfirmation();
  successfulPaymentConfirmation.status = 'success';
  const failedPaymentConfirmation = new PaymentConfirmation();
  failedPaymentConfirmation.status = 'failed';


  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
        'url',
        'get',
        'post'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
          VouchersService,
        { provide: HttpClient, useValue: httpClientSpy},
        { provide: AuthService, useValue: authServiceSpy}
      ]
    });

  });

  it('should be created', () => {
    const service: VouchersService = new VouchersService(httpClientSpy, authServiceSpy);
    expect(service).toBeTruthy();
  });
  it('should call http get', () => {
    const service: VouchersService = new VouchersService(httpClientSpy, authServiceSpy);
    service.getVoucher('code');
    expect(httpClientSpy.get).toHaveBeenCalled();

  });

  it('voucher not found and get 404', () => {
    const httpError = new HttpError();
    httpError.error = 'error';
    httpError.code = '405';
    httpClientSpy.get.and.returnValue(of(httpError));
    const service: VouchersService = new VouchersService(httpClientSpy, authServiceSpy);
    service.getVoucher('code').subscribe((voucher: HttpError) => {
      expect(voucher.error).toBe('error');
      expect(voucher.code).toBe('404');
    });

  });
  it('should get voucher dto', () => {
    httpClientSpy.get.and.returnValue(of(expectedVoucher));
    const service: VouchersService = new VouchersService(httpClientSpy, authServiceSpy);
    service.getVoucher('code').subscribe((voucher: Voucher) => {
      expect(voucher.id).toBe(id);
      expect(voucher.title).toBe(title);
      expect(voucher.price).toBe(price);
      expect(voucher.type).toBe(type);
    });
  });

  it('can pay by voucher', () => {
    const service: VouchersService = new VouchersService(httpClientSpy, authServiceSpy);
    service.payByVoucher('code');
    expect(httpClientSpy.post).toHaveBeenCalled();
  });

  it('pay by voucher and retrieve success', () => {
    httpClientSpy.post.and.returnValue(of(successfulPaymentConfirmation));
    const service: VouchersService = new VouchersService(httpClientSpy, authServiceSpy);
    service.payByVoucher('code').subscribe((confirmation: PaymentConfirmation) => {
      expect(confirmation.status).toBe('success');
    });
  });

  it('pay by voucher and retrieve failed', () => {
    httpClientSpy.post.and.returnValue(of(failedPaymentConfirmation));
    const service: VouchersService = new VouchersService(httpClientSpy, authServiceSpy);
    service.payByVoucher('code').subscribe((confirmation: PaymentConfirmation) => {
      expect(confirmation.status).toBe('failed');
    });
  });
});
