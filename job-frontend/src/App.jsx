import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/login/login";
import RegisterChoicePage from "./pages/register/registerChoicePage";
import RegisterPage from "./pages/register/registerPage";
import VerifyEmailPage from "./pages/verifyAccount/verifyEmailPage";
import VerifyPhonePage from "./pages/verifyAccount/verifyPhonePage";
import HomepageRecuiter from "./pages/Homepage_Recuiter/Homepage_Recuiter";
import SearchBar from "./components/SearchBar/SearchBar";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerChoice" element={<RegisterChoicePage />} />
        <Route path="/register/:role" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-phone" element={<VerifyPhonePage />} />
        <Route path="/home-recuiter" element={<HomepageRecuiter />} />
        <Route path="home-recuiter" element={<HomepageRecuiter />} />
        <Route path="/search" element={<SearchBar />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
