import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import Report from './pages/Report';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

export default function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={
          <ProtectedRoute>
            <AppLayout>
              <ProductList
                reloadKey={reloadKey}
                onEdit={(row) => { setEditing(row); setFormOpen(true); }}
                onCreate={() => { setEditing(null); setFormOpen(true); }}
              />
              <ProductForm
                open={formOpen}
                editing={editing}
                onClose={() => setFormOpen(false)}
                onSaved={() => setReloadKey((k) => k + 1)}
              />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute>
            <AppLayout>
              <Report />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/products" />} />
      </Routes>
    </BrowserRouter>
  );
}