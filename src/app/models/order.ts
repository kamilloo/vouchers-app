import {Voucher} from './voucher';

export class Order {
    id: number;
    delivery: string;
    price: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    status: string;
    paid: string;
    used_at: string;
    created_at: string;
    updated_at: string;
    voucher: Voucher;
}