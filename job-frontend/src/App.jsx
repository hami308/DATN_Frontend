import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/login/login";
import RegisterChoicePage from "./pages/register/registerChoicePage";
import RegisterPage from "./pages/register/registerPage";
import VerifyEmailPage from "./pages/verifyAccount/verifyEmailPage";
import VerifyPhonePage from "./pages/verifyAccount/verifyPhonePage";
import HomepageRecuiter from "./pages/Homepage_Recuiter/Homepage_Recuiter";
import Recuiter_Infor from "./pages/Recuiter_Infor/Recuiter_Infor";
import Conditions from "./pages/Post_news/Conditions/Conditions";
import CreateJob from "./pages/Post_news/Create_news/Create_news";
import HomepageCandidate from "./pages/HomepageCandidate/HomepageCandidate";
import Candidate_Infor from "./pages/Candidate_Infor/Candidate_Infor";
import ChangePassword from "./pages/ChangePasssword/ChangePasssword";
import SavedJob from "./pages/Saved_jobs/Saved_job";
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
        <Route path="/recuiter-profile" element={<Recuiter_Infor />} />
        <Route path="/post-news/conditions" element={<Conditions />} />
        <Route path="/post-news/create-job" element={<CreateJob />} />

        <Route path="/home-candidate" element={<HomepageCandidate />} />
        <Route path="/candidate-profile" element={<Candidate_Infor />} />
        <Route path="/candidate-change-password" element={<ChangePassword />} />
        <Route path="/saved-jobs" element={<SavedJob />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
