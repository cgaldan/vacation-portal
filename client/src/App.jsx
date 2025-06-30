import React, { useContext } from 'react'
import { Routes, Route, Navigate, useLocation, redirect } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import Login from './pages/Login.jsx'
import Layout from './components/Layout.jsx'
import ManagerDashboard from './pages/ManagerDashboard.jsx'
import EmployeeDashboard from './pages/EmployeeDashboard.jsx'
import NotFound from './pages/NotFound.jsx'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/manager" element={<ProtectedRoute roleRequired="manager"><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/employee" element={<ProtectedRoute roleRequired="employee"><EmployeeDashboard /></ProtectedRoute>} />
        <Route path='/' element={<HomeRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

function ProtectedRoute({ children, roleRequired=null, redirectToLogin=true }) {
  const { token, role } = useContext(AuthContext);
  const location = useLocation();
  
  if (!token) {
    return redirectToLogin ? <Navigate to="/login" state={{ from: location }} replace/> : null;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/login" replace/>
  }

  return typeof children === 'function' ? children({ role }) : children;
}

function HomeRedirect() {
  const { token, role } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace/>
  }

  if (role === 'manager') {
    return <Navigate to="/manager" replace/>
  } else {
    return <Navigate to="/employee" replace/>
  }
}

export default App
