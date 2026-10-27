export interface OrderDetailDTO {
  id?: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderDTO {
  id?: number;
  customerName: string;
  orderDate: string;
  orderDetails: OrderDetailDTO[];
}
