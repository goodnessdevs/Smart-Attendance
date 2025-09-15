import { Route, Routes } from "react-router-dom";
import RouteProtection from "./components/RouteProtection";

// Layouts
import Layout from "./layouts/Layout";
import LecturerLayout from "./layouts/LecturerLayout";
import AdminLayout from "./layouts/AdminLayout";

// Student pages
import Dashboard from "./pages/student-pages/Dashboard";
import Account from "./pages/student-pages/Account";
import Login from "./pages/student-pages/Login";
import Onboarding from "./pages/student-pages/Onboarding";
import MarkAttendance from "./pages/student-pages/MarkAttendance";
import CalendarPage from "./pages/student-pages/Calendar";
import InboxPage from "./pages/student-pages/Inbox";
import Support from "./pages/student-pages/Support";
import AllCourses from "./pages/student-pages/AllCourses";
import CourseRegistration from "./pages/student-pages/CourseRegistration";

// Lecturer pages
import PublishAttendance from "./pages/lecturer-pages/PublishAttendance";
import Calendar from "./pages/lecturer-pages/Calendar";
import LecturerInbox from "./pages/lecturer-pages/Inbox";
import LecturerAuth from "./pages/lecturer-pages/PasswordAuth";
import AttendanceDashboard from "./pages/lecturer-pages/Dashboard";
import LecturerAccount from "./pages/lecturer-pages/Account";
import LecturerLogin from "./pages/lecturer-pages/Login";
import StudentSupportPage from "./pages/lecturer-pages/StudentSupportPage";
import LecturerOnboarding from "./pages/lecturer-pages/Onboarding";
import LecturerCourseRegistration from "./pages/lecturer-pages/LecturerCourseRegistration";

// Admin pages
import AdminAccount from "./pages/admin/Account";
import AdminDashboard from "./pages/admin/Dashboard";
import CreatedCourses from "./pages/admin/CreatedCourses";
import AdminLogin from "./pages/admin/Login";
import AdminCalendarPage from "./pages/admin/Calendar";
import EditCoursesPage from "./pages/admin/EditCourses";
import AdminSupportPage from "./pages/admin/Support";
import SignedOutDashboard from "./components/SignedOutDashboard";
import AttendanceList from "./pages/lecturer-pages/AttendanceList";

function App() {
  return (
    <Routes>
      {/* ---------------- Signed-out landing pages ---------------- */}
      <Route path="/" element={<SignedOutDashboard />} />
      <Route path="/lecturer" element={<SignedOutDashboard />} />
      <Route path="/admin" element={<SignedOutDashboard />} />

      {/* ---------------- Student Routes ---------------- */}
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <RouteProtection requiredRole="student">
              <Dashboard />
            </RouteProtection>
          }
        />
        <Route
          path="/register-courses"
          element={
            <RouteProtection requiredRole="student">
              <CourseRegistration />
            </RouteProtection>
          }
        />
        <Route
          path="/calendar"
          element={
            <RouteProtection requiredRole="student">
              <CalendarPage />
            </RouteProtection>
          }
        />
        <Route
          path="/inbox"
          element={
            <RouteProtection requiredRole="student">
              <InboxPage />
            </RouteProtection>
          }
        />
        <Route
          path="/account-profile"
          element={
            <RouteProtection requiredRole="student">
              <Account />
            </RouteProtection>
          }
        />
        <Route
          path="/support"
          element={
            <RouteProtection requiredRole="student">
              <Support />
            </RouteProtection>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <RouteProtection requiredRole="student">
              <MarkAttendance />
            </RouteProtection>
          }
        />
        <Route
          path="/all-courses"
          element={
            <RouteProtection requiredRole="student">
              <AllCourses />
            </RouteProtection>
          }
        />
      </Route>

      {/* ---------------- Lecturer Routes ---------------- */}
      <Route element={<LecturerLayout />}>
        {/* Public */}
        <Route path="/lecturer/login" element={<LecturerLogin />} />
        <Route path="/lecturer/auth" element={<LecturerAuth />} />
        <Route path="/lecturer/onboarding" element={<LecturerOnboarding />} />

        {/* Protected */}
        <Route
          path="/lecturer/dashboard"
          element={
            <RouteProtection requiredRole="lecturer">
              <AttendanceDashboard />
            </RouteProtection>
          }
        />
        <Route
          path="/lecturer/publish-attendance"
          element={
            <RouteProtection requiredRole="lecturer">
              <PublishAttendance />
            </RouteProtection>
          }
        />
        <Route
          path="/lecturer/attendance/:courseId"
          element={
            <RouteProtection requiredRole="lecturer">
              <AttendanceList />
            </RouteProtection>
          }
        />
        <Route
          path="/lecturer/register-courses"
          element={
            <RouteProtection requiredRole="lecturer">
              <LecturerCourseRegistration />
            </RouteProtection>
          }
        />
        <Route
          path="/lecturer/calendar"
          element={
            <RouteProtection requiredRole="lecturer">
              <Calendar />
            </RouteProtection>
          }
        />
        <Route
          path="/lecturer/inbox"
          element={
            <RouteProtection requiredRole="lecturer">
              <LecturerInbox />
            </RouteProtection>
          }
        />
        <Route
          path="/lecturer/account-profile"
          element={
            <RouteProtection requiredRole="lecturer">
              <LecturerAccount />
            </RouteProtection>
          }
        />
        <Route
          path="/lecturer/support"
          element={
            <RouteProtection requiredRole="lecturer">
              <StudentSupportPage />
            </RouteProtection>
          }
        />
      </Route>

      {/* ---------------- Admin Routes ---------------- */}
      <Route element={<AdminLayout />}>
        {/* Public */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected */}
        <Route
          path="/admin/dashboard"
          element={
            <RouteProtection requiredRole="admin">
              <AdminDashboard />
            </RouteProtection>
          }
        />
        <Route
          path="/admin/created-courses"
          element={
            <RouteProtection requiredRole="admin">
              <CreatedCourses />
            </RouteProtection>
          }
        />
        <Route
          path="/admin/edit-courses"
          element={
            <RouteProtection requiredRole="admin">
              <EditCoursesPage />
            </RouteProtection>
          }
        />
        <Route
          path="/admin/support"
          element={
            <RouteProtection requiredRole="admin">
              <AdminSupportPage />
            </RouteProtection>
          }
        />
        <Route
          path="/admin/calendar"
          element={
            <RouteProtection requiredRole="admin">
              <AdminCalendarPage />
            </RouteProtection>
          }
        />
        <Route
          path="/admin/account-profile"
          element={
            <RouteProtection requiredRole="admin">
              <AdminAccount />
            </RouteProtection>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
