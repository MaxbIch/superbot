import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import TransportPage from "./pages/TransportPage";
import CurrencyPage from "./pages/CurrencyPage";
import HousingPage from "./pages/HousingPage";
import VisaPage from "./pages/VisaPage.tsx";
import ToursPage from "./pages/ToursPage";
import TourDetailPage from "./pages/TourDetailPage";
import PlacesPage from "./pages/PlacesPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import ReviewsPage from "./pages/ReviewsPage";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/currency" element={<CurrencyPage />} />
          <Route path="/housing" element={<HousingPage />} />
          <Route path="/visarun" element={<VisaPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tours/:id" element={<TourDetailPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/places/:id" element={<PlaceDetailPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Routes>
      </BrowserRouter>
  );
}
