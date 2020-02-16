import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VouchersService {
  url = 'https://myvouchers.pl/api/vouchers/';
  apiKey: string;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getVoucher(code: string) {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.url}${code}`,{headers: headers});
  }

  payByVoucher(code: string) {
    return this.http.post(`${this.url}${code}/pay`, {});
  }
}
