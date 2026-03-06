import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar     from "@/components/Navbar";
import DetectPage from "@/pages/DetectPage";
import ReportPage from "@/pages/ReportPage";
import AdminPage  from "@/pages/AdminPage";
import LandingPage from "@/pages/LandingPage";
import NumbersPage from "@/pages/NumbersPage";
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg text-white">
        <Navbar />
        <main className="pb-20">
          <Routes>
            <Route path="/"       element={<LandingPage />} />
            <Route path="/detect" element={<DetectPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/admin"  element={<AdminPage />}  />
            <Route path="/numbers" element={<NumbersPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
