import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import logo from "../assets/funaab.png";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

const MotionCard = motion(Card)

function Signup() {
  const handleGoogleAuth = () => {
    // Google sign-up logic
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gradient-to-tl from-green-600 to-[#e0ffe7] px-4">
      <motion.div initial={{opacity: 0, y: -50}} whileInView={{opacity: 1, y: 0}} transition={{duration: 0.7, ease: "easeInOut"}} viewport={{once: false}} className="flex items-center justify-start gap-x-2 mb-8">
        <div className="w-24 h-24">
          <img src={logo} alt="funaab" className="object-cover w-full h-full rounded-full" />
        </div>
        <h2 className="text-2xl text-black font-bold">Smart Attendance</h2>
      </motion.div>

      <MotionCard initial={{opacity: 0, y: 50}} whileInView={{opacity: 1, y: 0}} transition={{duration: 0.7, ease: "easeInOut"}} viewport={{once: false}} className="w-full max-w-md shadow-xl bg-white text-black">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription className="text-gray-500">
            Sign up to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <UserPlus className="h-10 w-10 text-blue-500" />
          </div>

          <motion.div
            initial={{ borderRadius: 8 }}
            whileHover={{
              borderRadius: 999,
              transition: { duration: 0.8, ease: "easeInOut" },
            }}
          >
            <Button
              variant="default"
              className="w-full flex gap-2 cursor-pointer justify-center text-white items-center bg-blue-600 hover:bg-blue-800"
              onClick={handleGoogleAuth}
            >
              <FontAwesomeIcon icon={faGoogle} className="w-4 h-4" />
              Sign up with Google
            </Button>
          </motion.div>

          <Separator />

          <div className="text-center text-sm font-semibold">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </MotionCard>
    </div>
  );
}

export default Signup;
