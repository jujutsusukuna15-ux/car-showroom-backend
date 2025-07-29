import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, FileText, CreditCard, DollarSign, ShoppingCart, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function TransactionsList() {
  const backend = useBackend();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const { data: purchaseTransactions, isLoading: loadingPurchases } = useQuery({
    queryKey: ['purchase-transactions', page, search],
    queryFn: () => backend.transactions.listPurchaseTransactions({
      page,
      limit: 20,
    }),
  });

  const { data: salesTransactions, isLoading: loadingSales } = useQuery({
    queryKey: ['sales-transactions', page, search],
    queryFn: () => backend.transactions.listSalesTransactions({
      page,
      limit: 20,
    }),
  });

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'transfer':
        return 'bg-blue-100 text-blue-800';
      case 'check':
        return 'bg-orange-100 text-orange-800';
      case 'credit':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600">Transaction management and history</p>
        </div>
        <Link to="/transactions/new">
          <Button size="lg" className="h-12">
            <Plus className="h-5 w-5 mr-2" />
            New Transaction
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold text-green-600">
                  {salesTransactions?.transactions.filter(t => 
                    new Date(t.transaction_date).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Purchases</p>
                <p className="text-2xl font-bold text-blue-600">
                  {purchaseTransactions?.transactions.filter(t => 
                    new Date(t.transaction_date).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sales Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    salesTransactions?.transactions
                      .filter(t => new Date(t.transaction_date).toDateString() === new Date().toDateString())
                      .reduce((sum, t) => sum + t.total_amount, 0) || 0
                  )}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Purchase Costs</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    purchaseTransactions?.transactions
                      .filter(t => new Date(t.transaction_date).toDateString() === new Date().toDateString())
                      .reduce((sum, t) => sum + t.total_amount, 0) || 0
                  )}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="sales" className="flex items-center gap-2 text-base">
            <DollarSign className="h-5 w-5" />
            Sales Transactions ({salesTransactions?.total || 0})
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center gap-2 text-base">
            <ShoppingCart className="h-5 w-5" />
            Purchase Transactions ({purchaseTransactions?.total || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Sales Transactions
              </CardTitle>
              <CardDescription>
                Vehicle sales to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loadingSales ? (
                <div className="flex items-center justify-center h-32">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesTransactions?.transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium font-mono">
                            {transaction.invoice_number}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{formatDate(transaction.transaction_date)}</p>
                              <p className="text-sm text-gray-500">{formatTime(transaction.transaction_date)}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">
                            {formatCurrency(transaction.total_amount)}
                          </TableCell>
                          <TableCell>
                            {transaction.discount_amount > 0 
                              ? formatCurrency(transaction.discount_amount)
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge className={getPaymentMethodColor(transaction.payment_method)}>
                              {transaction.payment_method.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link to={`/transactions/sales/${transaction.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {salesTransactions && salesTransactions.transactions.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No sales transactions found</p>
                  <p className="text-gray-400">Start by creating your first sale</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Purchase Transactions
              </CardTitle>
              <CardDescription>
                Vehicle purchases from customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loadingPurchases ? (
                <div className="flex items-center justify-center h-32">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseTransactions?.transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium font-mono">
                            {transaction.invoice_number}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{formatDate(transaction.transaction_date)}</p>
                              <p className="text-sm text-gray-500">{formatTime(transaction.transaction_date)}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-blue-600">
                            {formatCurrency(transaction.total_amount)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getPaymentMethodColor(transaction.payment_method)}>
                              {transaction.payment_method.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link to={`/transactions/purchase/${transaction.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {purchaseTransactions && purchaseTransactions.transactions.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No purchase transactions found</p>
                  <p className="text-gray-400">Start by recording your first purchase</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
