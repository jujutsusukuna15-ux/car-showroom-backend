import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SparePartsList } from './SparePartsList';
import { SparePartDetail } from './SparePartDetail';
import { CreateSparePart } from './CreateSparePart';

export function SparePartsPage() {
  return (
    <Routes>
      <Route index element={<SparePartsList />} />
      <Route path="new" element={<CreateSparePart />} />
      <Route path=":id" element={<SparePartDetail />} />
    </Routes>
  );
}
