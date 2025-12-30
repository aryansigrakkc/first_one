import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MainLayout from './components/MainLayout';
import GetCategoryBlog from './components/GetCategoryBlog';
import GetBlog from './components/GetBlog';
import User from './components/User';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/getcategoryblog"
          element={
            <ProtectedRoute>
              <MainLayout>
                <GetCategoryBlog />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/getblog"
          element={
            <ProtectedRoute>
              <MainLayout>
                <GetBlog />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <MainLayout>
                <User />
              </MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
