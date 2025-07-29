import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

  const handlePrint = () => {
    window.print();
  };

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
              {type === 'purchase' ? 'Purchase' : 'Sales'} Invoice
            </h1>
            <p className="text-gray-600">{invoice.transaction.invoice_number}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Invoice Layout - POS Style */}
      <div className="max-w-4xl mx-auto">
        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">AutoDealer</h1>
              <p className="text-gray-600">Vehicle Dealership Management System</p>
              <p className="text-sm text-gray-500 mt-2">
                123 Main Street, City, State 12345 | Phone: (555) 123-4567
              </p>
            </div>

            <Separator className="mb-6" />

            {/* Invoice Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {type === 'purchase' ? 'Purchase From:' : 'Bill To:'}
                </h3>
                <div className="space-y-1">
                  <p className="font-medium">{invoice.customer.name}</p>
                  <p className="text-sm text-gray-600">Code: {invoice.customer.customer_code}</p>
                  {invoice.customer.phone && (
                    <p className="text-sm text-gray-600">Phone: {invoice.customer.phone}</p>
                  )}
                  {invoice.customer.email && (
                    <p className="text-sm text-gray-600">Email: {invoice.customer.email}</p>
                  )}
                  {invoice.customer.address && (
                    <p className="text-sm text-gray-600">{invoice.customer.address}</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Invoice Number:</span>
                    <p className="font-mono font-medium">{invoice.transaction.invoice_number}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Transaction Number:</span>
                    <p className="font-mono font-medium">{invoice.transaction.transaction_number}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Date:</span>
                    <p className="font-medium">
                      {new Date(invoice.transaction.transaction_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge 
                      variant={invoice.transaction.status === 'completed' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {invoice.transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Vehicle Code:</span>
                    <p className="font-mono font-medium">{invoice.vehicle.vehicle_code}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Brand & Model:</span>
                    <p className="font-medium">{invoice.vehicle.brand} {invoice.vehicle.model}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Year:</span>
                    <p className="font-medium">{invoice.vehicle.year}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Chassis Number:</span>
                    <p className="font-mono text-sm">{invoice.vehicle.chassis_number}</p>
                  </div>
                  {invoice.vehicle.license_plate && (
                    <div>
                      <span className="text-sm text-gray-600">License Plate:</span>
                      <p className="font-mono font-medium">{invoice.vehicle.license_plate}</p>
                    </div>
                  )}
                  {invoice.vehicle.color && (
                    <div>
                      <span className="text-sm text-gray-600">Color:</span>
                      <p className="font-medium">{invoice.vehicle.color}</p>
                    </div>
                  )}
                  {invoice.vehicle.mileage && (
                    <div>
                      <span className="text-sm text-gray-600">Mileage:</span>
                      <p className="font-medium">{invoice.vehicle.mileage.toLocaleString()} km</p>
                    </div>
                  )}
                  {invoice.vehicle.fuel_type && (
                    <div>
                      <span className="text-sm text-gray-600">Fuel Type:</span>
                      <p className="font-medium capitalize">{invoice.vehicle.fuel_type}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Summary - POS Style */}
            <div className="mb-8">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-lg">
                    <span>Vehicle Price:</span>
                    <span className="font-mono">${invoice.invoice_details.subtotal.toLocaleString()}</span>
                  </div>

                  {isDiscountAvailable && 'discount_amount' in invoice.invoice_details && invoice.invoice_details.discount_amount > 0 && (
                    <div className="flex justify-between items-center text-lg text-green-600">
                      <span>Discount:</span>
                      <span className="font-mono">-${invoice.invoice_details.discount_amount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-lg">
                    <span>Tax:</span>
                    <span className="font-mono">${invoice.invoice_details.tax_amount.toLocaleString()}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>TOTAL:</span>
                    <span className="font-mono">${invoice.invoice_details.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <Badge className={getPaymentMethodColor(invoice.transaction.payment_method)}>
                      {invoice.transaction.payment_method.toUpperCase()}
                    </Badge>
                  </div>
                  {invoice.transaction.payment_reference && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-mono text-sm">{invoice.transaction.payment_reference}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Processed By</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cashier:</span>
                    <span className="font-medium">{invoice.cashier.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Username:</span>
                    <span className="font-mono text-sm">{invoice.cashier.username}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.transaction.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{invoice.transaction.notes}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <Separator className="mb-6" />
            <div className="text-center text-sm text-gray-500">
              <p>Thank you for your business!</p>
              <p className="mt-2">
                This is a computer-generated invoice. No signature required.
              </p>
              <p className="mt-1">
                Generated on {new Date().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
