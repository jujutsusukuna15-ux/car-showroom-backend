import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBackend } from '../../hooks/useBackend';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function TransactionDetail() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const backend = useBackend();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['transaction-invoice', type, id],
    queryFn: () => {
      if (type === 'purchase') {
        return backend.transactions.getPurchaseInvoice({ id: parseInt(id!) });
      } else {
        return backend.transactions.getSalesInvoice({ id: parseInt(id!) });
      }
    },
    enabled: !!type && !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Transaction not found</p>
      </div>
    );
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'transfer':
        return 'bg-blue-100 text-blue-800';
      case 'check':
        return 'bg-orange-100 text-orange-800';
      case 'credit':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isDiscountAvailable = 'discount_amount' in invoice.invoice_details;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/transactions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transactions
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {type === 'purchase' ? 'Purchase' : 'Sales'} Transaction
            </h1>
            <p className="text-gray-600">{invoice.transaction.transaction_number}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            View Invoice
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>Basic transaction information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Transaction Number</span>
              <span className="font-mono text-sm">{invoice.transaction.transaction_number}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Invoice Number</span>
              <span className="font-mono text-sm">{invoice.transaction.invoice_number}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Date</span>
              <span>{new Date(invoice.transaction.transaction_date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <Badge variant={invoice.transaction.status === 'completed' ? 'default' : 'secondary'}>
                {invoice.transaction.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Payment Method</span>
              <Badge className={getPaymentMethodColor(invoice.transaction.payment_method)}>
                {invoice.transaction.payment_method}
              </Badge>
            </div>

            {invoice.transaction.payment_reference && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Payment Reference</span>
                <span className="font-mono text-sm">{invoice.transaction.payment_reference}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Cashier</span>
              <span>{invoice.cashier.full_name}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Customer details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Customer Code</span>
              <span className="font-mono text-sm">{invoice.customer.customer_code}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Name</span>
              <span>{invoice.customer.name}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Type</span>
              <Badge className={invoice.customer.type === 'individual' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                {invoice.customer.type}
              </Badge>
            </div>

            {invoice.customer.phone && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Phone</span>
                <span>{invoice.customer.phone}</span>
              </div>
            )}

            {invoice.customer.email && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Email</span>
                <span>{invoice.customer.email}</span>
              </div>
            )}

            {invoice.customer.address && (
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Address</span>
                <p className="text-sm text-gray-700">{invoice.customer.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>Vehicle details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Vehicle Code</span>
              <span className="font-mono text-sm">{invoice.vehicle.vehicle_code}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Brand & Model</span>
              <span>{invoice.vehicle.brand} {invoice.vehicle.model}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Year</span>
              <span>{invoice.vehicle.year}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Chassis Number</span>
              <span className="font-mono text-sm">{invoice.vehicle.chassis_number}</span>
            </div>

            {invoice.vehicle.license_plate && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">License Plate</span>
                <span className="font-mono">{invoice.vehicle.license_plate}</span>
              </div>
            )}

            {invoice.vehicle.color && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Color</span>
                <span>{invoice.vehicle.color}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Transaction amounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Vehicle Price</span>
              <span className="font-medium">${invoice.invoice_details.subtotal.toLocaleString()}</span>
            </div>

            {isDiscountAvailable && 'discount_amount' in invoice.invoice_details && invoice.invoice_details.discount_amount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Discount</span>
                <span className="text-green-600 font-medium">
                  -${invoice.invoice_details.discount_amount.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Tax</span>
              <span className="font-medium">${invoice.invoice_details.tax_amount.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-base font-semibold text-gray-900">Total Amount</span>
              <span className="text-base font-semibold text-gray-900">
                ${invoice.invoice_details.total_amount.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {invoice.transaction.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction Notes</CardTitle>
            <CardDescription>Additional information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{invoice.transaction.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
