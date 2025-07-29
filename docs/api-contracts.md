# Vehicle Dealership Management System - API Contracts

## Authentication Service

### POST /auth/users
Creates a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "full_name": "string",
  "phone": "string (optional)",
  "role": "admin | mechanic | cashier"
}
```

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "full_name": "string", 
  "phone": "string",
  "role": "admin | mechanic | cashier",
  "is_active": "boolean",
  "created_at": "Date",
  "updated_at": "Date"
}
```

### GET /auth/users
Retrieves all users with optional filtering.

**Query Parameters:**
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 50)
- `role`: string (optional)
- `is_active`: boolean (optional)

**Response:**
```json
{
  "users": [
    {
      "id": "number",
      "username": "string",
      "email": "string",
      "full_name": "string",
      "phone": "string",
      "role": "admin | mechanic | cashier",
      "is_active": "boolean",
      "created_at": "Date",
      "updated_at": "Date"
    }
  ],
  "total": "number"
}
```

### POST /auth/login
Authenticates a user and creates a session.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "full_name": "string",
    "phone": "string",
    "role": "admin | mechanic | cashier",
    "is_active": "boolean",
    "created_at": "Date",
    "updated_at": "Date"
  },
  "session_token": "string"
}
```

### POST /auth/logout
Logs out a user by invalidating their session.

**Headers:**
- `Authorization`: Bearer {token}

**Response:** 204 No Content

## Customers Service

### POST /customers
Creates a new customer record.

**Request Body:**
```json
{
  "name": "string",
  "phone": "string (optional)",
  "email": "string (optional)",
  "address": "string (optional)",
  "id_card_number": "string (optional)",
  "type": "individual | corporate"
}
```

**Response:**
```json
{
  "id": "number",
  "customer_code": "string",
  "name": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "id_card_number": "string",
  "type": "individual | corporate",
  "created_at": "Date",
  "updated_at": "Date",
  "created_by": "number",
  "is_active": "boolean"
}
```

### GET /customers
Retrieves all customers with optional filtering and search.

**Query Parameters:**
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 50)
- `type`: "individual | corporate" (optional)
- `search`: string (optional)

**Response:**
```json
{
  "customers": [
    {
      "id": "number",
      "customer_code": "string",
      "name": "string",
      "phone": "string",
      "email": "string",
      "address": "string",
      "id_card_number": "string",
      "type": "individual | corporate",
      "created_at": "Date",
      "updated_at": "Date",
      "created_by": "number",
      "is_active": "boolean"
    }
  ],
  "total": "number"
}
```

### GET /customers/:id
Retrieves a specific customer by ID.

**Path Parameters:**
- `id`: number

**Response:**
```json
{
  "id": "number",
  "customer_code": "string",
  "name": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "id_card_number": "string",
  "type": "individual | corporate",
  "created_at": "Date",
  "updated_at": "Date",
  "created_by": "number",
  "is_active": "boolean"
}
```

### PUT /customers/:id
Updates an existing customer record.

**Path Parameters:**
- `id`: number

**Request Body:**
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)",
  "address": "string (optional)",
  "id_card_number": "string (optional)",
  "type": "individual | corporate (optional)",
  "is_active": "boolean (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "customer_code": "string",
  "name": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "id_card_number": "string",
  "type": "individual | corporate",
  "created_at": "Date",
  "updated_at": "Date",
  "created_by": "number",
  "is_active": "boolean"
}
```

## Vehicles Service

### POST /vehicles
Creates a new vehicle record.

**Request Body:**
```json
{
  "chassis_number": "string",
  "license_plate": "string (optional)",
  "brand": "string",
  "model": "string",
  "variant": "string (optional)",
  "year": "number",
  "color": "string (optional)",
  "mileage": "number (optional)",
  "fuel_type": "gasoline | diesel | electric | hybrid (optional)",
  "transmission": "manual | automatic | cvt (optional)",
  "purchase_price": "number (optional)",
  "purchased_from_customer_id": "number (optional)",
  "purchase_notes": "string (optional)",
  "condition_notes": "string (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "vehicle_code": "string",
  "chassis_number": "string",
  "license_plate": "string",
  "brand": "string",
  "model": "string",
  "variant": "string",
  "year": "number",
  "color": "string",
  "mileage": "number",
  "fuel_type": "gasoline | diesel | electric | hybrid",
  "transmission": "manual | automatic | cvt",
  "purchase_price": "number",
  "total_repair_cost": "number",
  "suggested_selling_price": "number",
  "approved_selling_price": "number",
  "final_selling_price": "number",
  "status": "purchased | in_repair | ready_to_sell | reserved | sold",
  "purchased_from_customer_id": "number",
  "sold_to_customer_id": "number",
  "purchased_by_cashier": "number",
  "sold_by_cashier": "number",
  "price_approved_by_admin": "number",
  "purchased_at": "Date",
  "sold_at": "Date",
  "created_at": "Date",
  "updated_at": "Date",
  "purchase_notes": "string",
  "condition_notes": "string"
}
```

