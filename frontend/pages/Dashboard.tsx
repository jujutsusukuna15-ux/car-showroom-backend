import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBackend } from '../hooks/useBackend';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Car, Users, Wrench, Package, TrendingUp, AlertTriangle, DollarSign, Calendar } from 'lucide-react';

export function Dashboard() {
  const backend = useBackend();
  const { user } = useAuth();

  const { data: businessOverview, isLoading } = useQuery({
    queryKey: ['business-overview'],
    queryFn: () => backend.reports.getBusinessOverview(),
    enabled: user?.role === 'admin' || user?.role === 'cashier',
  });

  const { data: dailyReport } = useQuery({
    queryKey: ['daily-report'],
    queryFn: () => backend.reports.getDailyReport(),
    enabled: user?.role === 'admin' || user?.role === 'cashier',
  });

  const { data: lowStockAlerts } = useQuery({
    queryKey: ['low-stock-alerts'],
    queryFn: () => backend.spareParts.getLowStockAlerts(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vehicles in Stock</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessOverview?.total_vehicles_in_stock || 0}</div>
                <p className="text-xs text-muted-foreground">Available for sale</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${businessOverview?.total_revenue?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">All time sales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${businessOverview?.total_profit?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {businessOverview?.average_profit_margin?.toFixed(1) || 0}% avg margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Repairs</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessOverview?.pending_repairs || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting completion</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'cashier':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dailyReport?.total_sales || 0}</div>
                <p className="text-xs text-muted-foreground">
                  ${dailyReport?.total_sales_amount?.toLocaleString() || 0} revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Purchases</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dailyReport?.total_purchases || 0}</div>
                <p className="text-xs text-muted-foreground">
                  ${dailyReport?.total_purchase_amount?.toLocaleString() || 0} spent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vehicles Available</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessOverview?.total_vehicles_in_stock || 0}</div>
                <p className="text-xs text-muted-foreground">Ready for sale</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'mechanic':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Repairs</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessOverview?.pending_repairs || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting work</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Parts</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockAlerts?.total || 0}</div>
                <p className="text-xs text-muted-foreground">Need restocking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vehicles in Repair</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">Currently working on</p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.full_name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your dealership today.
        </p>
      </div>

      {getRoleDashboard()}

      {/* Low Stock Alerts */}
      {lowStockAlerts && lowStockAlerts.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>
              {lowStockAlerts.total} spare parts need restocking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockAlerts.alerts.slice(0, 5).map((alert) => (
                <div key={alert.spare_part.id} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">{alert.spare_part.name}</p>
                    <p className="text-sm text-gray-600">{alert.spare_part.part_code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {alert.current_stock} / {alert.min_level}
                    </p>
                    <p className="text-xs text-gray-500">Current / Min</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {user?.role === 'admin' && (
              <>
                <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">Manage Users</h3>
                  <p className="text-sm text-gray-600">Add or edit user accounts</p>
                </button>
                <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                  <BarChart3 className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium">View Reports</h3>
                  <p className="text-sm text-gray-600">Business analytics and insights</p>
                </button>
              </>
            )}
            
            {(user?.role === 'admin' || user?.role === 'cashier') && (
              <>
                <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                  <Car className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">Add Vehicle</h3>
                  <p className="text-sm text-gray-600">Register new vehicle</p>
                </button>
                <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-medium">Add Customer</h3>
                  <p className="text-sm text-gray-600">Register new customer</p>
                </button>
              </>
            )}

            {(user?.role === 'admin' || user?.role === 'mechanic') && (
              <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <Wrench className="h-6 w-6 text-orange-600 mb-2" />
                <h3 className="font-medium">Create Repair</h3>
                <p className="text-sm text-gray-600">Start new repair work</p>
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
