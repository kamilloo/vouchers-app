import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { VouchersService } from '../api/vouchers.service';
import { Input } from '@angular/core';
import {Voucher} from '../models/voucher';
import {HttpError} from '../exceptions/http.error';

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
  title: string;
  voucher: Voucher;
  // constructor(private qrScanner: QRScanner) {}
  constructor(private qrScanner: BarcodeScanner, private voucherService: VouchersService) {
    this.rejected = false;
    this.verified = false;
    this.isVerifying = false;
    this.voucher = null;
    this.paid = false;
    this.noPaid = false;
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

    this.voucherService.payByVoucher(this.qrCode).subscribe((voucher: Voucher) => {

    }, (error: HttpError) => {
      // console.log(error.code);
      // console.log(error.error);
      this.voucher = new Voucher();
      this.voucher.price = 100;
      this.voucher.id = 1;
      this.voucher.type = 'service';
      this.voucher.title = 'title';
      this.paid = true;
      this.noPaid = false;
    });
  }

  private verify() {

    this.voucherService.getVoucher(this.qrCode).subscribe((voucher: Voucher) => {
      this.voucher = new Voucher();
      this.voucher.price = 100;
      this.voucher.id = 1;
      this.voucher.type = 'service';
      this.voucher.title = 'title';
      this.verified = true;
      this.rejected = false;
    }, (error: HttpError) => {
      // console.log(error.code);
      // console.log(error.error);
      this.voucher = new Voucher();
      this.voucher.price = 100;
      this.voucher.id = 1;
      this.voucher.type = 'service';
      this.voucher.title = 'title';
      this.verified = false;
      this.rejected = true;
    });
  }
}