### GET /vehicles
Retrieves all vehicles with optional filtering and search.

**Query Parameters:**
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 50)
- `status`: "purchased | in_repair | ready_to_sell | reserved | sold" (optional)
- `brand`: string (optional)
- `search`: string (optional)

**Response:**
```json
{
  "vehicles": [
    {
      "id": "number",
      "vehicle_code": "string",
      "chassis_number": "string",
      "license_plate": "string",
      "brand": "string",
      "model": "string",
      "variant": "string",
      "year": "number",
      "color": "string",
      "mileage": "number",
      "fuel_type": "gasoline | diesel | electric | hybrid",
      "transmission": "manual | automatic | cvt",
      "purchase_price": "number",
      "total_repair_cost": "number",
      "suggested_selling_price": "number",
      "approved_selling_price": "number",
      "final_selling_price": "number",
      "status": "purchased | in_repair | ready_to_sell | reserved | sold",
      "purchased_from_customer_id": "number",
      "sold_to_customer_id": "number",
      "purchased_by_cashier": "number",
      "sold_by_cashier": "number",
      "price_approved_by_admin": "number",
      "purchased_at": "Date",
      "sold_at": "Date",
      "created_at": "Date",
      "updated_at": "Date",
      "purchase_notes": "string",
      "condition_notes": "string"
    }
  ],
  "total": "number"
}
```

### GET /vehicles/:id
Retrieves a specific vehicle with its images.

**Path Parameters:**
- `id`: number

**Response:**
```json
{
  "vehicle": {
    "id": "number",
    "vehicle_code": "string",
    "chassis_number": "string",
    "license_plate": "string",
    "brand": "string",
    "model": "string",
    "variant": "string",
    "year": "number",
    "color": "string",
    "mileage": "number",
    "fuel_type": "gasoline | diesel | electric | hybrid",
    "transmission": "manual | automatic | cvt",
    "purchase_price": "number",
    "total_repair_cost": "number",
    "suggested_selling_price": "number",
    "approved_selling_price": "number",
    "final_selling_price": "number",
    "status": "purchased | in_repair | ready_to_sell | reserved | sold",
    "purchased_from_customer_id": "number",
    "sold_to_customer_id": "number",
    "purchased_by_cashier": "number",
    "sold_by_cashier": "number",
    "price_approved_by_admin": "number",
    "purchased_at": "Date",
    "sold_at": "Date",
    "created_at": "Date",
    "updated_at": "Date",
    "purchase_notes": "string",
    "condition_notes": "string"
  },
  "images": [
    {
      "id": "number",
      "vehicle_id": "number",
      "image_path": "string",
      "image_type": "front | back | left | right | interior | engine | dashboard | damage | other",
      "description": "string",
      "is_primary": "boolean",
      "uploaded_at": "Date",
      "uploaded_by": "number"
    }
  ]
}
```

### PUT /vehicles/:id
Updates an existing vehicle record.

**Path Parameters:**
- `id`: number

**Request Body:**
```json
{
  "license_plate": "string (optional)",
  "brand": "string (optional)",
  "model": "string (optional)",
  "variant": "string (optional)",
  "year": "number (optional)",
  "color": "string (optional)",
  "mileage": "number (optional)",
  "fuel_type": "gasoline | diesel | electric | hybrid (optional)",
  "transmission": "manual | automatic | cvt (optional)",
  "status": "purchased | in_repair | ready_to_sell | reserved | sold (optional)",
  "suggested_selling_price": "number (optional)",
  "approved_selling_price": "number (optional)",
  "final_selling_price": "number (optional)",
  "condition_notes": "string (optional)"
}
```

**Response:** Same as vehicle object above

