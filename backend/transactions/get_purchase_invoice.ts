import { api, APIError } from "encore.dev/api";
import { transactionsDB } from "./db";
import { PurchaseInvoice } from "./types";

interface GetPurchaseInvoiceRequest {
  id: number;
}

// Retrieves a purchase transaction invoice by ID.
export const getPurchaseInvoice = api<GetPurchaseInvoiceRequest, PurchaseInvoice>(
  { expose: true, method: "GET", path: "/transactions/purchases/:id/invoice" },
  async (req) => {
    // Get transaction details with related data
    const invoice = await transactionsDB.queryRow<any>`
      SELECT 
        pt.id,
        pt.transaction_number,
        pt.invoice_number,
        pt.vehicle_id,
        pt.customer_id,
        pt.vehicle_price,
        pt.tax_amount,
        pt.total_amount,
        pt.payment_method,
        pt.payment_reference,
        pt.transaction_date,
        pt.cashier_id,
        pt.status,
        pt.notes,
        pt.created_at,
        -- Customer details
        c.customer_code,
        c.name as customer_name,
        c.phone as customer_phone,
        c.email as customer_email,
        c.address as customer_address,
        c.id_card_number as customer_id_card,
        c.type as customer_type,
        -- Vehicle details
        v.vehicle_code,
        v.chassis_number,
        v.license_plate,
        v.brand,
        v.model,
        v.variant,
        v.year,
        v.color,
        v.mileage,
        v.fuel_type,
        v.transmission,
        -- Cashier details
        u.full_name as cashier_name,
        u.username as cashier_username
      FROM purchase_transactions pt
      LEFT JOIN customers c ON pt.customer_id = c.id
      LEFT JOIN vehicles v ON pt.vehicle_id = v.id
      LEFT JOIN users u ON pt.cashier_id = u.id
      WHERE pt.id = ${req.id}
    `;

    if (!invoice) {
      throw APIError.notFound("Purchase invoice not found");
    }

    return {
      transaction: {
        id: invoice.id,
        transaction_number: invoice.transaction_number,
        invoice_number: invoice.invoice_number,
        vehicle_id: invoice.vehicle_id,
        customer_id: invoice.customer_id,
        vehicle_price: invoice.vehicle_price,
        tax_amount: invoice.tax_amount,
        total_amount: invoice.total_amount,
        payment_method: invoice.payment_method,
        payment_reference: invoice.payment_reference,
        transaction_date: invoice.transaction_date,
        cashier_id: invoice.cashier_id,
        status: invoice.status,
        notes: invoice.notes,
        created_at: invoice.created_at
      },
      customer: {
        id: invoice.customer_id,
        customer_code: invoice.customer_code,
        name: invoice.customer_name,
        phone: invoice.customer_phone,
        email: invoice.customer_email,
        address: invoice.customer_address,
        id_card_number: invoice.customer_id_card,
        type: invoice.customer_type
      },
      vehicle: {
        id: invoice.vehicle_id,
        vehicle_code: invoice.vehicle_code,
        chassis_number: invoice.chassis_number,
        license_plate: invoice.license_plate,
        brand: invoice.brand,
        model: invoice.model,
        variant: invoice.variant,
        year: invoice.year,
        color: invoice.color,
        mileage: invoice.mileage,
        fuel_type: invoice.fuel_type,
        transmission: invoice.transmission
      },
      cashier: {
        id: invoice.cashier_id,
        full_name: invoice.cashier_name,
        username: invoice.cashier_username
      },
      invoice_details: {
        invoice_number: invoice.invoice_number,
        transaction_date: invoice.transaction_date,
        subtotal: invoice.vehicle_price,
        tax_amount: invoice.tax_amount,
        total_amount: invoice.total_amount,
        payment_method: invoice.payment_method,
        payment_reference: invoice.payment_reference
      }
    };
  }
);
