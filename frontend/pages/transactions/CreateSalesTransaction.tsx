import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { useToast } from '@/components/ui/use-toast';
import { useBackend } from '../../hooks/useBackend';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function CreateSalesTransaction() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    vehicle_id: '',
    customer_id: '',
    vehicle_price: 0,
    tax_rate: 0.1,
    discount_amount: 0,
    payment_method: 'cash' as 'cash' | 'transfer' | 'check' | 'credit',
    payment_reference: '',
    notes: '',
  });

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles-for-sale'],
    queryFn: () => backend.vehicles.listVehicles({ status: 'ready_to_sell' }),
  });

  const { data: customers } = useQuery({
    queryKey: ['customers-for-transaction'],
    queryFn: () => backend.customers.listCustomers({ limit: 100 }),
  });

  const createTransactionMutation = useMutation({
    mutationFn: (data: typeof formData) => backend.transactions.createSalesTransaction({
      ...data,
      vehicle_id: parseInt(data.vehicle_id),
      customer_id: parseInt(data.customer_id),
    }),
    onSuccess: () => {
      toast({
        title: 'Sales transaction created successfully',
        description: 'The transaction has been recorded',
      });
      queryClient.invalidateQueries({ queryKey: ['sales-transactions'] });
      navigate('/transactions');
    },
    onError: (error) => {
      console.error('Create transaction error:', error);
      toast({
        title: 'Error creating transaction',
        description: 'There was an error creating the transaction',
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

  const subtotal = formData.vehicle_price - formData.discount_amount;
  const taxAmount = subtotal * formData.tax_rate;
  const totalAmount = subtotal + taxAmount;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicle_id">Vehicle *</Label>
          <Select
            value={formData.vehicle_id}
            onValueChange={(value) => handleInputChange('vehicle_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles?.vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                  {vehicle.vehicle_code} - {vehicle.brand} {vehicle.model} ({vehicle.year})
                  {vehicle.approved_selling_price && (
                    <span className="text-green-600 ml-2">
                      - ${vehicle.approved_selling_price.toLocaleString()}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_id">Customer *</Label>
          <Select
            value={formData.customer_id}
            onValueChange={(value) => handleInputChange('customer_id', value)}
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

        <div className="space-y-2">
          <Label htmlFor="vehicle_price">Vehicle Price ($) *</Label>
          <Input
            id="vehicle_price"
            type="number"
            value={formData.vehicle_price}
            onChange={(e) => handleInputChange('vehicle_price', parseFloat(e.target.value) || 0)}
            required
            min="0"
            step="0.01"
            placeholder="Enter vehicle price"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount_amount">Discount Amount ($)</Label>
          <Input
            id="discount_amount"
            type="number"
            value={formData.discount_amount}
            onChange={(e) => handleInputChange('discount_amount', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            placeholder="Enter discount amount"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax_rate">Tax Rate</Label>
          <Input
            id="tax_rate"
            type="number"
            value={formData.tax_rate}
            onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value) || 0)}
            min="0"
            max="1"
            step="0.01"
            placeholder="0.10 (10%)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_method">Payment Method *</Label>
          <Select
            value={formData.payment_method}
            onValueChange={(value) => handleInputChange('payment_method', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="transfer">Bank Transfer</SelectItem>
              <SelectItem value="check">Check</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
            </SelectContent>
          </Select>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional notes about the transaction"
          rows={3}
        />
      </div>

      {/* Transaction Summary */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <h3 className="font-medium text-gray-900">Transaction Summary</h3>
        <div className="flex justify-between text-sm">
          <span>Vehicle Price:</span>
          <span>${formData.vehicle_price.toLocaleString()}</span>
        </div>
        {formData.discount_amount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount:</span>
            <span>-${formData.discount_amount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax ({(formData.tax_rate * 100).toFixed(1)}%):</span>
          <span>${taxAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-medium border-t pt-2">
          <span>Total Amount:</span>
          <span>${totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={createTransactionMutation.isPending || !formData.vehicle_id || !formData.customer_id}
          className="flex-1"
        >
          {createTransactionMutation.isPending ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Creating...
            </>
          ) : (
            'Create Sales Transaction'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/transactions')}
          disabled={createTransactionMutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
