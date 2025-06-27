import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import Login from './pages/Login.jsx'
import ManagerDashboard from './pages/ManagerDashboard.jsx'
import EmployeeDashboard from './pages/EmployeeDashboard.jsx'
import './App.css'

function ProtectedRoute({ children, roleRequired }) {
  const { token, role } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace/>;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to={role === 'manager' ? '/manager' : '/employee'} replace/>;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute roleRequired="manager"><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/manager" element={<ProtectedRoute roleRequired="manager"><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/employee" element={<ProtectedRoute roleRequired="employee"><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace/>} />
    </Routes>
  )
}

export default App
