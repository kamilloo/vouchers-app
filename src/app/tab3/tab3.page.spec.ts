import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab3Page } from './tab3.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {VouchersService} from '../api/vouchers.service';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;
  let scannerSpy;
  let voucherServiceSpy;

  beforeEach(async(() => {
    let scannerSpy = jasmine.createSpyObj('BarcodeScanner', {
      url: 'test'
    });
    let voucherServiceSpy = jasmine.createSpyObj('VouchersService', {
      url: 'test',
    });
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
});
