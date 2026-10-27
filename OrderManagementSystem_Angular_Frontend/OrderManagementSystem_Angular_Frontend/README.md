# Angular Frontend — OrderManagementSystem

This Angular 17 standalone frontend calls the Spring Boot DTO backend at `http://localhost:8080/api/orders`.

## Requirements
- Node.js/npm installed
- Spring Boot backend running on port 8080
- PostgreSQL database configured in backend `application.properties`

## Run frontend
Open a terminal in this folder and run:
```bash
npm install
npm start
```
Open `http://localhost:4200`.

## Connect frontend to backend
1. Start PostgreSQL and your Spring Boot backend first.
2. In backend, add the code from `BACKEND_CORS_CONFIG.java.txt` as `config/CorsConfig.java`.
3. Confirm backend endpoints are `/api/orders` and `/api/orders/{id}` as in the supplied DTO project.
4. Restart backend.
5. Run this Angular app with `npm install` then `npm start`.

## What is included
- Order form with customer name and order date
- Add/remove order item rows
- Create, list, edit, delete orders
- Remove one saved order detail
- Angular service using HttpClient
- TypeScript DTO interfaces matching `OrderDTO` and `OrderDetailDTO`

## How data travels
Angular form -> `OrderService` HttpClient -> HTTP JSON request -> Spring Boot `OrderController` -> `OrderService` -> JPA Repository -> PostgreSQL.
Spring Boot response JSON returns to Angular and is displayed in the order list.

## API endpoints used
- `GET http://localhost:8080/api/orders`
- `GET http://localhost:8080/api/orders/{id}`
- `POST http://localhost:8080/api/orders`
- `PUT http://localhost:8080/api/orders/{id}`
- `DELETE http://localhost:8080/api/orders/{id}`
- `DELETE http://localhost:8080/api/orders/{orderId}/details/{detailId}`

## Important
The backend source provided earlier does not cascade REMOVE. If deleting a whole order fails because order details still reference it, update the backend deletion logic to remove its children first (within a transaction) or adjust the mapping/database strategy. The frontend will display an error message if the API rejects the request.
