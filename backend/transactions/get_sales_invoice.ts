import { api, APIError } from "encore.dev/api";
import { transactionsDB } from "./db";
import { SalesInvoice } from "./types";

interface GetSalesInvoiceRequest {
  id: number;
}

// Retrieves a sales transaction invoice by ID.
export const getSalesInvoice = api<GetSalesInvoiceRequest, SalesInvoice>(
  { expose: true, method: "GET", path: "/transactions/sales/:id/invoice" },
  async (req) => {
    // Get transaction details with related data
    const invoice = await transactionsDB.queryRow<any>`
      SELECT 
        st.id,
        st.transaction_number,
        st.invoice_number,
        st.vehicle_id,
        st.customer_id,
        st.vehicle_price,
        st.tax_amount,
        st.discount_amount,
        st.total_amount,
        st.payment_method,
        st.payment_reference,
        st.transaction_date,
        st.cashier_id,
        st.status,
        st.notes,
        st.created_at,
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
      FROM sales_transactions st
      LEFT JOIN customers c ON st.customer_id = c.id
      LEFT JOIN vehicles v ON st.vehicle_id = v.id
      LEFT JOIN users u ON st.cashier_id = u.id
      WHERE st.id = ${req.id}
    `;

    if (!invoice) {
      throw APIError.notFound("Sales invoice not found");
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
        discount_amount: invoice.discount_amount,
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
        discount_amount: invoice.discount_amount,
        tax_amount: invoice.tax_amount,
        total_amount: invoice.total_amount,
        payment_method: invoice.payment_method,
        payment_reference: invoice.payment_reference
      }
    };
  }
);
