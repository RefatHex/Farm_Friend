import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import "./App.css";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import WeatherUpdatePage from "./pages/WeatherUpdatePage";
import EquipmentPage from "./pages/EquipmentPage";
import EquipmentListPage from "./pages/EquipmentListPage";
import EquipmentPostForm from "./components/EquipmentPostForm";
import AdminEquipmentApprovalPage from "./pages/AdminEquipmentApprovalPage";
import ProfilePage from "./pages/ProfilePage";
import AccountSelectPage from "./pages/AccountSelectPage";
import FarmerLandingPage from "./pages/FarmerLandingPage";
import RentalOrdersPage from "./pages/RentalOrdersPage";
import MyRentalsPage from "./pages/MyRentalsPage";
import RentalAdminDashboard from "./pages/RentalAdminDashboard";
import RentGigActions from "./pages/RentGigActions";
import FertilizerRecommendationPage from "./pages/FertilizerRecommendationPage";
import CropRecommendationPage from "./pages/CropRecommendationPage";
// Agronomist/Expert imports
import AgronomistDashboardPage from "./pages/AgronomistDashboardPage";
import AgronomistProfileSetupPage from "./pages/AgronomistProfileSetupPage";
import ExpertsListPage from "./pages/ExpertsListPage";
import MyConsultationsPage from "./pages/MyConsultationsPage";
// Storage imports
import StoragePage from "./pages/StoragePage";
import StorageAdminDashboard from "./pages/StorageAdminDashboard";
import MyStorageBookingsPage from "./pages/MyStorageBookingsPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/weather" element={<WeatherUpdatePage />} />
          <Route path="/equipment-list" element={<EquipmentListPage />} />
          <Route path="/post-equipment" element={<EquipmentPostForm />} />
          <Route path="/equipment-post" element={<EquipmentPostForm />} />
          <Route
            path="/admin-approval"
            element={<AdminEquipmentApprovalPage />}
          />
          <Route path="/equipment/:id" element={<EquipmentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account-select" element={<AccountSelectPage />} />
          <Route path="/farmer-dashboard" element={<FarmerLandingPage />} />
          <Route path="/my-rentals" element={<RentalOrdersPage />} />
          <Route path="/manage-rentals" element={<MyRentalsPage />} />
          <Route path="/rental-admin" element={<RentalAdminDashboard />} />
          <Route path="/rent-gig-actions" element={<RentGigActions />} />
          <Route
            path="/fertilizer"
            element={<FertilizerRecommendationPage />}
          />
          <Route path="/crop-advice" element={<CropRecommendationPage />} />
          {/* Agronomist/Expert Routes */}
          <Route path="/agronomist-dashboard" element={<AgronomistDashboardPage />} />
          <Route path="/agronomist-profile-setup" element={<AgronomistProfileSetupPage />} />
          <Route path="/experts" element={<ExpertsListPage />} />
          <Route path="/my-consultations" element={<MyConsultationsPage />} />
          {/* Storage Routes */}
          <Route path="/storage" element={<StoragePage />} />
          <Route path="/storage-dashboard" element={<StorageAdminDashboard />} />
          <Route path="/my-storage-bookings" element={<MyStorageBookingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
