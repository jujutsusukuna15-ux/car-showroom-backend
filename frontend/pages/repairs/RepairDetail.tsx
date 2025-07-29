import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useBackend } from '../../hooks/useBackend';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function RepairDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const backend = useBackend();

  const { data: repairData, isLoading } = useQuery({
    queryKey: ['repair', id],
    queryFn: () => backend.repairs.getRepair({ id: parseInt(id!) }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!repairData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Repair not found</p>
      </div>
    );
  }

  const { repair, parts } = repairData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/repairs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Repairs
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{repair.title}</h1>
            <p className="text-gray-600">{repair.repair_number}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Repair
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Parts
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Repair Details</CardTitle>
            <CardDescription>Work order information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Repair Number</span>
              <span className="font-mono text-sm">{repair.repair_number}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <Badge className={getStatusColor(repair.status)}>
                {repair.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Vehicle ID</span>
              <span>{repair.vehicle_id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Created</span>
              <span>{new Date(repair.created_at).toLocaleDateString()}</span>
            </div>

            {repair.started_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Started</span>
                <span>{new Date(repair.started_at).toLocaleDateString()}</span>
              </div>
            )}

            {repair.completed_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Completed</span>
                <span>{new Date(repair.completed_at).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Labor and parts costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Labor Cost</span>
              <span className="font-medium">${repair.labor_cost.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Parts Cost</span>
              <span className="font-medium">${repair.total_parts_cost.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-base font-semibold text-gray-900">Total Cost</span>
              <span className="text-base font-semibold text-gray-900">
                ${repair.total_cost.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {repair.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>Repair work description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{repair.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Parts Used</CardTitle>
          <CardDescription>Spare parts used in this repair</CardDescription>
        </CardHeader>
        <CardContent>
          {parts.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part Code</TableHead>
                    <TableHead>Part Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Used At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parts.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell className="font-mono text-sm">{part.part_code}</TableCell>
                      <TableCell>{part.part_name}</TableCell>
                      <TableCell>{part.quantity_used}</TableCell>
                      <TableCell>${part.unit_cost.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">${part.total_cost.toLocaleString()}</TableCell>
                      <TableCell>{new Date(part.used_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No parts used yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {repair.work_notes && (
        <Card>
          <CardHeader>
            <CardTitle>Work Notes</CardTitle>
            <CardDescription>Additional notes and observations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{repair.work_notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
