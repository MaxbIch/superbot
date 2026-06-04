import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import TransportPage from "./pages/TransportPage";
import CurrencyPage from "./pages/CurrencyPage";
import HousingPage from "./pages/HousingPage";
import VisaRunPage from "./pages/VisaRunPage";
import ToursPage from "./pages/ToursPage";
import PlacesPage from "./pages/PlacesPage";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/currency" element={<CurrencyPage />} />
          <Route path="/housing" element={<HousingPage />} />
          <Route path="/visarun" element={<VisaRunPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/places" element={<PlacesPage />} />
        </Routes>
      </BrowserRouter>
  );
}