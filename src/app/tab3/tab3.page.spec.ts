import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab3Page } from './tab3.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {VouchersService} from '../api/vouchers.service';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {of} from 'rxjs';
import {Voucher} from '../models/voucher';
import {HttpError} from '../exceptions/http.error';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;
  let scannerSpy;
  let voucherServiceSpy;
  const barcodeData = {
    text: 'text'
  };
  const voucher = new Voucher();


  beforeEach(async(() => {
    scannerSpy = jasmine.createSpyObj('BarcodeScanner', ['scan']);
    voucherServiceSpy = jasmine.createSpyObj('VouchersService', ['getVoucher']);
    scannerSpy.scan.and.returnValue(Promise.resolve(barcodeData));

    voucherServiceSpy.getVoucher.and.returnValue(of(voucher));

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
    voucher.price = 100;
    voucher.id = 1;
    voucher.type = 'service';
    voucher.title = 'title';

    component.scan();
    Promise.resolve().then(() => {
      expect(voucherServiceSpy.getVoucher).toHaveBeenCalled();
      expect(component.voucher).toEqual(voucher);
      expect(component.verified).toEqual(false);
      expect(component.rejected).toEqual(false);
      expect(component.paid).toEqual(false);
      expect(component.noPaid).toEqual(false);
    });
  });


  it('qrCode was submit and return 404', () => {
    const voucher = new Voucher();
    voucher.price = 100;
    voucher.id = 1;
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