### POST /vehicles/images
Uploads an image for a vehicle.

**Request Body:**
```json
{
  "vehicle_id": "number",
  "image_type": "front | back | left | right | interior | engine | dashboard | damage | other",
  "description": "string (optional)",
  "is_primary": "boolean (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "vehicle_id": "number",
  "image_path": "string",
  "image_type": "front | back | left | right | interior | engine | dashboard | damage | other",
  "description": "string",
  "is_primary": "boolean",
  "uploaded_at": "Date",
  "uploaded_by": "number"
}
```

## Spare Parts Service

### POST /spare-parts
Creates a new spare part record.

**Request Body:**
```json
{
  "name": "string",
  "description": "string (optional)",
  "brand": "string (optional)",
  "cost_price": "number",
  "selling_price": "number",
  "stock_quantity": "number (optional, default: 0)",
  "min_stock_level": "number (optional, default: 0)",
  "unit_measure": "string (optional, default: 'pcs')"
}
```

**Response:**
```json
{
  "id": "number",
  "part_code": "string",
  "name": "string",
  "description": "string",
  "brand": "string",
  "cost_price": "number",
  "selling_price": "number",
  "stock_quantity": "number",
  "min_stock_level": "number",
  "unit_measure": "string",
  "created_at": "Date",
  "updated_at": "Date",
  "is_active": "boolean"
}
```

### GET /spare-parts
Retrieves all spare parts with optional filtering.

**Query Parameters:**
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 50)
- `search`: string (optional)
- `brand`: string (optional)
- `low_stock`: boolean (optional)

**Response:**
```json
{
  "spare_parts": [
    {
      "id": "number",
      "part_code": "string",
      "name": "string",
      "description": "string",
      "brand": "string",
      "cost_price": "number",
      "selling_price": "number",
      "stock_quantity": "number",
      "min_stock_level": "number",
      "unit_measure": "string",
      "created_at": "Date",
      "updated_at": "Date",
      "is_active": "boolean"
    }
  ],
  "total": "number"
}
```

### GET /spare-parts/low-stock
Retrieves spare parts with low stock levels.

**Response:**
```json
{
  "alerts": [
    {
      "spare_part": {
        "id": "number",
        "part_code": "string",
        "name": "string",
        "description": "string",
        "brand": "string",
        "cost_price": "number",
        "selling_price": "number",
        "stock_quantity": "number",
        "min_stock_level": "number",
        "unit_measure": "string",
        "created_at": "Date",
        "updated_at": "Date",
        "is_active": "boolean"
      },
      "current_stock": "number",
      "min_level": "number"
    }
  ],
  "total": "number"
}
```

### POST /spare-parts/adjust-stock
Adjusts the stock quantity of a spare part.

**Request Body:**
```json
{
  "spare_part_id": "number",
  "new_quantity": "number",
  "notes": "string (optional)"
}
```

**Response:** Same as spare part object above

## Repairs Service

### POST /repairs
Creates a new repair work order.

**Request Body:**
```json
{
  "vehicle_id": "number",
  "title": "string",
  "description": "string (optional)",
  "labor_cost": "number (optional, default: 0)"
}
```

**Response:**
```json
{
  "id": "number",
  "repair_number": "string",
  "vehicle_id": "number",
  "title": "string",
  "description": "string",
  "labor_cost": "number",
  "total_parts_cost": "number",
  "total_cost": "number",
  "status": "pending | in_progress | completed | cancelled",
  "mechanic_id": "number",
  "started_at": "Date",
  "completed_at": "Date",
  "created_at": "Date",
  "work_notes": "string"
}
```

### GET /repairs
Retrieves all repairs with optional filtering.

**Query Parameters:**
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 50)
- `status`: "pending | in_progress | completed | cancelled" (optional)
- `vehicle_id`: number (optional)
- `mechanic_id`: number (optional)

**Response:**
```json
{
  "repairs": [
    {
      "id": "number",
      "repair_number": "string",
      "vehicle_id": "number",
      "title": "string",
      "description": "string",
      "labor_cost": "number",
      "total_parts_cost": "number",
      "total_cost": "number",
      "status": "pending | in_progress | completed | cancelled",
      "mechanic_id": "number",
      "started_at": "Date",
      "completed_at": "Date",
      "created_at": "Date",
      "work_notes": "string"
    }
  ],
  "total": "number"
}
```

