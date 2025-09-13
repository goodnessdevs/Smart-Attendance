// import { Route, Routes } from "react-router-dom";
// import { RequireAuthDialog } from "./components/AuthDialog";

// import Layout from "./layouts/Layout";
// import Dashboard from "./pages/student-pages/Dashboard";
// import Account from "./pages/student-pages/Account";
// import Login from "./pages/student-pages/Login";
// import Onboarding from "./pages/student-pages/Onboarding";
// import CheckAttendance from "./pages/student-pages/CheckAttendance";
// import CalendarPage from "./pages/student-pages/Calendar";
// import InboxPage from "./pages/student-pages/Inbox";
// import Support from "./pages/student-pages/Support";
// import PublishAttendance from "./pages/lecturer-pages/PublishAttendance";
// import Calendar from "./pages/lecturer-pages/Calendar";
// import AllCourses from "./pages/student-pages/AllCourses";

// import LecturerLayout from "./layouts/LecturerLayout";
// import LecturerInbox from "./pages/lecturer-pages/Inbox";
// import LecturerAuth from "./pages/lecturer-pages/PasswordAuth";
// import AttendanceDashboard from "./pages/lecturer-pages/Dashboard";
// import LecturerAccount from "./pages/lecturer-pages/Account";
// import LecturerLogin from "./pages/lecturer-pages/Login";
// import StudentSupportPage from "./pages/lecturer-pages/StudentSupportPage";

// import AdminLayout from "./layouts/AdminLayout";
// import AdminAccount from "./pages/admin/Account";
// import AdminDashboard from "./pages/admin/page";
// import CreatedCourses from "./pages/admin/CreatedCourses";
// import AdminLogin from "./pages/admin/Login";
// import AdminCalendarPage from "./pages/admin/Calendar";
// import EditCoursesPage from "./pages/admin/EditCourses";
// import AdminSupportPage from "./pages/admin/Support";
// import AdminRouteProtection from "./pages/admin/AdminRouteProtection";
// import LecturerRouteProtection from "./pages/lecturer-pages/LecturerRouteProtection";
// import LecturerOnboarding from "./pages/lecturer-pages/Onboarding";
// import CourseRegistration from "./pages/student-pages/CourseRegistration";
// import LecturerCourseRegistration from "./pages/lecturer-pages/LecturerCourseRegistration";

// function App() {
//   return (
//     <Routes>
//       {/* Student routes */}
//       <Route element={<Layout />}>
//         <Route path="/" element={<Dashboard />} />
//         {/* Protected routes */}
//         <Route
//           path="/register-courses"
//           element={
//             <RequireAuthDialog>
//               <CourseRegistration />
//             </RequireAuthDialog>
//           }
//         />
//         <Route
//           path="/calendar"
//           element={
//             <RequireAuthDialog>
//               <CalendarPage />
//             </RequireAuthDialog>
//           }
//         />
//         <Route
//           path="/inbox"
//           element={
//             <RequireAuthDialog>
//               <InboxPage />
//             </RequireAuthDialog>
//           }
//         />
//         <Route
//           path="/account-profile"
//           element={
//             <RequireAuthDialog>
//               <Account />
//             </RequireAuthDialog>
//           }
//         />
//         <Route
//           path="/support"
//           element={
//             <RequireAuthDialog>
//               <Support />
//             </RequireAuthDialog>
//           }
//         />
//         <Route
//           path="/course/:courseId"
//           element={
//             <RequireAuthDialog>
//               <CheckAttendance />
//             </RequireAuthDialog>
//           }
//         />
//         <Route
//           path="/all-courses"
//           element={
//             <RequireAuthDialog>
//               <AllCourses />
//             </RequireAuthDialog>
//           }
//         />

//         {/* Public routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/onboarding" element={<Onboarding />} />
//       </Route>

//       {/* Lecturer routes */}
//       <Route path="/lecturer" element={<LecturerLayout />}>
//         <Route
//           path="/lecturer/login"
//           element={
//               <LecturerLogin />
//           }
//         />
//         <Route
//           path="/lecturer/auth"
//           element={
//               <LecturerAuth />
//           }
//         />
//         <Route
//           path="/lecturer"
//           element={
//             <LecturerRouteProtection>
//               <AttendanceDashboard />
//             </LecturerRouteProtection>
//           }
//         />
//         <Route
//           path="/lecturer/publish-attendance"
//           element={
//             <LecturerRouteProtection>
//               <PublishAttendance />
//             </LecturerRouteProtection>
//           }
//         />
//         <Route
//           path="/lecturer/register-courses"
//           element={
//             <LecturerRouteProtection>
//               <LecturerCourseRegistration />
//             </LecturerRouteProtection>
//           }
//         />
//         <Route
//           path="/lecturer/calendar"
//           element={
//             <LecturerRouteProtection>
//               <Calendar />
//             </LecturerRouteProtection>
//           }
//         />
//         <Route
//           path="/lecturer/inbox"
//           element={
//             <LecturerRouteProtection>
//               <LecturerInbox />
//             </LecturerRouteProtection>
//           }
//         />
//         <Route
//           path="/lecturer/account-profile"
//           element={
//             <LecturerRouteProtection>
//               <LecturerAccount />
//             </LecturerRouteProtection>
//           }
//         />
//         <Route
//           path="/lecturer/support"
//           element={
//             <LecturerRouteProtection>
//               <StudentSupportPage />
//             </LecturerRouteProtection>
//           }
//         />
//         <Route
//           path="/lecturer/onboarding"
//           element={
//               <LecturerOnboarding />
//           }
//         />
//       </Route>

//       {/* Admin routes */}
//       <Route path="/admin" element={<AdminLayout />}>
//         <Route
//           path="/admin"
//           element={
//             <AdminRouteProtection>
//             <AdminDashboard />
//             </AdminRouteProtection>
//           }
//         />
//         <Route
//           path="/admin/created-courses"
//           element={
//             <AdminRouteProtection>
//               <CreatedCourses />
//             </AdminRouteProtection>
//           }
//         />
//         <Route
//           path="/admin/edit-courses"
//           element={
//             <AdminRouteProtection>
//               <EditCoursesPage />
//             </AdminRouteProtection>
//           }
//         />
//         <Route
//           path="/admin/support"
//           element={
//             <AdminRouteProtection>
//               <AdminSupportPage />
//             </AdminRouteProtection>
//           }
//         />
//         <Route
//           path="/admin/calendar"
//           element={
//             <AdminRouteProtection>
//               <AdminCalendarPage />
//             </AdminRouteProtection>
//           }
//         />
//         <Route
//           path="/admin/account-profile"
//           element={
//             <AdminRouteProtection>
//               <AdminAccount />
//             </AdminRouteProtection>
//           }
//         />

//         <Route
//           path="/admin/login"
//           element={
//               <AdminLogin />
//           }
//         />
//       </Route>
//     </Routes>
//   );
// }

// export default App;

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
import CheckAttendance from "./pages/student-pages/CheckAttendance";
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
import AdminDashboard from "./pages/admin/page";
import CreatedCourses from "./pages/admin/CreatedCourses";
import AdminLogin from "./pages/admin/Login";
import AdminCalendarPage from "./pages/admin/Calendar";
import EditCoursesPage from "./pages/admin/EditCourses";
import AdminSupportPage from "./pages/admin/Support";
import SignedOutDashboard from "./components/SignedOutDashboard";

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
              <CheckAttendance />
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
