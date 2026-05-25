import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/login/login";
import RegisterChoicePage from "./pages/register/registerChoicePage";
import RegisterPage from "./pages/register/registerPage";
import VerifyEmailPage from "./pages/verifyAccount/verifyEmailPage";
import VerifyPhonePage from "./pages/verifyAccount/verifyPhonePage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ForgotPasswordOtp from "./pages/ForgotPassword/ForgotPasswordOtp";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import HomepageRecuiter from "./pages/Homepage_Recuiter/Homepage_Recuiter";
import Recuiter_Infor from "./pages/Recuiter_Infor/Recuiter_Infor";
import Conditions from "./pages/Post_news/Conditions/Conditions";
import CreateJob from "./pages/Post_news/Create_news/Create_news";
import HomepageCandidate from "./pages/HomepageCandidate/HomepageCandidate";
import Candidate_Infor from "./pages/Candidate_Infor/Candidate_Infor";
import ChangePassword from "./pages/ChangePasssword/ChangePasssword";
import SavedJob from "./pages/Saved_jobs/Saved_job";
import Company_Infor from "./pages/Company_Infor/Company_Infor/Company_Infor";
import Verify_paper from "./pages/Company_Infor/Verify_paper/Verify_paper";
import ManageRecuitment from "./pages/Manage_Recuitment/Manage_Recuitment";
import Applied_jobs from "./pages/Applied_jobs/Applied_jobs";
import CV_management from "./pages/CV_management/CV_management";
import Company_page from "./pages/Company_page/Company_page";
import Home_admin from "./pages/Home_admin/Home_admin";
import AdminCompanyVerification from "./pages/Home_admin/AdminCompanyVerification";
import Job_Details from "./pages/Job_Details/Job_Details";
import CV_list from "./pages/Manage_Recuitment/CV_list/CV_list";
import Account_page from "./pages/Account_management/Account_page";
import Company_management from "./pages/Company_management/company_page";
import Notifications from "./pages/Notifications/Notifications";
import RecruiterDashboard from "./pages/Recruiter_Dashboard/Recruiter_Dashboard";

/* =========================
   Lấy user từ localStorage
========================= */
const getUserFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || null;
  } catch (error) {
    console.error("Lỗi đọc user từ localStorage:", error);
    return null;
  }
};

/* =========================
   Lấy trang home theo role
========================= */
const getHomePathByRole = (role) => {
  switch (role) {
    case "recruiter":
      return "/home-recruiter";

    case "candidate":
      return "/home-candidate";

    case "admin":
      return "/admin-dashboard";

    default:
      return "/";
  }
};

/* =========================
   Route trang chủ
   Nếu đã đăng nhập thì chuyển theo role
========================= */
const HomeRedirect = () => {
  const user = getUserFromStorage();

  if (!user) {
    return <Homepage />;
  }

  const homePath = getHomePathByRole(user.role);

  if (homePath === "/") {
    return <Homepage />;
  }

  return <Navigate to={homePath} replace />;
};

/* =========================
   Route login
   Nếu đã đăng nhập ở tab khác thì không cho vào login
========================= */
const LoginRedirect = () => {
  const user = getUserFromStorage();

  if (!user) {
    return <Login />;
  }

  const homePath = getHomePathByRole(user.role);

  if (homePath === "/") {
    return <Login />;
  }

  return <Navigate to={homePath} replace />;
};

import PublicJob from "./pages/Homepage/PublicJobs";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Auth */}
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/registerChoice" element={<RegisterChoicePage />} />
        <Route path="/register/:role" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-phone" element={<VerifyPhonePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/otp" element={<ForgotPasswordOtp />} />
        <Route
          path="/forgot-password/reset-password"
          element={<ResetPassword />}
        />

        {/* Recruiter */}
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/home-recruiter" element={<HomepageRecuiter />} />
        <Route path="/recruiter-profile" element={<Recuiter_Infor />} />
        <Route
          path="/recruiter-profile/:profileId"
          element={<Recuiter_Infor />}
        />
        <Route
          path="/recruiter-profile/:profileId"
          element={<Recuiter_Infor />}
        />
        <Route path="/post-news/conditions" element={<Conditions />} />
        <Route path="/post-news/create-job" element={<CreateJob />} />
        <Route path="/post-news/create-job/:id" element={<CreateJob />} />
        <Route path="/company-profile" element={<Company_Infor />} />
        <Route path="/business-paper" element={<Verify_paper />} />
        <Route path="/manage-recruitment" element={<ManageRecuitment />} />
        <Route path="/job-applicants/:jobId" element={<CV_list />} />
        <Route
          path="/recruiter-notifications"
          element={<Notifications />}
        />

        {/* Candidate */}
        <Route path="/home-candidate" element={<HomepageCandidate />} />
        <Route path="/candidate-profile" element={<Candidate_Infor />} />
        <Route
          path="/candidate-profile/:profileId"
          element={<Candidate_Infor />}
        />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/saved-jobs" element={<SavedJob />} />
        <Route path="/candidate-change-password" element={<ChangePassword />} />
        <Route path="/saved-jobs" element={<SavedJob />} />
        <Route path="/business-paper" element={<Verify_paper />} />
        <Route path="/manage-recruitment" element={<ManageRecuitment />} />
        <Route
          path="/candidate-profile/:profileId"
          element={<Candidate_Infor />}
        />
        <Route path="/saved-jobs" element={<SavedJob />} />
        <Route path="/applied-jobs" element={<Applied_jobs />} />
        <Route path="/cv-management" element={<CV_management />} />
        <Route
          path="/candidate-notifications"
          element={<Notifications />}
        />

        {/* Common */}
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/candidate-change-password" element={<ChangePassword />} />
        <Route path="/company-detail/:companyId" element={<Company_page />} />
        <Route path="/job-details/:id" element={<Job_Details />} />

        {/* Admin */}
        <Route path="/home-admin" element={<Home_admin />} />
        <Route path="/admin-dashboard" element={<Home_admin />} />
        <Route
          path="/admin-company-verification"
          element={<AdminCompanyVerification />}
        />
        <Route path="/admin-account-management" element={<Account_page />} />
        <Route
          path="/admin-company-management"
          element={<Company_management />}
        />

        {/* Không tìm thấy route */}
        <Route path="*" element={<HomeRedirect />} />
        <Route path="/job-details/:id" element={<Job_Details />} />
        <Route path="/job-applicants/:jobId" element={<CV_list />} />
        <Route path="/admin-account-management" element={<Account_page />} />
        <Route
          path="/admin-company-management"
          element={<Company_management />}
        />
        <Route path="/public-jobs" element={<PublicJob />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
