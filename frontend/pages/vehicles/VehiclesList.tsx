import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBackend } from '../../hooks/useBackend';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function VehiclesList() {
  const backend = useBackend();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [brand, setBrand] = useState<string>('');

  const { data: vehiclesData, isLoading } = useQuery({
    queryKey: ['vehicles', page, search, status, brand],
    queryFn: () => backend.vehicles.listVehicles({
      page,
      limit: 20,
      search: search || undefined,
      status: status as any || undefined,
      brand: brand || undefined,
    }),
  });

  const getStatusColor = (vehicleStatus: string) => {
    switch (vehicleStatus) {
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

  const canCreateVehicle = user?.role === 'admin' || user?.role === 'cashier';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600">Manage your vehicle inventory</p>
        </div>
        {canCreateVehicle && (
          <Link to="/vehicles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Inventory</CardTitle>
          <CardDescription>
            {vehiclesData?.total || 0} vehicles in system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vehicles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="purchased">Purchased</SelectItem>
                <SelectItem value="in_repair">In Repair</SelectItem>
                <SelectItem value="ready_to_sell">Ready to Sell</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Brands</SelectItem>
                <SelectItem value="Toyota">Toyota</SelectItem>
                <SelectItem value="Honda">Honda</SelectItem>
                <SelectItem value="Ford">Ford</SelectItem>
                <SelectItem value="BMW">BMW</SelectItem>
                <SelectItem value="Mercedes">Mercedes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle Code</TableHead>
                    <TableHead>Brand & Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>License Plate</TableHead>
                    {(user?.role === 'admin' || user?.role === 'cashier') && (
                      <TableHead>Price</TableHead>
                    )}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiclesData?.vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">
                        {vehicle.vehicle_code}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                          {vehicle.variant && (
                            <p className="text-sm text-gray-500">{vehicle.variant}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vehicle.status)}>
                          {vehicle.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicle.license_plate || '-'}</TableCell>
                      {(user?.role === 'admin' || user?.role === 'cashier') && (
                        <TableCell>
                          {vehicle.approved_selling_price 
                            ? `$${vehicle.approved_selling_price.toLocaleString()}`
                            : vehicle.suggested_selling_price
                            ? `$${vehicle.suggested_selling_price.toLocaleString()} (suggested)`
                            : '-'
                          }
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/vehicles/${vehicle.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {vehiclesData && vehiclesData.vehicles.length === 0 && (
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No vehicles found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