### GET /repairs/:id
Retrieves a specific repair with its parts.

**Path Parameters:**
- `id`: number

**Response:**
```json
{
  "repair": {
    "id": "number",
    "repair_number": "string",
    "vehicle_id": "number",
    "title": "string",
    "description": "string",
    "labor_cost": "number",
    "total_parts_cost": "number",
    "total_cost": "number",
    "status": "pending | in_progress | completed | cancelled",
    "mechanic_id": "number",
    "started_at": "Date",
    "completed_at": "Date",
    "created_at": "Date",
    "work_notes": "string"
  },
  "parts": [
    {
      "id": "number",
      "repair_id": "number",
      "spare_part_id": "number",
      "quantity_used": "number",
      "unit_cost": "number",
      "total_cost": "number",
      "used_at": "Date",
      "notes": "string",
      "part_name": "string",
      "part_code": "string"
    }
  ]
}
```

### PUT /repairs/:id
Updates an existing repair work order.

**Path Parameters:**
- `id`: number

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "labor_cost": "number (optional)",
  "status": "pending | in_progress | completed | cancelled (optional)",
  "mechanic_id": "number (optional)",
  "work_notes": "string (optional)"
}
```

**Response:** Same as repair object above

### POST /repairs/parts
Adds a spare part to a repair work order.

**Request Body:**
```json
{
  "repair_id": "number",
  "spare_part_id": "number",
  "quantity_used": "number",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "repair_id": "number",
  "spare_part_id": "number",
  "quantity_used": "number",
  "unit_cost": "number",
  "total_cost": "number",
  "used_at": "Date",
  "notes": "string"
}
```

## Transactions Service

### POST /transactions/purchases
Creates a new purchase transaction (buying vehicle from customer).

**Request Body:**
```json
{
  "vehicle_id": "number",
  "customer_id": "number",
  "vehicle_price": "number",
  "tax_rate": "number (optional, default: 0.1)",
  "payment_method": "cash | transfer | check",
  "payment_reference": "string (optional)",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "transaction_number": "string",
  "invoice_number": "string",
  "vehicle_id": "number",
  "customer_id": "number",
  "vehicle_price": "number",
  "tax_amount": "number",
  "total_amount": "number",
  "payment_method": "cash | transfer | check",
  "payment_reference": "string",
  "transaction_date": "Date",
  "cashier_id": "number",
  "status": "completed | cancelled",
  "notes": "string",
  "created_at": "Date"
}
```

### POST /transactions/sales
Creates a new sales transaction (selling vehicle to customer).

**Request Body:**
```json
{
  "vehicle_id": "number",
  "customer_id": "number",
  "vehicle_price": "number",
  "tax_rate": "number (optional, default: 0.1)",
  "discount_amount": "number (optional, default: 0)",
  "payment_method": "cash | transfer | check | credit",
  "payment_reference": "string (optional)",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "transaction_number": "string",
  "invoice_number": "string",
  "vehicle_id": "number",
  "customer_id": "number",
  "vehicle_price": "number",
  "tax_amount": "number",
  "discount_amount": "number",
  "total_amount": "number",
  "payment_method": "cash | transfer | check | credit",
  "payment_reference": "string",
  "transaction_date": "Date",
  "cashier_id": "number",
  "status": "completed | cancelled",
  "notes": "string",
  "created_at": "Date"
}
```

### GET /transactions/purchases
Retrieves all purchase transactions with optional filtering.

**Query Parameters:**
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 50)
- `start_date`: string (optional)
- `end_date`: string (optional)
- `customer_id`: number (optional)
- `cashier_id`: number (optional)

**Response:**
```json
{
  "transactions": [
    {
      "id": "number",
      "transaction_number": "string",
      "invoice_number": "string",
      "vehicle_id": "number",
      "customer_id": "number",
      "vehicle_price": "number",
      "tax_amount": "number",
      "total_amount": "number",
      "payment_method": "cash | transfer | check",
      "payment_reference": "string",
      "transaction_date": "Date",
      "cashier_id": "number",
      "status": "completed | cancelled",
      "notes": "string",
      "created_at": "Date"
    }
  ],
  "total": "number"
}
```

### GET /transactions/sales
Retrieves all sales transactions with optional filtering.

**Query Parameters:**
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 50)
- `start_date`: string (optional)
- `end_date`: string (optional)
- `customer_id`: number (optional)
- `cashier_id`: number (optional)

**Response:**
```json
{
  "transactions": [
    {
      "id": "number",
      "transaction_number": "string",
      "invoice_number": "string",
      "vehicle_id": "number",
      "customer_id": "number",
      "vehicle_price": "number",
      "tax_amount": "number",
      "discount_amount": "number",
      "total_amount": "number",
      "payment_method": "cash | transfer | check | credit",
      "payment_reference": "string",
      "transaction_date": "Date",
      "cashier_id": "number",
      "status": "completed | cancelled",
      "notes": "string",
      "created_at": "Date"
    }
  ],
  "total": "number"
}
```

## Reports Service

### GET /reports/business-overview
Provides a comprehensive business overview dashboard.

**Response:**
```json
{
  "total_vehicles_in_stock": "number",
  "total_vehicles_sold": "number",
  "total_revenue": "number",
  "total_profit": "number",
  "average_profit_margin": "number",
  "pending_repairs": "number",
  "low_stock_parts": "number"
}
```

### GET /reports/daily
Generates a daily transaction and profit report.

**Query Parameters:**
- `date`: string (optional, default: today)

**Response:**
```json
{
  "date": "string",
  "total_purchases": "number",
  "total_sales": "number",
  "total_purchase_amount": "number",
  "total_sales_amount": "number",
  "profit": "number",
  "transaction_count": "number"
}
```

### GET /reports/weekly
Generates a weekly business summary report.

**Query Parameters:**
- `week_start`: string (optional, default: 7 days ago)

**Response:**
```json
{
  "week_start": "string",
  "week_end": "string",
  "vehicles_bought": "number",
  "vehicles_sold": "number",
  "total_profit": "number",
  "best_performing_vehicle": "string",
  "total_repair_costs": "number"
}
```

### GET /reports/monthly
Generates a comprehensive monthly business report.

**Query Parameters:**
- `year`: number (optional, default: current year)
- `month`: number (optional, default: current month)

**Response:**
```json
{
  "month": "string",
  "year": "number",
  "revenue": "number",
  "costs": "number",
  "profit": "number",
  "vehicles_sold": "number",
  "customer_acquisition": "number",
  "mechanic_productivity": "number"
}
```

### GET /reports/vehicle-profitability
Analyzes profitability of sold vehicles.

**Query Parameters:**
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 50)
- `sort_by`: string (optional, default: "profit")
- `order`: string (optional, default: "DESC")

**Response:**
```json
{
  "vehicles": [
    {
      "id": "number",
      "vehicle_code": "string",
      "brand": "string",
      "model": "string",
      "year": "number",
      "purchase_price": "number",
      "total_repair_cost": "number",
      "final_selling_price": "number",
      "total_cost": "number",
      "profit": "number",
      "profit_margin_percentage": "number",
      "purchased_at": "Date",
      "sold_at": "Date",
      "days_to_sell": "number"
    }
  ],
  "total": "number"
}
```

### GET /reports/top-performing-models
Identifies the best performing vehicle models by profit and sales.

**Query Parameters:**
- `limit`: number (optional, default: 10)

**Response:**
```json
{
  "models": [
    {
      "brand": "string",
      "model": "string",
      "vehicles_sold": "number",
      "total_profit": "number",
      "average_profit": "number",
      "average_days_to_sell": "number"
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "code": "invalid_argument",
  "message": "Error description",
  "details": null
}
```

### 401 Unauthorized
```json
{
  "code": "unauthenticated", 
  "message": "Authentication required",
  "details": null
}
```

### 403 Forbidden
```json
{
  "code": "permission_denied",
  "message": "Access denied",
  "details": null
}
```

### 404 Not Found
```json
{
  "code": "not_found",
  "message": "Resource not found",
  "details": null
}
```

### 409 Conflict
```json
{
  "code": "already_exists",
  "message": "Resource already exists",
  "details": null
}
```

### 412 Precondition Failed
```json
{
  "code": "failed_precondition",
  "message": "Precondition failed",
  "details": null
}
```

### 429 Too Many Requests
```json
{
  "code": "resource_exhausted",
  "message": "Rate limit exceeded",
  "details": {
    "retry_after": "60s"
  }
}
```

### 500 Internal Server Error
```json
{
  "code": "internal",
  "message": "Internal server error",
  "details": null
}
```
