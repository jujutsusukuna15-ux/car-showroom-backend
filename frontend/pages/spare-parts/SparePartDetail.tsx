import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SparePartDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/spare-parts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Spare Parts
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Spare Part Details</h1>
            <p className="text-gray-600">Part ID: {id}</p>
          </div>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Part
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Part Information</CardTitle>
          <CardDescription>Spare part details and inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Spare part details will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
