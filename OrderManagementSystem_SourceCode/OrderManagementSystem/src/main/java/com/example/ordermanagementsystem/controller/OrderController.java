package com.example.ordermanagementsystem.controller;

import com.example.ordermanagementsystem.dto.OrderDTO;
import com.example.ordermanagementsystem.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService service;
    public OrderController(OrderService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDTO create(@RequestBody OrderDTO dto) { return service.createOrder(dto); }

    @GetMapping
    public List<OrderDTO> getAll() { return service.getAllOrders(); }

    @GetMapping("/{id}")
    public OrderDTO getById(@PathVariable Long id) { return service.getOrderById(id); }

    @PutMapping("/{id}")
    public OrderDTO update(@PathVariable Long id, @RequestBody OrderDTO dto) {
        return service.updateOrder(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.deleteOrder(id); }
}
