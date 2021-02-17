import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Order } from '../model/Order';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomTappaService {

  public orderDB: AngularFireList<Order>;

  constructor(private db: AngularFireDatabase) { 
    this.orderDB = this.db.list('/orders', (ref) => 
      ref.orderByChild('street')
    );
  }

  getRoom(): Observable<Order[]> {
    return this.orderDB.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c)=> ({
          $key: c.payload.key,
          ...c.payload.val()
        }));
      })
    )
  }

  addRoom(order:Order){
    return this.orderDB.push(order);
  }

  deleteRoom(id: string){
    this.db.list('/orders').remove(id);
  }

  editRoom(newOrder){
    const $key = newOrder.$key;
    delete newOrder.$key;
    delete newOrder.id;
    this.db.list('/orders').update($key, newOrder);
  }
}
