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
import AttendanceViewer from "./lecturer-pages/AttendanceViewer";
import Calendar from "./lecturer-pages/Calendar";
import AdminInbox from "./lecturer-pages/Inbox";
import StudentSupportPage from "./lecturer-pages/StudentSupportPage";
import AdminAccount from "./lecturer-pages/Account";
import { RequireAuthDialog } from "./components/AuthDialog";
import AdminCreateCourse from "./admin/page";
import LecturerLayout from "./layouts/LecturerLayout";
import LecturerAuth from "./lecturer-pages/PasswordAuth";
import AttendanceDashboard from "./lecturer-pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";

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
      <Route path="/" element={<LecturerLayout />}>
        <Route path="/lecturer/login" element={<Login />} />
        <Route path="/lecturer/auth" element={<LecturerAuth />} />
        <Route path="/lecturer" element={<AttendanceDashboard />} />
        <Route path="/lecturer/attendance" element={<AttendanceViewer />} />
        <Route path="/lecturer/calendar" element={<Calendar />} />
        <Route path="/lecturer/inbox" element={<AdminInbox />} />
        <Route path="/lecturer/account" element={<AdminAccount />} />
        <Route path="/lecturer/support" element={<StudentSupportPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/" element={<AdminLayout />}>
        <Route path="/admin" element={<AdminCreateCourse />} />
      </Route>
    </Routes>
  );
}

export default App;
