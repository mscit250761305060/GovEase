import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import AadhaarServices from "./pages/AadhaarServices";
import AadhaarNameUpdate from "./pages/AadhaarNameUpdate";
import ApplicationForm from "./pages/ApplicationForm";
import MyApplications from "./pages/MyApplications";
import ApplicationDetail from "./pages/ApplicationDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/services" element={<Services />} />

        <Route
          path="/services/aadhaar"
          element={<AadhaarServices />}
        />

        <Route
          path="/services/aadhaar/name-update"
          element={
            <ProtectedRoute>
              <AadhaarNameUpdate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/application/aadhaar/name-update"
          element={<ApplicationForm />}
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/:applicationNumber"
          element={
            <ProtectedRoute>
              <ApplicationDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
