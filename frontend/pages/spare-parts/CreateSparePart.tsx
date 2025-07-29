import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function CreateSparePart() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    cost_price: 0,
    selling_price: 0,
    stock_quantity: 0,
    min_stock_level: 0,
    unit_measure: 'pcs',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement create spare part
    console.log('Create spare part:', formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/spare-parts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Spare Parts
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Spare Part</h1>
          <p className="text-gray-600">Create a new spare part record</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Spare Part Information</CardTitle>
          <CardDescription>
            Enter the spare part details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Part Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Enter part name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Enter brand"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost_price">Cost Price ($) *</Label>
                <Input
                  id="cost_price"
                  type="number"
                  value={formData.cost_price}
                  onChange={(e) => handleInputChange('cost_price', parseFloat(e.target.value) || 0)}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter cost price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="selling_price">Selling Price ($) *</Label>
                <Input
                  id="selling_price"
                  type="number"
                  value={formData.selling_price}
                  onChange={(e) => handleInputChange('selling_price', parseFloat(e.target.value) || 0)}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter selling price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Initial Stock</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="Enter initial stock"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_stock_level">Minimum Stock Level</Label>
                <Input
                  id="min_stock_level"
                  type="number"
                  value={formData.min_stock_level}
                  onChange={(e) => handleInputChange('min_stock_level', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="Enter minimum stock level"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter part description"
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Create Spare Part
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/spare-parts')}
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
