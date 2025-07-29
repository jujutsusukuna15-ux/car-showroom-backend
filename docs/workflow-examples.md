# Vehicle Dealership Management System - Workflow Examples

## Complete Business Workflow Examples

### Example 1: Vehicle Purchase and Repair Flow

#### Step 1: Customer Brings Vehicle for Sale
**Actor:** Cashier
```bash
# 1. Create customer if new
POST /customers
{
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "type": "individual"
}
# Response: Customer ID = 123

# 2. Create vehicle record
POST /vehicles
{
  "chassis_number": "ABC123456789",
  "license_plate": "XYZ-123",
  "brand": "Toyota",
  "model": "Camry",
  "year": 2018,
  "mileage": 45000,
  "purchase_price": 15000,
  "purchased_from_customer_id": 123,
  "condition_notes": "Good condition, minor scratches on rear bumper"
}
# Response: Vehicle ID = 456, Status = "purchased"

# 3. Create purchase transaction
POST /transactions/purchases
{
  "vehicle_id": 456,
  "customer_id": 123,
  "vehicle_price": 15000,
  "payment_method": "transfer",
  "payment_reference": "TXN789456123"
}
```

#### Step 2: Vehicle Needs Repairs
**Actor:** Mechanic
```bash
# 1. Create repair work order
POST /repairs
{
  "vehicle_id": 456,
  "title": "Engine tune-up and brake replacement",
  "description": "Replace brake pads, oil change, spark plugs",
  "labor_cost": 500
}
# Response: Repair ID = 789, Vehicle status automatically changed to "in_repair"

# 2. Start repair work
PUT /repairs/789
{
  "status": "in_progress",
  "work_notes": "Started brake inspection"
}

# 3. Add spare parts to repair
POST /repairs/parts
{
  "repair_id": 789,
  "spare_part_id": 101,  # Brake pads
  "quantity_used": 4,
  "notes": "Front and rear brake pads"
}

POST /repairs/parts
{
  "repair_id": 789,
  "spare_part_id": 102,  # Engine oil
  "quantity_used": 1,
  "notes": "5W-30 synthetic oil"
}

# 4. Complete repair
PUT /repairs/789
{
  "status": "completed",
  "work_notes": "All repairs completed successfully. Vehicle ready for sale."
}
# Vehicle status automatically changed to "ready_to_sell"
```

#### Step 3: Price Approval
**Actor:** Admin
```bash
# 1. Cashier suggests selling price
PUT /vehicles/456
{
  "suggested_selling_price": 18500
}

# 2. Admin approves selling price
PUT /vehicles/456
{
  "approved_selling_price": 18000
}
# Vehicle now ready for sale with approved price
```

#### Step 4: Vehicle Sale
**Actor:** Cashier
```bash
# 1. Create new customer for buyer
POST /customers
{
  "name": "Jane Smith",
  "phone": "+1987654321",
  "email": "jane@example.com",
  "type": "individual"
}
# Response: Customer ID = 124

# 2. Create sales transaction
POST /transactions/sales
{
  "vehicle_id": 456,
  "customer_id": 124,
  "vehicle_price": 18000,
  "discount_amount": 500,
  "payment_method": "cash"
}
# Vehicle status automatically changed to "sold"
```

### Example 2: Daily Operations Flow

#### Morning Routine - Cashier
```bash
# 1. Check daily overview
GET /reports/business-overview

# 2. Review pending price approvals
GET /vehicles?status=ready_to_sell

# 3. Check low stock alerts
GET /spare-parts/low-stock
```

#### Morning Routine - Mechanic
```bash
# 1. Check assigned repairs
GET /repairs?mechanic_id=<my_id>&status=pending

# 2. Check in-progress repairs
GET /repairs?mechanic_id=<my_id>&status=in_progress

# 3. Check parts availability
GET /spare-parts?low_stock=true
```

#### Morning Routine - Admin
```bash
# 1. Review business overview
GET /reports/business-overview

# 2. Check pending approvals
GET /vehicles?status=ready_to_sell
# Filter for vehicles with suggested_selling_price but no approved_selling_price

# 3. Review daily report
GET /reports/daily

# 4. Check user activity (audit logs)
# This would be a custom endpoint to view recent audit logs
```

