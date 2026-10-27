import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDTO } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<OrderDTO> {
    return this.http.get<OrderDTO>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: OrderDTO): Observable<OrderDTO> {
    return this.http.post<OrderDTO>(this.apiUrl, order);
  }

  updateOrder(id: number, order: OrderDTO): Observable<OrderDTO> {
    return this.http.put<OrderDTO>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  removeOrderDetail(orderId: number, detailId: number): Observable<OrderDTO> {
    return this.http.delete<OrderDTO>(`${this.apiUrl}/${orderId}/details/${detailId}`);
  }
}
