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
import AttendanceViewer from "./pages/admin/AttendanceViewer";
import Calendar from "./pages/admin/Calendar";
import AdminInbox from "./pages/admin/AdminInbox";
import StudentSupportPage from "./pages/admin/StudentSupportPage";
import AdminAccount from "./pages/admin/AdminAccount";
import { RequireAuthDialog } from "./components/AuthDialog";

function App() {
  return (
    <Routes>
      {/* Student routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        {/* Protected routes */}
        <Route
          path="/calendar"
          element={
            <RequireAuthDialog>
              <CalendarPage />
            </RequireAuthDialog>
          }
        />
        <Route
          path="/inbox"
          element={
            <RequireAuthDialog>
              <InboxPage />
            </RequireAuthDialog>
          }
        />
        <Route
          path="/account"
          element={
            <RequireAuthDialog>
              <Account />
            </RequireAuthDialog>
          }
        />
        <Route
          path="/support"
          element={
            <RequireAuthDialog>
              <Support />
            </RequireAuthDialog>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <RequireAuthDialog>
              <CheckAttendance />
            </RequireAuthDialog>
          }
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      {/* Lecturer routes */}
      <Route path="/" element={<AdminLayout />}>
        <Route path="/lecturer/login" element={<AdminLoginPage />} />
        <Route path="/lecturer/auth" element={<AdminAuth />} />
        <Route path="/lecturer" element={<AdminDashboard />} />
        <Route path="/lecturer/attendance" element={<AttendanceViewer />} />
        <Route path="/lecturer/calendar" element={<Calendar />} />
        <Route path="/lecturer/inbox" element={<AdminInbox />} />
        <Route path="/lecturer/account" element={<AdminAccount />} />
        <Route path="/lecturer/support" element={<StudentSupportPage />} />
      </Route>
    </Routes>
  );
}

export default App;
