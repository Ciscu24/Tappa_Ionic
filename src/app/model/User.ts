import { Order } from "./Order";

export interface User{
    id?:number | string,
    name: string,
    surnames: string,
    shipping: number,
    call: number,
    email: string,
    password: string,
    image?: string,
    orders?: Array<Order>
}