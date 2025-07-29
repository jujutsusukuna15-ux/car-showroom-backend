# Vehicle Dealership Management System - Role-Based Access Control

## User Roles Overview

### 1. Admin
**Full system access with management capabilities**
- Complete CRUD operations on all entities
- User management and role assignment
- Price approval authority
- System configuration and reports access
- Can override any business rules when necessary

### 2. Cashier
**Transaction and customer management focused**
- Customer management (create, read, update)
- Vehicle purchase and sales transactions
- Basic vehicle information management
- Transaction reports and daily summaries
- Cannot approve vehicle selling prices

### 3. Mechanic
**Repair and maintenance operations**
- Vehicle repair management
- Spare parts usage tracking
- Vehicle condition updates
- Repair status management
- Cannot access financial transactions or customer data

## Role-Based Endpoint Access Matrix

### Authentication Service
| Endpoint | Admin | Cashier | Mechanic | Notes |
|----------|-------|---------|----------|-------|
| POST /auth/users | ✅ | ❌ | ❌ | Only admin can create users |
| GET /auth/users | ✅ | ❌ | ❌ | Only admin can list users |
| POST /auth/login | ✅ | ✅ | ✅ | All roles can login |
| POST /auth/logout | ✅ | ✅ | ✅ | All roles can logout |

### Customers Service
| Endpoint | Admin | Cashier | Mechanic | Notes |
|----------|-------|---------|----------|-------|
| POST /customers | ✅ | ✅ | ❌ | Admin and cashier can create customers |
| GET /customers | ✅ | ✅ | ❌ | Admin and cashier can view customers |
| GET /customers/:id | ✅ | ✅ | ❌ | Admin and cashier can view customer details |
| PUT /customers/:id | ✅ | ✅ | ❌ | Admin and cashier can update customers |

### Vehicles Service
| Endpoint | Admin | Cashier | Mechanic | Notes |
|----------|-------|---------|----------|-------|
| POST /vehicles | ✅ | ✅ | ❌ | Admin and cashier can add vehicles |
| GET /vehicles | ✅ | ✅ | ✅ | All roles can view vehicles |
| GET /vehicles/:id | ✅ | ✅ | ✅ | All roles can view vehicle details |
| PUT /vehicles/:id | ✅ | ✅ | ✅* | *Mechanic limited to condition/status updates |
| POST /vehicles/images | ✅ | ✅ | ✅ | All roles can upload vehicle images |

### Spare Parts Service
| Endpoint | Admin | Cashier | Mechanic | Notes |
|----------|-------|---------|----------|-------|
| POST /spare-parts | ✅ | ❌ | ❌ | Only admin can create spare parts |
| GET /spare-parts | ✅ | ✅ | ✅ | All roles can view spare parts |
| GET /spare-parts/low-stock | ✅ | ✅ | ✅ | All roles can view stock alerts |
| POST /spare-parts/adjust-stock | ✅ | ❌ | ❌ | Only admin can adjust stock manually |

### Repairs Service
| Endpoint | Admin | Cashier | Mechanic | Notes |
|----------|-------|---------|----------|-------|
| POST /repairs | ✅ | ❌ | ✅ | Admin and mechanic can create repairs |
| GET /repairs | ✅ | ✅ | ✅ | All roles can view repairs |
| GET /repairs/:id | ✅ | ✅ | ✅ | All roles can view repair details |
| PUT /repairs/:id | ✅ | ❌ | ✅ | Admin and mechanic can update repairs |
| POST /repairs/parts | ✅ | ❌ | ✅ | Admin and mechanic can add parts to repairs |

### Transactions Service
| Endpoint | Admin | Cashier | Mechanic | Notes |
|----------|-------|---------|----------|-------|
| POST /transactions/purchases | ✅ | ✅ | ❌ | Admin and cashier can create purchase transactions |
| POST /transactions/sales | ✅ | ✅ | ❌ | Admin and cashier can create sales transactions |
| GET /transactions/purchases | ✅ | ✅ | ❌ | Admin and cashier can view purchase transactions |
| GET /transactions/sales | ✅ | ✅ | ❌ | Admin and cashier can view sales transactions |

