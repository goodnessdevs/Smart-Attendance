import { Loader2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function AdminRouteProtection({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
        
      const token = localStorage.getItem("jwt_token");

      try {
        if (!token) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/check-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to check status");

        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch (err) {
        console.error("Error checking status:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return (
      <p className="flex text-xl font-semibold">
        <Loader2 className="animate-spin w-4 h-4" /> Loading...
      </p>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
