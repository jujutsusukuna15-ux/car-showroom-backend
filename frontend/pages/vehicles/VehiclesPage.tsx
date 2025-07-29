import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { VehiclesList } from './VehiclesList';
import { VehicleDetail } from './VehicleDetail';
import { CreateVehicle } from './CreateVehicle';

export function VehiclesPage() {
  return (
    <Routes>
      <Route index element={<VehiclesList />} />
      <Route path="new" element={<CreateVehicle />} />
      <Route path=":id" element={<VehicleDetail />} />
    </Routes>
  );
}
