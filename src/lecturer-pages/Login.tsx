import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Loader2, UserLock } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "../hooks/use-auth";
import { useEffect, useState } from "react";

const MotionCard = motion.create(Card);

const Login = () => {
  const navigate = useNavigate();

  const { login, dispatch } = useAuthContext(); // ✅ From AuthContext
  const [loading, setLoading] = useState(false); // ✅ Loading state for button

  // ✅ Listen for messages from popup (Google OAuth)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== import.meta.env.VITE_BACKEND_URL) return;

      const { token } = event.data as { token?: string };

      if (token) {
        localStorage.setItem("jwt_token", token);
        setLoading(true);

        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/dashboard`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            throw new Error("Failed to validate token");
          }

          const data = await res.json();
          console.log("User data:", data);

          // Update global AuthContext
          login(data.user, token); // or dispatch({ type: "LOGIN", payload: data.user })

          // Navigate depending on onboarding status
          if (res.ok) {
            toast.success("Sign in successful");
            navigate("/onboarding");
          } else {
            toast.error("Something went wrong. Please try again");
          }
        } catch (err) {
          console.error("Token validation failed:", err);
          localStorage.removeItem("jwt_token");
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate, login, dispatch]);

  // ✅ Open popup for Google login
  const handleGoogleAuth = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    setLoading(true);

    window.open(
      import.meta.env.VITE_API_AUTH_URL,
      "Google Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const d = new Date();
  const year = d.getFullYear();

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center mx-auto bg-gradient-to-tl from-green-900 to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
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
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className="w-full max-w-md shadow-xl bg-white text-black"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-gray-500">
            Welcome back, please log in
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
              onClick={handleGoogleAuth}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <>Signing in...</>
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
        </CardContent>
      </MotionCard>

      <p className="text-center text-white mt-4">
        &copy; {year}, Federal University of Agriculture, Abeokuta. All rights
        reserved.
      </p>
    </div>
  );
};

export default Login;
