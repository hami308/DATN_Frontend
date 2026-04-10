import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/login/login";
import RegisterChoicePage from "./pages/register/registerChoice";
import RegisterPage from "./pages/register/register";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
         <Route path="/login" element={<Login />} />
        <Route path="/registerChoice" element={<RegisterChoicePage />} />
        <Route path="/register/:role" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;