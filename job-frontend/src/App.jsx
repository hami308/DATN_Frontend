import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import RegisterChoicePage from "./pages/register/registerChoice";
import RegisterPage from "./pages/register/register";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registerChoice" element={<RegisterChoicePage />} />
        <Route path="/register/:role" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
