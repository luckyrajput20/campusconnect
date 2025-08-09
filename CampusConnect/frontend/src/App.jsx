"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Login from "./pages/Login"
import AdminDashboard from "./pages/admin/Dashboard"
import FacultyDashboard from "./pages/faculty/Dashboard"
import StudentDashboard from "./pages/student/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import LoadingSpinner from "./components/LoadingSpinner"

// Admin Pages
import AdminUsers from "./pages/admin/Users"
import AdminClasses from "./pages/admin/Classes"
import AdminSubjects from "./pages/admin/Subjects"
import AdminTimetable from "./pages/admin/Timetable"
import AdminNotices from "./pages/admin/Notices"
import AdminReports from "./pages/admin/Reports"

// Faculty Pages
import FacultySubjects from "./pages/faculty/Subjects"
import FacultyAttendance from "./pages/faculty/Attendance"
import FacultyMarks from "./pages/faculty/Marks"
import FacultyTimetable from "./pages/faculty/Timetable"
import FacultyNotices from "./pages/faculty/Notices"

// Student Pages
import StudentAttendance from "./pages/student/Attendance"
import StudentMarks from "./pages/student/Marks"
import StudentTimetable from "./pages/student/Timetable"
import StudentNotices from "./pages/student/Notices"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/classes"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/subjects"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminSubjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/timetable"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminTimetable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notices"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminNotices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminReports />
          </ProtectedRoute>
        }
      />

      {/* Faculty Routes */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/subjects"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultySubjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/attendance"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/marks"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyMarks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/timetable"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyTimetable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/notices"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyNotices />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/marks"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentMarks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/timetable"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentTimetable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/notices"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentNotices />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={user ? <Navigate to={`/${user.role}`} replace /> : <Navigate to="/login" replace />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <p className="text-gray-600">Page not found</p>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

export default App
