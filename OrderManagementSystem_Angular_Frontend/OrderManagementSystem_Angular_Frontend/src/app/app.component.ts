import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderDTO, OrderDetailDTO } from './models/order.model';
import { OrderService } from './services/order.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  orders: OrderDTO[] = [];
  isEditing = false;
  editingId: number | null = null;
  loading = false;
  message = '';
  errorMessage = '';

  form: OrderDTO = this.emptyForm();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  emptyDetail(): OrderDetailDTO {
    return { productName: '', quantity: 1, price: 0 };
  }

  emptyForm(): OrderDTO {
    return {
      customerName: '',
      orderDate: new Date().toISOString().slice(0, 10),
      orderDetails: [{ productName: '', quantity: 1, price: 0 }]
    };
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Could not load orders. Check that Spring Boot is running and CORS is configured.';
        console.error(err);
      }
    });
  }

  addDetail(): void {
    this.form.orderDetails.push(this.emptyDetail());
  }

  removeDetail(index: number): void {
    if (this.form.orderDetails.length > 1) {
      this.form.orderDetails.splice(index, 1);
    }
  }

  saveOrder(): void {
    this.clearMessages();
    if (!this.form.customerName.trim()) {
      this.errorMessage = 'Please enter customer name.';
      return;
    }
    if (!this.form.orderDetails.length || this.form.orderDetails.some(
      d => !d.productName.trim() || d.quantity < 1 || d.price <= 0
    )) {
      this.errorMessage = 'Enter product name, quantity (at least 1), and price greater than 0 for every item.';
      return;
    }

    const payload: OrderDTO = {
      customerName: this.form.customerName.trim(),
      orderDate: this.form.orderDate,
      orderDetails: this.form.orderDetails.map(d => ({
        productName: d.productName.trim(),
        quantity: Number(d.quantity),
        price: Number(d.price)
      }))
    };

    const request = this.isEditing && this.editingId !== null
      ? this.orderService.updateOrder(this.editingId, payload)
      : this.orderService.createOrder(payload);

    request.subscribe({
      next: () => {
        this.message = this.isEditing ? 'Order updated successfully.' : 'Order created successfully.';
        this.resetForm();
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = 'Could not save order. Check the backend console and request data.';
        console.error(err);
      }
    });
  }

  editOrder(order: OrderDTO): void {
    this.clearMessages();
    this.isEditing = true;
    this.editingId = order.id ?? null;
    this.form = {
      id: order.id,
      customerName: order.customerName,
      orderDate: order.orderDate || '',
      orderDetails: order.orderDetails.map(d => ({
        productName: d.productName,
        quantity: d.quantity,
        price: Number(d.price)
      }))
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteOrder(order: OrderDTO): void {
    if (!order.id || !confirm(`Delete order #${order.id}?`)) return;
    this.clearMessages();
    this.orderService.deleteOrder(order.id).subscribe({
      next: () => {
        this.message = `Order #${order.id} deleted.`;
        this.loadOrders();
        if (this.editingId === order.id) this.resetForm();
      },
      error: (err) => {
        this.errorMessage = 'Could not delete order. Check the backend response and database foreign-key constraints.';
        console.error(err);
      }
    });
  }

  removeSavedDetail(order: OrderDTO, detailId?: number): void {
    if (!order.id || !detailId) return;
    if (!confirm(`Remove item #${detailId} from order #${order.id}?`)) return;
    this.clearMessages();
    this.orderService.removeOrderDetail(order.id, detailId).subscribe({
      next: () => {
        this.message = 'Order item removed.';
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = 'Could not remove order item.';
        console.error(err);
      }
    });
  }

  resetForm(): void {
    this.form = this.emptyForm();
    this.isEditing = false;
    this.editingId = null;
  }

  clearMessages(): void {
    this.message = '';
    this.errorMessage = '';
  }

  total(order: OrderDTO): number {
    return order.orderDetails.reduce((sum, item) => sum + item.quantity * Number(item.price), 0);
  }

  trackOrder(index: number, order: OrderDTO): number {
    return order.id ?? index;
  }
}
