package com.example.ordermanagementsystem.service;

import com.example.ordermanagementsystem.dto.OrderDTO;
import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO dto);
    List<OrderDTO> getAllOrders();
    OrderDTO getOrderById(Long id);
    OrderDTO updateOrder(Long id, OrderDTO dto);
    void deleteOrder(Long id);
}
