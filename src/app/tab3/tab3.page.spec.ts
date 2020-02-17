import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab3Page } from './tab3.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {VouchersService} from '../api/vouchers.service';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {of} from 'rxjs';
import {Voucher} from '../models/voucher';
import {HttpError} from '../exceptions/http.error';
import {AuthService} from '../services/auth.service';
import {Order} from '../models/order';
import {ResponseSuccess} from '../models/response.success';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;
  let scannerSpy;
  let voucherServiceSpy;
  const barcodeData = {
    text: 'text'
  };
  const voucher = new Voucher();
  const order = new Order();
  const responseSuccess = new ResponseSuccess();

  function mockOrder() {
    order.id = 3;
    order.delivery = 'online';
    order.price = 500;
    order.first_name = 'kamil';
    order.last_name = 'pietka';
    order.phone = '456789321';
    order.email = 'kamil@kamil.com';
    order.status = 'delivery';
    order.paid = true;
    order.used_at = null;
    order.created_at = '2020-02-13T20:13:11+00:00';
    order.updated_at = '2020-02-13T20:25:13+00:00';
    order.voucher = voucher;
    mockVoucher();
  }

  function mockVoucher() {
        voucher.type = 'quote';
        voucher.title = 'Gift for 100';
        voucher.price = 500;
        voucher.product = null;
  }


  beforeEach(async(() => {
    scannerSpy = jasmine.createSpyObj('BarcodeScanner', ['scan']);
    voucherServiceSpy = jasmine.createSpyObj('VouchersService', ['getVoucher']);

    scannerSpy.scan.and.returnValue(Promise.resolve(barcodeData));

    voucherServiceSpy.getVoucher.and.returnValue(of(responseSuccess));

    TestBed.configureTestingModule({
      providers: [
        { provide: VouchersService, useValue: voucherServiceSpy},
        { provide: BarcodeScanner, useValue: scannerSpy }
      ],
      declarations: [Tab3Page],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it scan barcode', () => {

    component.scan();
    Promise.resolve().then(() => {
      expect(scannerSpy.scan).toHaveBeenCalled();
    });

  });

  it('it scanner return qrCode', () => {
    component.scan();
    Promise.resolve().then(() => {
      expect(component.qrCode).toEqual(barcodeData.text);
    });
  });

  it('qrCode was submit and return Voucher', () => {
    responseSuccess.data = order;
    mockOrder();
    // voucher.price = 100;
    // voucher.id = 1;
    // voucher.type = 'service';
    // voucher.title = 'title';

    component.scan();
    Promise.resolve().then(() => {
      expect(voucherServiceSpy.getVoucher).toHaveBeenCalled();
      expect(component.order).toEqual(order);
      expect(component.verified).toEqual(true);
      expect(component.rejected).toEqual(false);
      expect(component.paid).toEqual(true);
      expect(component.noPaid).toEqual(false);
    });
  });


  it('qrCode was submit and return 404', () => {
    const voucher = new Voucher();
    voucher.price = 100;
    // voucher.id = 1;
    voucher.type = 'service';
    voucher.title = 'title';
    const error = new HttpError();
    voucherServiceSpy.getVoucher.and.returnValue(of(error));

    component.scan();
    Promise.resolve().catch(() => {
      expect(voucherServiceSpy.getVoucher).toHaveBeenCalled();
      expect(component.voucher).toEqual(voucher);
      expect(component.verified).toEqual(true);
      expect(component.rejected).toEqual(true);
      expect(component.paid).toEqual(true);
      expect(component.noPaid).toEqual(true);
    });
  });



});
