import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReportsList } from './ReportsList';

export function ReportsPage() {
  return (
    <Routes>
      <Route index element={<ReportsList />} />
    </Routes>
  );
}
