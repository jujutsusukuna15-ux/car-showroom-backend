import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CustomersList } from './CustomersList';
import { CustomerDetail } from './CustomerDetail';
import { CreateCustomer } from './CreateCustomer';

export function CustomersPage() {
  return (
    <Routes>
      <Route index element={<CustomersList />} />
      <Route path="new" element={<CreateCustomer />} />
      <Route path=":id" element={<CustomerDetail />} />
    </Routes>
  );
}
