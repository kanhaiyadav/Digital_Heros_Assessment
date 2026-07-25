import { Route, Routes } from "react-router-dom"

import { AdminDashboard } from "@/pages/AdminDashboard"
import { Docs } from "@/pages/Docs"
import { Landing } from "@/pages/Landing"
import { NotFound } from "@/pages/NotFound"
import { ProtectedRoute } from "@/routes/ProtectedRoute"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Landing />} />
      <Route path="/docs" element={<Docs />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