### Example 3: Monthly Reporting Flow

#### Month-End Reports - Admin
```bash
# 1. Generate monthly business report
GET /reports/monthly?year=2024&month=3

# 2. Analyze vehicle profitability
GET /reports/vehicle-profitability?sort_by=profit&order=DESC&limit=20

# 3. Check top performing models
GET /reports/top-performing-models?limit=10

# 4. Review weekly trends
GET /reports/weekly?week_start=2024-03-01
GET /reports/weekly?week_start=2024-03-08
GET /reports/weekly?week_start=2024-03-15
GET /reports/weekly?week_start=2024-03-22
```

### Example 4: Inventory Management Flow

#### Stock Replenishment - Admin
```bash
# 1. Check low stock alerts
GET /spare-parts/low-stock

# 2. Adjust stock after receiving new parts
POST /spare-parts/adjust-stock
{
  "spare_part_id": 101,
  "new_quantity": 50,
  "notes": "Received new shipment from supplier ABC"
}

# 3. Create new spare part if needed
POST /spare-parts
{
  "name": "Premium Brake Disc",
  "brand": "Brembo",
  "cost_price": 120,
  "selling_price": 180,
  "stock_quantity": 20,
  "min_stock_level": 5
}
```

### Example 5: User Management Flow

#### New Employee Onboarding - Admin
```bash
# 1. Create new user account
POST /auth/users
{
  "username": "mike_mechanic",
  "email": "mike@dealership.com",
  "password": "SecurePassword123!",
  "full_name": "Mike Johnson",
  "phone": "+1555123456",
  "role": "mechanic"
}

# 2. Verify user can login
POST /auth/login
{
  "username": "mike_mechanic",
  "password": "SecurePassword123!"
}

# 3. Check user permissions by having them try to access different endpoints
```

## Error Handling Examples

### Common Error Scenarios

#### 1. Unauthorized Access
```bash
# Mechanic trying to create customer
POST /customers
Authorization: Bearer <mechanic_token>
{
  "name": "Test Customer",
  "type": "individual"
}

# Response: 403 Forbidden
{
  "code": "permission_denied",
  "message": "Access denied. Required roles: admin, cashier"
}
```

#### 2. Business Rule Violation
```bash
# Trying to sell vehicle without approved price
POST /transactions/sales
{
  "vehicle_id": 456,
  "customer_id": 124,
  "vehicle_price": 18000
}

# Response: 412 Precondition Failed
{
  "code": "failed_precondition",
  "message": "Vehicle price not approved yet"
}
```

#### 3. Insufficient Stock
```bash
# Trying to use more parts than available
POST /repairs/parts
{
  "repair_id": 789,
  "spare_part_id": 101,
  "quantity_used": 100
}

# Response: 412 Precondition Failed
{
  "code": "failed_precondition",
  "message": "Insufficient stock quantity"
}
```

## Performance Considerations

### Pagination Examples
```bash
# Large dataset pagination
GET /vehicles?page=1&limit=20
GET /transactions/sales?page=1&limit=50&start_date=2024-01-01&end_date=2024-03-31
```

### Search and Filtering
```bash
# Efficient vehicle search
GET /vehicles?search=toyota&status=ready_to_sell&brand=Toyota

# Customer search
GET /customers?search=john&type=individual

# Transaction filtering
GET /transactions/sales?start_date=2024-03-01&end_date=2024-03-31&cashier_id=123
```

## Security Best Practices

### Session Management
```bash
# Login and get token
POST /auth/login
{
  "username": "cashier1",
  "password": "password123"
}
# Response includes session_token

# Use token in subsequent requests
GET /customers
Authorization: Bearer <session_token>

# Logout when done
POST /auth/logout
Authorization: Bearer <session_token>
```

### Audit Trail Examples
- All financial transactions logged with user ID and timestamp
- Vehicle status changes tracked with responsible user
- Price approvals recorded with admin user ID
- Stock movements logged with processing user
- User creation and role changes audited
