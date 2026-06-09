import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminPerkara from './pages/admin/Perkara'
import AdminTambah from './pages/admin/TambahPerkara'
import AdminEdit from './pages/admin/EditPerkara'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN - protected */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="perkara" element={<AdminPerkara />} />
          <Route path="perkara/tambah" element={<AdminTambah />} />
          <Route path="perkara/edit/:id" element={<AdminEdit />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}
