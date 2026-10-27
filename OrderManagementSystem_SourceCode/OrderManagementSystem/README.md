# OrderManagementSystem (Spring Boot + DTO + PostgreSQL)

## Features
- `OrderDTO` and `OrderDetailDTO` separate API data from JPA entities.
- `OrderService` interface and `OrderServiceImpl` business logic.
- One `Order` has many `OrderDetail` rows.
- Parent collection uses `CascadeType.PERSIST`, `CascadeType.MERGE`, and `orphanRemoval = true`.
- CRUD REST APIs.

## Run in Eclipse
1. Create a PostgreSQL database named `orderdb`.
2. Edit `src/main/resources/application.properties` and set `spring.datasource.password` to your PostgreSQL password.
3. In Eclipse: File > Import > Existing Maven Projects, select this project folder.
4. Ensure Java 17 is selected, then Maven > Update Project.
5. Run `OrderManagementSystemApplication.java` as Spring Boot App.

## Tables
Hibernate creates `orders` and `order_details`. The `order_details.order_id` column is a foreign key to `orders.id`.

## APIs
Base URL: `http://localhost:8080/api/orders`

- `POST /api/orders` create an order and its details
- `GET /api/orders` get all orders
- `GET /api/orders/{id}` get one order
- `PUT /api/orders/{id}` update an order and its details
- `DELETE /api/orders/{id}` delete an order

### POST example
```json
{
  "customerName": "Janhavi",
  "customerEmail": "janhavi@example.com",
  "orderDetails": [
    { "productName": "Keyboard", "quantity": 2, "price": 799.0 },
    { "productName": "Mouse", "quantity": 1, "price": 399.0 }
  ]
}
```

### PUT example
Send the full desired order-details list. Existing child rows must include their `id` to update them. A child without `id` is inserted. Existing child rows omitted from the list are deleted because `orphanRemoval=true`.
```json
{
  "customerName": "Janhavi Ingale",
  "customerEmail": "janhavi@example.com",
  "orderDetails": [
    { "id": 1, "productName": "Keyboard", "quantity": 3, "price": 799.0 },
    { "productName": "USB Cable", "quantity": 1, "price": 199.0 }
  ]
}
```
Replace `id: 1` with the actual `order_details` row ID belonging to the order.

## Important
- Do not use `CascadeType.ALL`; only PERSIST and MERGE are configured.
- `orphanRemoval=true` deletes a detail row when it is removed from the order's collection during an update.
- Deleting the parent through `repository.delete` does not cascade REMOVE because REMOVE is not configured. If the database foreign key blocks deleting an order with details, explicitly delete child rows first or choose a different deletion policy. This project intentionally avoids `CascadeType.REMOVE` to match the requested cascade settings.
