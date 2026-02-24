import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import VendorLayout from "./components/layout/VendorLayout";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorListings from "./pages/vendor/VendorListings";
import ListingForm from "./pages/vendor/ListingForm";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminListings from "./pages/admin/AdminListings";
import AdminUsers from "./pages/admin/AdminUsers";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Feedback from "./pages/Feedback";
import AuthUser from "./pages/authUser";
import CounselingForm from "./pages/counselingForm";
import AdminQuery from "./pages/admin/counselingQuery";
import Forget from "./pages/forget";
import Otp from "./pages/otp";
import ResetPassword from "./pages/resetPassword";
import AdminListingQuery from "./pages/admin/ListingQuery";
import AdminLocation from "./pages/admin/AdminAreaLocation";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<AuthUser><Login /></AuthUser>} />
            <Route path="/forgot-password" element={<AuthUser><Forget /></AuthUser>} />
            <Route path="/verify-otp" element={<AuthUser><Otp /></AuthUser>} />
            <Route path="/reset-password" element={<AuthUser><ResetPassword /></AuthUser>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/counseling" element={<CounselingForm />} />
            {/* Protected User Route */}
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="listings" element={<AdminListings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="query" element={<AdminQuery />} />
              <Route path="listing-query" element={<AdminListingQuery />} />
              <Route path="location" element={<AdminLocation />} />
            </Route>

            {/* Vendor Routes */}
            <Route path="/vendor" element={<VendorLayout />}>
              <Route path="dashboard" element={<VendorDashboard />} />
              <Route path="listings" element={<VendorListings />} />
              <Route path="listings/add" element={<ListingForm />} />
              <Route path="listings/edit/:id" element={<ListingForm />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
