// import { Loader2 } from "lucide-react";
// import { useEffect, useState, type ReactNode } from "react";
// import { Navigate } from "react-router-dom";

// interface Props {
//   children: ReactNode;
//   requireLecturer?: boolean;
//   requireAdmin?: boolean;
// }

// export default function RouteProtection({
//   children,
//   requireLecturer,
//   requireAdmin,
// }: Props) {
//   const [loading, setLoading] = useState(true);
//   const [isLecturer, setIsLecturer] = useState<boolean | null>(null);
//   const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

//   useEffect(() => {
//     const checkStatus = async () => {
//       const token = localStorage.getItem("jwt_token");

//       try {
//         if (!token) {
//           setIsLecturer(false);
//           setIsAdmin(false);
//           setLoading(false);
//           return;
//         }

//         const res = await fetch(
//           `${import.meta.env.VITE_BACKEND_URL}/check-status`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!res.ok) throw new Error("Failed to check status");

//         const data = await res.json();
//         setIsLecturer(data.isLecturer);
//         setIsAdmin(data.isAdmin);
//       } catch (err) {
//         console.error("Error checking status:", err);
//         setIsLecturer(false);
//         setIsAdmin(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkStatus();
//   }, []);

//   if (loading) {
//     return (
//       <p className="flex text-xl font-semibold">
//         <Loader2 className="animate-spin w-4 h-4" /> Loading...
//       </p>
//     );
//   }

//   // 🚦 Protection logic
//   if (requireLecturer && !isLecturer) {
//     return <Navigate to="/" replace />;
//   }

//   if (requireAdmin && !isAdmin) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  requiredRole?: "student" | "lecturer" | "admin";
};

export default function RouteProtection({
  children,
  requiredRole = "student",
}: Props) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/check-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to check status");
        const data = await res.json();

        let allowed = false;
        if (requiredRole === "student" && !data.isLecturer && !data.isAdmin) {
          allowed = true;
        }
        if (requiredRole === "lecturer" && data.isLecturer) {
          allowed = true;
        }
        if (requiredRole === "admin" && data.isAdmin) {
          allowed = true;
        }

        setAuthorized(allowed);
      } catch (err) {
        console.error("Error checking status:", err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [requiredRole]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen gap-x-3">
        <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );

  if (!authorized) {
    // Redirect unauthenticated users to the correct login page
    if (requiredRole === "lecturer")
      return <Navigate to="/lecturer/login" replace />;
    if (requiredRole === "admin") return <Navigate to="/admin/login" replace />;
    return <Navigate to="/login" replace />; // default → student
  }

  return <>{children}</>;
}
