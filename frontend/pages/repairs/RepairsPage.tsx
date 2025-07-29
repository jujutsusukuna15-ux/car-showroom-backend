import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RepairsList } from './RepairsList';
import { RepairDetail } from './RepairDetail';
import { CreateRepair } from './CreateRepair';

export function RepairsPage() {
  return (
    <Routes>
      <Route index element={<RepairsList />} />
      <Route path="new" element={<CreateRepair />} />
      <Route path=":id" element={<RepairDetail />} />
    </Routes>
  );
}
