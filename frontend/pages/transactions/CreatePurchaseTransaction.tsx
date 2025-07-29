import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calculator, CreditCard, Banknote, FileCheck, Car, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useBackend } from '../../hooks/useBackend';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function CreatePurchaseTransaction() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    vehicle_id: '',
    customer_id: '',
    vehicle_price: 0,
    tax_rate: 0.1,
    payment_method: 'cash' as 'cash' | 'transfer' | 'check',
    payment_reference: '',
    notes: '',
  });

  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles-for-purchase'],
    queryFn: () => backend.vehicles.listVehicles({ status: 'purchased' }),
  });

  const { data: customers } = useQuery({
    queryKey: ['customers-for-transaction'],
    queryFn: () => backend.customers.listCustomers({ limit: 100 }),
  });

  const createTransactionMutation = useMutation({
    mutationFn: (data: typeof formData) => backend.transactions.createPurchaseTransaction({
      ...data,
      vehicle_id: parseInt(data.vehicle_id),
      customer_id: parseInt(data.customer_id),
    }),
    onSuccess: (result) => {
      toast({
        title: 'Purchase transaction completed!',
        description: `Invoice ${result.invoice_number} has been generated`,
      });
      queryClient.invalidateQueries({ queryKey: ['purchase-transactions'] });
      navigate(`/transactions/purchase/${result.id}`);
    },
    onError: (error) => {
      console.error('Create transaction error:', error);
      toast({
        title: 'Transaction failed',
        description: 'There was an error processing the transaction',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTransactionMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles?.vehicles.find(v => v.id.toString() === vehicleId);
    setSelectedVehicle(vehicle);
    handleInputChange('vehicle_id', vehicleId);
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers?.customers.find(c => c.id.toString() === customerId);
    setSelectedCustomer(customer);
    handleInputChange('customer_id', customerId);
  };

  const taxAmount = formData.vehicle_price * formData.tax_rate;
  const totalAmount = formData.vehicle_price + taxAmount;

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'transfer':
        return <CreditCard className="h-4 w-4" />;
      case 'check':
        return <FileCheck className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Transaction Form */}
      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Select Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_id">Available Vehicles *</Label>
                  <Select
                    value={formData.vehicle_id}
                    onValueChange={handleVehicleSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a vehicle to purchase" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles?.vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                          {vehicle.vehicle_code} - {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedVehicle && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Brand:</span>
                        <p className="font-medium">{selectedVehicle.brand}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Model:</span>
                        <p className="font-medium">{selectedVehicle.model}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Year:</span>
                        <p className="font-medium">{selectedVehicle.year}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Color:</span>
                        <p className="font-medium">{selectedVehicle.color || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_id">Customer (Seller) *</Label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={handleCustomerSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers?.customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.customer_code} - {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCustomer && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <Badge variant="outline">{selectedCustomer.type}</Badge>
                      </div>
                      {selectedCustomer.phone && (
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <p className="font-medium">{selectedCustomer.phone}</p>
                        </div>
                      )}
                      {selectedCustomer.email && (
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <p className="font-medium">{selectedCustomer.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Purchase Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_price">Purchase Price ($) *</Label>
                  <Input
                    id="vehicle_price"
                    type="number"
                    value={formData.vehicle_price}
                    onChange={(e) => handleInputChange('vehicle_price', parseFloat(e.target.value) || 0)}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter purchase price"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    value={formData.tax_rate * 100}
                    onChange={(e) => handleInputChange('tax_rate', (parseFloat(e.target.value) || 0) / 100)}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { value: 'cash', label: 'Cash', icon: <Banknote className="h-4 w-4" /> },
                  { value: 'transfer', label: 'Transfer', icon: <CreditCard className="h-4 w-4" /> },
                  { value: 'check', label: 'Check', icon: <FileCheck className="h-4 w-4" /> },
                ].map((method) => (
                  <Button
                    key={method.value}
                    type="button"
                    variant={formData.payment_method === method.value ? 'default' : 'outline'}
                    onClick={() => handleInputChange('payment_method', method.value)}
                    className="h-16 flex flex-col gap-1"
                  >
                    {method.icon}
                    {method.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_reference">Payment Reference</Label>
                <Input
                  id="payment_reference"
                  value={formData.payment_reference}
                  onChange={(e) => handleInputChange('payment_reference', e.target.value)}
                  placeholder="Transaction ID, check number, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional notes about this transaction..."
                rows={3}
              />
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Right Column - Transaction Summary */}
      <div className="space-y-6">
        <Card className="sticky top-6">
          <CardHeader className="bg-gray-50">
            <CardTitle>Purchase Summary</CardTitle>
            <CardDescription>Review before processing</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Vehicle Price:</span>
                <span className="font-mono">${formData.vehicle_price.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-lg">
                <span>Tax ({(formData.tax_rate * 100).toFixed(1)}%):</span>
                <span className="font-mono">${taxAmount.toLocaleString()}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-2xl font-bold">
                <span>TOTAL:</span>
                <span className="font-mono text-blue-600">${totalAmount.toLocaleString()}</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(formData.payment_method)}
                    <span className="capitalize">{formData.payment_method}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={createTransactionMutation.isPending || !formData.vehicle_id || !formData.customer_id}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {createTransactionMutation.isPending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Complete Purchase
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/transactions')}
                  disabled={createTransactionMutation.isPending}
                  className="w-full"
                >
                  Cancel Transaction
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
