import { Route, Routes } from "react-router-dom";
import { RequireAuthDialog } from "./components/AuthDialog";

import Layout from "./layouts/Layout";
import Dashboard from "./pages/student-pages/Dashboard";
import Account from "./pages/student-pages/Account";
import Login from "./pages/student-pages/Login";
import Onboarding from "./pages/student-pages/Onboarding";
import CheckAttendance from "./pages/student-pages/CheckAttendance";
import CalendarPage from "./pages/student-pages/Calendar";
import InboxPage from "./pages/student-pages/Inbox";
import Support from "./pages/student-pages/Support";
import AttendanceViewer from "./pages/lecturer-pages/AttendanceViewer";
import Calendar from "./pages/lecturer-pages/Calendar";
import AllCourses from "./pages/student-pages/AllCourses";

import LecturerLayout from "./layouts/LecturerLayout";
import LecturerInbox from "./pages/lecturer-pages/Inbox";
import LecturerAuth from "./pages/lecturer-pages/PasswordAuth";
import AttendanceDashboard from "./pages/lecturer-pages/Dashboard";
import LecturerAccount from "./pages/lecturer-pages/Account";
import LecturerLogin from "./pages/lecturer-pages/Login";
import StudentSupportPage from "./pages/lecturer-pages/StudentSupportPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminAccount from "./pages/admin/Account";
import AdminDashboard from "./pages/admin/page";
import CreatedCourses from "./pages/admin/CreatedCourses";
import AdminLogin from "./pages/admin/Login";
import AdminCalendarPage from "./pages/admin/Calendar";
import EditCoursesPage from "./pages/admin/EditCourses";
import AdminSupportPage from "./pages/admin/Support";
import AdminRouteProtection from "./pages/admin/AdminRouteProtection";
import LecturerRouteProtection from "./pages/lecturer-pages/LecturerRouteProtection";
import LecturerOnboarding from "./pages/lecturer-pages/Onboarding";
import CourseRegistration from "./pages/student-pages/CourseRegistration";

function App() {
  return (
    <Routes>
      {/* Student routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        {/* Protected routes */}
        <Route
          path="/register-courses"
          element={
            <RequireAuthDialog>
              <CourseRegistration />
            </RequireAuthDialog>
          }
        />
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
          path="/course/:courseId"
          element={
            <RequireAuthDialog>
              <CheckAttendance />
            </RequireAuthDialog>
          }
        />
        <Route
          path="/all-courses"
          element={
            <RequireAuthDialog>
              <AllCourses />
            </RequireAuthDialog>
          }
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      {/* Lecturer routes */}
      <Route path="/lecturer" element={<LecturerLayout />}>
        <Route
          path="/lecturer/login"
          element={
            <LecturerRouteProtection>
              <LecturerLogin />
            </LecturerRouteProtection>
          }
        />
        <Route
          path="/lecturer/auth"
          element={
            <LecturerRouteProtection>
              <LecturerAuth />
            </LecturerRouteProtection>
          }
        />
        <Route
          path="/lecturer"
          element={
            // <LecturerRouteProtection>
              <AttendanceDashboard />
            // </LecturerRouteProtection>
          }
        />
        <Route
          path="/lecturer/attendance"
          element={
            <LecturerRouteProtection>
              <AttendanceViewer />
            </LecturerRouteProtection>
          }
        />
        <Route
          path="/lecturer/calendar"
          element={
            <LecturerRouteProtection>
              <Calendar />
            </LecturerRouteProtection>
          }
        />
        <Route
          path="/lecturer/inbox"
          element={
            <LecturerRouteProtection>
              <LecturerInbox />
            </LecturerRouteProtection>
          }
        />
        <Route
          path="/lecturer/account-profile"
          element={
            <LecturerRouteProtection>
              <LecturerAccount />
            </LecturerRouteProtection>
          }
        />
        <Route
          path="/lecturer/support"
          element={
            <LecturerRouteProtection>
              <StudentSupportPage />
            </LecturerRouteProtection>
          }
        />
        <Route
          path="/lecturer/onboarding"
          element={
            <LecturerRouteProtection>
              <LecturerOnboarding />
            </LecturerRouteProtection>
          }
        />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          path="/admin"
          element={
            // <AdminRouteProtection>
              <AdminDashboard />
            // </AdminRouteProtection>
          }
        />
        <Route
          path="/admin/created-courses"
          element={
            <AdminRouteProtection>
              <CreatedCourses />
            </AdminRouteProtection>
          }
        />
        <Route
          path="/admin/edit-courses"
          element={
            <AdminRouteProtection>
              <EditCoursesPage />
            </AdminRouteProtection>
          }
        />
        <Route
          path="/admin/support"
          element={
            <AdminRouteProtection>
              <AdminSupportPage />
            </AdminRouteProtection>
          }
        />
        <Route
          path="/admin/calendar"
          element={
            <AdminRouteProtection>
              <AdminCalendarPage />
            </AdminRouteProtection>
          }
        />
        <Route
          path="/admin/account-profile"
          element={
            <AdminRouteProtection>
              <AdminAccount />
            </AdminRouteProtection>
          }
        />

        <Route
          path="/admin/login"
          element={
            <AdminRouteProtection>
              <AdminLogin />
            </AdminRouteProtection>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
