import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ui/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import ItemDetail from "./pages/ItemDetail";
import Upload from "./pages/Upload";
import MyItems from "./pages/MyItems";
import Wishlist from "./pages/Wishlist";
import MySwaps from "./pages/MySwaps";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
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
              <Route path="/browse" element={<Browse />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-items"
                element={
                  <ProtectedRoute>
                    <MyItems />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-swaps"
                element={
                  <ProtectedRoute>
                    <MySwaps />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <div className="p-8 text-center">Settings - Coming Soon</div>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/how-it-works"
                element={
                  <div className="p-8 text-center">
                    How It Works - Coming Soon
                  </div>
                }
              />
              <Route
                path="/about"
                element={
                  <div className="p-8 text-center">About - Coming Soon</div>
                }
              />
              <Route
                path="*"
                element={
                  <div className="p-8 text-center">404 - Page Not Found</div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#10B981",
              color: "#fff",
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
