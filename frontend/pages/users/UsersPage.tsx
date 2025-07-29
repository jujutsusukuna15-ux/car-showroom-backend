import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UsersList } from './UsersList';
import { UserDetail } from './UserDetail';
import { CreateUser } from './CreateUser';

export function UsersPage() {
  return (
    <Routes>
      <Route index element={<UsersList />} />
      <Route path="new" element={<CreateUser />} />
      <Route path=":id" element={<UserDetail />} />
    </Routes>
  );
}