### Reports Service
| Endpoint | Admin | Cashier | Mechanic | Notes |
|----------|-------|---------|----------|-------|
| GET /reports/business-overview | ✅ | ✅* | ❌ | *Cashier sees limited financial data |
| GET /reports/daily | ✅ | ✅ | ❌ | Admin and cashier can view daily reports |
| GET /reports/weekly | ✅ | ✅ | ❌ | Admin and cashier can view weekly reports |
| GET /reports/monthly | ✅ | ❌ | ❌ | Only admin can view monthly reports |
| GET /reports/vehicle-profitability | ✅ | ❌ | ❌ | Only admin can view profitability analysis |
| GET /reports/top-performing-models | ✅ | ❌ | ❌ | Only admin can view performance analysis |

## Business Workflow

### 1. Vehicle Purchase Flow
```
1. Customer brings vehicle to dealership
2. Cashier creates customer record (if new)
3. Cashier creates vehicle record with purchase details
4. Cashier creates purchase transaction
5. Vehicle status: "purchased"
6. If repairs needed → Vehicle status: "in_repair"
```

**Required Roles:** Cashier (or Admin)

### 2. Vehicle Repair Flow
```
1. Mechanic creates repair work order
2. Mechanic adds required spare parts
3. Mechanic updates repair status to "in_progress"
4. Mechanic performs repairs and updates work notes
5. Mechanic marks repair as "completed"
6. Vehicle status automatically updated to "ready_to_sell"
```

**Required Roles:** Mechanic (or Admin)

### 3. Price Approval Flow
```
1. Cashier suggests selling price for vehicle
2. Admin reviews and approves selling price
3. Vehicle becomes available for sale
4. Vehicle status: "ready_to_sell"
```

**Required Roles:** 
- Cashier: Suggest price
- Admin: Approve price

### 4. Vehicle Sales Flow
```
1. Customer interested in vehicle
2. Cashier creates customer record (if new)
3. Cashier creates sales transaction
4. Vehicle status updated to "sold"
5. Vehicle marked as sold to customer
```

**Required Roles:** Cashier (or Admin)

### 5. Inventory Management Flow
```
1. Admin creates spare parts in system
2. Admin sets minimum stock levels
3. Mechanic uses parts during repairs
4. System automatically tracks stock movements
5. System alerts when stock is low
6. Admin adjusts stock when new parts arrive
```

**Required Roles:**
- Admin: Create parts, adjust stock
- Mechanic: Use parts in repairs
- All: View stock alerts

## Role-Specific Dashboards

### Admin Dashboard
- Complete business overview
- Financial reports and profitability analysis
- User management
- System configuration
- All pending approvals (price approvals, etc.)

### Cashier Dashboard
- Daily transaction summary
- Customer management
- Vehicle inventory (available for sale)
- Pending price approvals
- Basic financial metrics

### Mechanic Dashboard
- Assigned repair work orders
- Pending repairs
- Parts inventory and low stock alerts
- Repair history and notes
- Vehicle condition tracking

## Data Access Restrictions

### Financial Data
- **Admin**: Full access to all financial data
- **Cashier**: Access to transaction data they created + daily summaries
- **Mechanic**: No access to financial data

### Customer Data
- **Admin**: Full access to all customer data
- **Cashier**: Full access to all customer data
- **Mechanic**: No access to customer personal information

### Vehicle Data
- **Admin**: Full access to all vehicle data
- **Cashier**: Full access to vehicle data except detailed repair costs
- **Mechanic**: Access to vehicle technical data and repair history

### User Data
- **Admin**: Full access to all user accounts
- **Cashier**: Can view own profile only
- **Mechanic**: Can view own profile only

## Security Considerations

### Authentication Requirements
- All endpoints require valid session token except login
- Session tokens expire after 24 hours of inactivity
- Failed login attempts are logged and rate-limited

### Authorization Checks
- Role-based access control enforced at API level
- Additional business rule validations:
  - Cashiers can only modify their own transactions
  - Mechanics can only update repairs assigned to them
  - Price approvals require admin role

### Audit Trail
- All financial transactions are logged with user ID
- Vehicle status changes are tracked with timestamps
- Stock movements are recorded with responsible user
- Critical actions (price approvals, user creation) are audited

## Implementation Notes

### Middleware Requirements
- Authentication middleware to verify session tokens
- Authorization middleware to check role permissions
- Audit logging middleware for sensitive operations

### Database Considerations
- User sessions table for token management
- Audit logs table for tracking critical operations
- Role-based views for data access restrictions

### Frontend Implications
- Role-based navigation menus
- Conditional rendering of UI elements
- Different dashboard layouts per role
- Form field restrictions based on user role
