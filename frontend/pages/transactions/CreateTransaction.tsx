import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, DollarSign } from 'lucide-react';
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
          <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600">Process vehicle transactions</p>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="sales" className="flex items-center gap-2 text-base">
            <DollarSign className="h-5 w-5" />
            Vehicle Sale
          </TabsTrigger>
          <TabsTrigger value="purchase" className="flex items-center gap-2 text-base">
            <ShoppingCart className="h-5 w-5" />
            Vehicle Purchase
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <DollarSign className="h-6 w-6" />
                Sales Transaction
              </CardTitle>
              <CardDescription className="text-green-700">
                Sell a vehicle to a customer
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <CreateSalesTransaction />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase">
          <Card>
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <ShoppingCart className="h-6 w-6" />
                Purchase Transaction
              </CardTitle>
              <CardDescription className="text-blue-700">
                Buy a vehicle from a customer
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <CreatePurchaseTransaction />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
