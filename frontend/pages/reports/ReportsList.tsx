import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Calendar, DollarSign, Car, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBackend } from '../../hooks/useBackend';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function ReportsList() {
  const backend = useBackend();
  const { user } = useAuth();

  const { data: businessOverview, isLoading: loadingOverview } = useQuery({
    queryKey: ['business-overview'],
    queryFn: () => backend.reports.getBusinessOverview(),
    enabled: user?.role === 'admin' || user?.role === 'cashier',
  });

  const { data: dailyReport, isLoading: loadingDaily } = useQuery({
    queryKey: ['daily-report'],
    queryFn: () => backend.reports.getDailyReport(),
    enabled: user?.role === 'admin' || user?.role === 'cashier',
  });

  const { data: weeklyReport, isLoading: loadingWeekly } = useQuery({
    queryKey: ['weekly-report'],
    queryFn: () => backend.reports.getWeeklyReport(),
    enabled: user?.role === 'admin' || user?.role === 'cashier',
  });

  const isLoading = loadingOverview || loadingDaily || loadingWeekly;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Business insights and performance metrics</p>
      </div>

      {/* Quick Stats */}
      {businessOverview && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${businessOverview.total_revenue.toLocaleString()}
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
                ${businessOverview.total_profit.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {businessOverview.average_profit_margin.toFixed(1)}% avg margin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicles Sold</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessOverview.total_vehicles_sold}</div>
              <p className="text-xs text-muted-foreground">Total vehicles sold</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessOverview.total_vehicles_in_stock}</div>
              <p className="text-xs text-muted-foreground">Available vehicles</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Daily Report
            </CardTitle>
            <CardDescription>Today's transaction summary</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyReport && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sales:</span>
                  <span className="font-medium">{dailyReport.total_sales}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Purchases:</span>
                  <span className="font-medium">{dailyReport.total_purchases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue:</span>
                  <span className="font-medium">${dailyReport.total_sales_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium">Profit:</span>
                  <span className="font-medium text-green-600">${dailyReport.profit.toLocaleString()}</span>
                </div>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4">
              View Detailed Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Weekly Report
            </CardTitle>
            <CardDescription>This week's performance</CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyReport && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vehicles Bought:</span>
                  <span className="font-medium">{weeklyReport.vehicles_bought}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vehicles Sold:</span>
                  <span className="font-medium">{weeklyReport.vehicles_sold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Repair Costs:</span>
                  <span className="font-medium">${weeklyReport.total_repair_costs.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium">Profit:</span>
                  <span className="font-medium text-green-600">${weeklyReport.total_profit.toLocaleString()}</span>
                </div>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4">
              View Detailed Report
            </Button>
          </CardContent>
        </Card>

        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Vehicle Profitability
              </CardTitle>
              <CardDescription>Analyze vehicle profit margins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-sm text-gray-600 mb-4">
                  Detailed analysis of vehicle profitability and performance metrics
                </p>
                <Button variant="outline" className="w-full">
                  View Profitability Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Additional Reports for Admin */}
      {user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Reports</CardTitle>
            <CardDescription>Comprehensive business analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <BarChart3 className="h-6 w-6 mb-2" />
                Monthly Report
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Car className="h-6 w-6 mb-2" />
                Top Performing Models
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                Customer Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
