import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransactionsList } from './TransactionsList';
import { TransactionDetail } from './TransactionDetail';
import { CreateTransaction } from './CreateTransaction';

export function TransactionsPage() {
  return (
    <Routes>
      <Route index element={<TransactionsList />} />
      <Route path="new" element={<CreateTransaction />} />
      <Route path=":type/:id" element={<TransactionDetail />} />
    </Routes>
  );
}
