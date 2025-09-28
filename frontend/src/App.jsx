"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/AdminDashboard"
import UserDashboard from "./pages/UserDashboard"
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={user ? <Navigate to={getDashboardRoute(user.role)} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={getDashboardRoute(user.role)} /> : <Register />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["system_admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["normal_user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store-owner"
            element={
              <ProtectedRoute allowedRoles={["store_owner"]}>
                <StoreOwnerDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>
    </div>
  )
}

function getDashboardRoute(role) {
  switch (role) {
    case "system_admin":
      return "/admin"
    case "normal_user":
      return "/dashboard"
    case "store_owner":
      return "/store-owner"
    default:
      return "/login"
  }
}

export default App
