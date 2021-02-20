import { Food } from "./Food";
import { User } from "./User";

export interface Order{
    $key?: string;
    id?: number | string,
    street: string,
    date: string,
    boss?: User,
    price?: number, 
    users?: Array<User>,
    addedFood?: Array<Food>,
    finishOrder?: boolean,
    image?: string
}