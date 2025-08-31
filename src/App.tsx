import { Route, Routes } from "react-router-dom";
import { RequireAuthDialog } from "./components/AuthDialog";

import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import CheckAttendance from "./pages/CheckAttendance";
import CalendarPage from "./pages/Calendar";
import InboxPage from "./pages/Inbox";
import Support from "./pages/Support";
import AttendanceViewer from "./lecturer-pages/AttendanceViewer";
import Calendar from "./lecturer-pages/Calendar";

import LecturerLayout from "./layouts/LecturerLayout";
import LecturerInbox from "./lecturer-pages/Inbox";
import LecturerAuth from "./lecturer-pages/PasswordAuth";
import AttendanceDashboard from "./lecturer-pages/Dashboard";
import LecturerAccount from "./lecturer-pages/Account";
import LecturerLogin from "./lecturer-pages/Login";
import StudentSupportPage from "./lecturer-pages/StudentSupportPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminAccount from "./admin/Account";
import AdminDashboard from "./admin/page";
import CreatedCourses from "./admin/CreatedCourses";

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
          path="/account-profile"
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
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      {/* Lecturer routes */}
      <Route path="/lecturer" element={<LecturerLayout />}>
        <Route path="/lecturer/login" element={<LecturerLogin />} />
        <Route path="/lecturer/auth" element={<LecturerAuth />} />
        <Route path="/lecturer" element={<AttendanceDashboard />} />
        <Route path="/lecturer/attendance" element={<AttendanceViewer />} />
        <Route path="/lecturer/calendar" element={<Calendar />} />
        <Route path="/lecturer/inbox" element={<LecturerInbox />} />
        <Route path="/lecturer/account-profile" element={<LecturerAccount />} />
        <Route path="/lecturer/support" element={<StudentSupportPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/created-courses" element={<CreatedCourses />} />
        <Route path="/admin/account-profile" element={<AdminAccount />} />
      </Route>
    </Routes>
  );
}

export default App;
