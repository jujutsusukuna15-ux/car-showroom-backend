import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';
import { useBackend } from '../../hooks/useBackend';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function CreateRepair() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    vehicle_id: '',
    title: '',
    description: '',
    labor_cost: 0,
  });

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles-for-repair'],
    queryFn: () => backend.vehicles.listVehicles({ status: 'purchased' }),
  });

  const createRepairMutation = useMutation({
    mutationFn: (data: typeof formData) => backend.repairs.createRepair({
      ...data,
      vehicle_id: parseInt(data.vehicle_id),
    }),
    onSuccess: () => {
      toast({
        title: 'Repair created successfully',
        description: 'The repair work order has been created',
      });
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
      navigate('/repairs');
    },
    onError: (error) => {
      console.error('Create repair error:', error);
      toast({
        title: 'Error creating repair',
        description: 'There was an error creating the repair',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRepairMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/repairs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Repairs
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Repair Work Order</h1>
          <p className="text-gray-600">Create a new repair work order</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Repair Information</CardTitle>
          <CardDescription>
            Enter the repair work order details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Repair Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                placeholder="Enter repair title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the repair work needed"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="labor_cost">Labor Cost ($)</Label>
              <Input
                id="labor_cost"
                type="number"
                value={formData.labor_cost}
                onChange={(e) => handleInputChange('labor_cost', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                placeholder="Enter estimated labor cost"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={createRepairMutation.isPending || !formData.vehicle_id || !formData.title}
                className="flex-1"
              >
                {createRepairMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Repair'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/repairs')}
                disabled={createRepairMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
