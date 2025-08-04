import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import CheckAttendance from "./pages/CheckAttendance";
import CalendarPage from "./pages/Calendar";
import InboxPage from "./pages/Inbox";
import Support from "./pages/Support";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/support" element={<Support />} />
          <Route path="/courses/:courseId" element={<CheckAttendance />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/lecturers/login" element={<AdminLoginPage />} />
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route path="/admin/lecturers" element={<AdminDashboard />} />
        </Route>
      </Routes>
  );
}

export default App;
