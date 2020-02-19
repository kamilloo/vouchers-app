import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { VouchersService } from '../api/vouchers.service';
import { Input } from '@angular/core';
import {Voucher} from '../models/voucher';
import {Order} from '../models/order';
import {HttpError} from '../exceptions/http.error';
import {ResponseSuccess} from '../models/response.success';
import {PaymentConfirmation} from '../models/payment.confirmation';
import {ResponseError} from '../models/response.error';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  rejected: boolean;
  verified: boolean;
  paid: boolean;
  noPaid: boolean;
  @Input() qrCode: string;
  isVerifying: boolean;
  order: Order;
  paymentConfirmation: PaymentConfirmation;
  responseError: ResponseError;
  // constructor(private qrScanner: QRScanner) {}
  used_at: any;
  canPay: boolean;
  expired_at: any;
  constructor(private qrScanner: BarcodeScanner, private voucherService: VouchersService) {
    this.rejected = false;
    this.verified = false;
    this.isVerifying = false;
    this.paid = false;
    this.noPaid = false;
    this.canPay = false;
  }

  scan() {
    // this.qrScanner.prepare()
    //     .then((status: QRScannerStatus) => {
    //       if (status.authorized) {
    //         // camera permission was granted
    //
    //
    //         // start scanning
    //         let scanSub = this.qrScanner.scan().subscribe((qrCode: string) => {
    //           this.qrCode = qrCode;
    //           console.log('Scanned something', qrCode);
    //
    //           this.qrScanner.hide(); // hide camera preview
    //           scanSub.unsubscribe(); // stop scanning
    //         });
    //
    //       } else if (status.denied) {
    //         // camera permission was permanently denied
    //         // you must use QRScanner.openSettings() method to guide the user to the settings page
    //         // then they can grant the permission from there
    //       } else {
    //         // permission was denied, but not permanently. You can ask for permission again at a later time.
    //       }
    //     })
    //     .catch((e: any) => console.log('Error is', e));

    this.qrScanner.scan().then(barcodeData => {
      this.qrCode = barcodeData.text;

      this.verify();
    }).catch(err => {
      console.log('Error', err);
    });
  }
  submitCode(event) {
    event.target.hidden = 1;
    // this.isVerifying = true;
    // setTimeout(() => {
    //   event.target.hidden = 0;
    //   this.isVerifying = false;
    //   this.verify();
    // }, 1000);
    this.verify();


  }
  payByCode(event) {

    this.voucherService.payByVoucher(this.qrCode).subscribe((response: ResponseSuccess) => {
      this.paymentConfirmation = response.data;
      this.paid = true;
      this.noPaid = false;

    }, (error: HttpError) => {
      this.responseError = error.error;
      this.paid = false;
      this.noPaid = true;
    });
  }

  private verify() {

    this.voucherService.getVoucher(this.qrCode).subscribe((response: ResponseSuccess) => {

      this.verified = true;
      this.rejected = false;
      this.order = response.data;
      if (this.order.used_at)
      {
        this.used_at = new Date(this.order.used_at);
      }else{
        this.canPay = true;
      }
      if (this.order.expired_at)
      {
        this.expired_at = new Date(this.order.expired_at);
      }

    }, (error: HttpError) => {
      this.responseError = error.error;

      this.verified = false;
      this.rejected = true;
    });
  }
}
