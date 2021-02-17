import { Order } from "./Order";

export interface Food{
    id?:number | string,
    name: string,
    price: number,
    orders?: Array<Order>
}