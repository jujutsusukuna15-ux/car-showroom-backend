import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Wrench, DollarSign, Calendar, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBackend } from '../../hooks/useBackend';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  const { user } = useAuth();

  const { data: vehicleData, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => backend.vehicles.getVehicle({ id: parseInt(id!) }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!vehicleData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Vehicle not found</p>
      </div>
    );
  }

  const { vehicle, images } = vehicleData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'purchased':
        return 'bg-blue-100 text-blue-800';
      case 'in_repair':
        return 'bg-orange-100 text-orange-800';
      case 'ready_to_sell':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-purple-100 text-purple-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canViewFinancials = user?.role === 'admin' || user?.role === 'cashier';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/vehicles')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vehicles
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-gray-600">{vehicle.vehicle_code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Vehicle
          </Button>
          {vehicle.status !== 'sold' && (
            <Button variant="outline">
              <Wrench className="h-4 w-4 mr-2" />
              Create Repair
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Vehicle specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <Badge className={getStatusColor(vehicle.status)}>
                {vehicle.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Brand</span>
              <span>{vehicle.brand}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Model</span>
              <span>{vehicle.model}</span>
            </div>

            {vehicle.variant && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Variant</span>
                <span>{vehicle.variant}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Year</span>
              <span>{vehicle.year}</span>
            </div>

            {vehicle.color && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Color</span>
                <span>{vehicle.color}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Chassis Number</span>
              <span className="font-mono text-sm">{vehicle.chassis_number}</span>
            </div>

            {vehicle.license_plate && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">License Plate</span>
                <span className="font-mono">{vehicle.license_plate}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
            <CardDescription>Engine and performance specs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehicle.fuel_type && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Gauge className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Fuel Type</p>
                  <p className="text-sm text-gray-600 capitalize">{vehicle.fuel_type}</p>
                </div>
              </div>
            )}

            {vehicle.transmission && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wrench className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Transmission</p>
                  <p className="text-sm text-gray-600 capitalize">{vehicle.transmission}</p>
                </div>
              </div>
            )}

            {vehicle.mileage && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mileage</p>
                  <p className="text-sm text-gray-600">{vehicle.mileage.toLocaleString()} km</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {canViewFinancials && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
              <CardDescription>Pricing and costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicle.purchase_price && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Purchase Price</span>
                  <span className="font-medium">${vehicle.purchase_price.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Repair Costs</span>
                <span className="font-medium">${vehicle.total_repair_cost.toLocaleString()}</span>
              </div>

              {vehicle.suggested_selling_price && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Suggested Price</span>
                  <span className="text-orange-600 font-medium">
                    ${vehicle.suggested_selling_price.toLocaleString()}
                  </span>
                </div>
              )}

              {vehicle.approved_selling_price && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Approved Price</span>
                  <span className="text-green-600 font-medium">
                    ${vehicle.approved_selling_price.toLocaleString()}
                  </span>
                </div>
              )}

              {vehicle.final_selling_price && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Final Sale Price</span>
                  <span className="text-blue-600 font-medium">
                    ${vehicle.final_selling_price.toLocaleString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {vehicle.condition_notes && (
        <Card>
          <CardHeader>
            <CardTitle>Condition Notes</CardTitle>
            <CardDescription>Additional information about the vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{vehicle.condition_notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Images</CardTitle>
          <CardDescription>Photos of the vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative">
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">{image.image_type}</span>
                  </div>
                  {image.is_primary && (
                    <Badge className="absolute top-2 left-2 bg-blue-600">Primary</Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No images uploaded</p>
              <Button variant="outline" className="mt-2">
                Upload Images
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
