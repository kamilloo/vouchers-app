import {Voucher} from './voucher';

export class Order {
    delivery: string;
    full_name: string;
    phone: string;
    email: string;
    qr_code: string;
    status: string;
    paid: boolean;
    used_at: any;
    expired_at: any;
    voucher: Voucher;
}
