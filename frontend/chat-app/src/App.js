import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Notifications from "./pages/Notification";

// Dummy auth check (replace with real logic later)
const isAuthenticated = () => {
  return localStorage.getItem("token");
};

// Protected Route
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Route */}
        <Route
          path="/"
          element={
            // <PrivateRoute>
            <Home />
            // </PrivateRoute>
          }
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />
        {/* Redirect unknown routes */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;