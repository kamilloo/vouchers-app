import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VouchersService {
  url = 'http://vouchers.kp/api/vouchers/';
  apiKey: string;

  constructor(private http: HttpClient) { }

  getVoucher(code: string) {
    return this.http.get(`${this.url}${code}`);
  }

  payByVoucher(code: string) {
    return this.http.post(`${this.url}${code}/pay`, {});
  }
}
