import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Loader2, UserLock } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "../../hooks/use-auth";
import { useCallback, useEffect, useState } from "react";

const MotionCard = motion.create(Card);

const Login = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLecturerAuthentication = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Check if user has admin privileges
        const statusResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/check-status`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!statusResponse.ok) {
          throw new Error("Failed to verify user status");
        }

        const statusData = await statusResponse.json();
        console.log("User status:", statusData);

        // Step 2: Verify admin access
        if (!statusData.isLecturer) {
          // User is not an admin
          localStorage.removeItem("jwt_token");
          setError("Access denied. Lecturer privileges required.");
          toast.error("You don't have lecturer access to this system");
          return;
        }

        // Step 3: Get user details for admin user
        const userResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user-details`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch lecturer user details");
        }

        const userData = await userResponse.json();
        console.log("Lecturer user data:", userData);

        // Step 4: Store token and login admin user
        localStorage.setItem("jwt_token", token);
        login(userData.user, token);

        // Step 5: Success - navigate to admin dashboard
        toast.success(
          `Welcome back, ${userData.user?.fullName || "Lecturer"}!`
        );
        navigate("/lecturer");
      } catch (err) {
        console.error("Lecturer authentication error:", err);

        // Clean up on error
        localStorage.removeItem("jwt_token");

        const errorMessage =
          err instanceof Error
            ? err.message
            : "Authentication failed. Please try again.";

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [login, navigate]
  );

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== import.meta.env.VITE_BACKEND_URL) return;

      const { token, error: authError } = event.data as {
        token?: string;
        error?: string;
      };

      if (authError) {
        setError("Authentication failed. Please try again.");
        setLoading(false);
        return;
      }

      if (token) {
        await handleLecturerAuthentication(token);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleLecturerAuthentication]);

  const handleGoogleAuth = () => {
    if (loading) return; // Prevent multiple clicks

    setError(null);
    setLoading(true);

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      import.meta.env.VITE_GOOGLE_AUTH_URL,
      "Google Admin Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const handleRetry = () => {
    setError(null);
    handleGoogleAuth();
  };

  const d = new Date();
  const year = d.getFullYear();

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center mx-auto bg-gradient-to-tl from-green-800 to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.9,
          ease: "easeInOut",
          type: "spring",
          stiffness: 120,
        }}
        viewport={{ once: false }}
        className="flex flex-col items-center justify-start gap-x-2 mb-8"
      >
        <div className="w-24 h-24">
          <img
            src={"/funaab.png"}
            alt="funaab"
            className="object-contain w-full h-full"
          />
        </div>
        <h2 className="text-2xl text-white text-center font-bold">
          Smart Attendance For Lecturers
        </h2>
      </motion.div>

      <MotionCard
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.9,
          ease: "easeInOut",
          type: "spring",
          stiffness: 120,
        }}
        className="w-full max-w-md shadow-xl bg-white text-black"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-gray-500">
            Welcome back, please sign in
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <UserLock className="h-10 w-10 text-blue-500" />
          </div>

          <motion.div
            initial={{ borderRadius: 8 }}
            whileHover={{
              borderRadius: 999,
              transition: { duration: 1, ease: "easeInOut" },
            }}
          >
            <Button
              variant="default"
              className="w-full flex gap-2 cursor-pointer justify-center text-black items-center bg-gray-200 hover:bg-gray-300"
              onClick={error ? handleRetry : handleGoogleAuth}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <>Signing in...</>
                </>
              ) : error ? (
                <>
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span>Retry with Google</span>
                </>
              ) : (
                <>
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <>Continue with Google</>
                </>
              )}
            </Button>
          </motion.div>

          {/* Additional info for lecturers */}
          <div className="text-center text-sm text-gray-500">
            <p>Only lecturers can access this system</p>
          </div>
        </CardContent>
      </MotionCard>

      <motion.p
        initial={{ opacity: 0.2 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "linear" }}
        className="text-center text-white mt-4"
      >
        &copy; {year}, Federal University of Agriculture, Abeokuta. All rights
        reserved.
      </motion.p>
    </div>
  );
};

export default Login;
