package com.example.ordermanagementsystem.service.impl;

import com.example.ordermanagementsystem.dto.OrderDTO;
import com.example.ordermanagementsystem.dto.OrderDetailDTO;
import com.example.ordermanagementsystem.entity.Order;
import com.example.ordermanagementsystem.entity.OrderDetail;
import com.example.ordermanagementsystem.repository.OrderRepository;
import com.example.ordermanagementsystem.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    private final OrderRepository repository;

    public OrderServiceImpl(OrderRepository repository) {
        this.repository = repository;
    }

    @Override
    public OrderDTO createOrder(OrderDTO dto) {
        Order order = toEntity(dto);
        return toDTO(repository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        return toDTO(findOrder(id));
    }

    @Override
    public OrderDTO updateOrder(Long id, OrderDTO dto) {
        Order order = findOrder(id);
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerEmail(dto.getCustomerEmail());

        // Existing child IDs are updated; children omitted from the DTO are removed.
        List<OrderDetail> existing = List.copyOf(order.getOrderDetails());
        for (OrderDetail old : existing) {
            boolean included = dto.getOrderDetails() != null && dto.getOrderDetails().stream()
                    .anyMatch(d -> d.getId() != null && d.getId().equals(old.getId()));
            if (!included) order.removeDetail(old);
        }
        if (dto.getOrderDetails() != null) {
            for (OrderDetailDTO detailDTO : dto.getOrderDetails()) {
                if (detailDTO.getId() == null) {
                    order.addDetail(toDetailEntity(detailDTO));
                } else {
                    OrderDetail detail = order.getOrderDetails().stream()
                            .filter(d -> d.getId().equals(detailDTO.getId()))
                            .findFirst()
                            .orElseThrow(() -> new IllegalArgumentException(
                                    "OrderDetail id " + detailDTO.getId() + " does not belong to order " + id));
                    detail.setProductName(detailDTO.getProductName());
                    detail.setQuantity(detailDTO.getQuantity());
                    detail.setPrice(detailDTO.getPrice());
                }
            }
        }
        return toDTO(repository.save(order));
    }

    @Override
    public void deleteOrder(Long id) {
        repository.delete(findOrder(id));
    }

    private Order findOrder(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + id));
    }

    private Order toEntity(OrderDTO dto) {
        Order order = new Order();
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerEmail(dto.getCustomerEmail());
        if (dto.getOrderDetails() != null) {
            for (OrderDetailDTO detailDTO : dto.getOrderDetails()) {
                order.addDetail(toDetailEntity(detailDTO));
            }
        }
        return order;
    }

    private OrderDetail toDetailEntity(OrderDetailDTO dto) {
        OrderDetail detail = new OrderDetail();
        detail.setProductName(dto.getProductName());
        detail.setQuantity(dto.getQuantity());
        detail.setPrice(dto.getPrice());
        return detail;
    }

    private OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setCustomerName(order.getCustomerName());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setOrderDetails(order.getOrderDetails().stream().map(detail -> {
            OrderDetailDTO d = new OrderDetailDTO();
            d.setId(detail.getId());
            d.setProductName(detail.getProductName());
            d.setQuantity(detail.getQuantity());
            d.setPrice(detail.getPrice());
            return d;
        }).toList());
        return dto;
    }
}
