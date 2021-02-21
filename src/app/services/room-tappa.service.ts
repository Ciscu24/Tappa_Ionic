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

  /**
   * Método que devuelve una lista observable de firebase
   */
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

  /**
   * Método que agrega un pedido a firebase
   * @param order el pedido en cuestión
   */
  addRoom(order:Order){
    return this.orderDB.push(order);
  }

  /**
   * Método que borra un pedido de firebase
   * @param id el id del pedido
   */
  deleteRoom(id: string){
    this.db.list('/orders').remove(id);
  }

  /**
   * Método que modifica un pedido
   * @param newOrder el pedido a modificar
   */
  editRoom(newOrder){
    const $key = newOrder.$key;
    delete newOrder.$key;
    delete newOrder.id;
    this.db.list('/orders').update($key, newOrder);
  }
}
