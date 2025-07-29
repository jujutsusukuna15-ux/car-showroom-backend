import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatePurchaseTransaction } from './CreatePurchaseTransaction';
import { CreateSalesTransaction } from './CreateSalesTransaction';

export function CreateTransaction() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/transactions')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Transactions
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Transaction</h1>
          <p className="text-gray-600">Create a new purchase or sales transaction</p>
        </div>
      </div>

      <Tabs defaultValue="purchase" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchase">Purchase Transaction</TabsTrigger>
          <TabsTrigger value="sales">Sales Transaction</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Transaction</CardTitle>
              <CardDescription>
                Record a vehicle purchase from a customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreatePurchaseTransaction />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Transaction</CardTitle>
              <CardDescription>
                Record a vehicle sale to a customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateSalesTransaction />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
