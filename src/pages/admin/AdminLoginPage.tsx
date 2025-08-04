import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '../../components/ui/button'
// import { Separator } from '@radix-ui/react-separator'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { UserLock } from 'lucide-react'
import logo from "../../assets/funaab.png";

const MotionCard = motion.create(Card);

const AdminAuth = () => {
  const navigate = useNavigate();

  const handleGoogleAuth = () => {
    // Google auth logic
    navigate("/admin/lecturers-login/auth");
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center mx-auto bg-gradient-to-tl from-green-600 to-[#e0ffe7] px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        viewport={{ once: false }}
        className="flex flex-col items-center justify-start gap-x-2 mb-8"
      >
        <div className="w-24 h-24">
          <img
            src={logo}
            alt="funaab"
            className="object-contain w-full h-full"
          />
        </div>
        <h2 className="text-2xl text-black font-bold">Smart Attendance For Lecturers</h2>
      </motion.div>

      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        viewport={{ once: false }}
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
              className="w-full flex gap-2 cursor-pointer justify-center text-white items-center bg-blue-600 hover:bg-blue-800"
              onClick={handleGoogleAuth}
            >
              <FontAwesomeIcon icon={faGoogle} className="w-4 h-4" />
              Sign in with Google
            </Button>
          </motion.div>

          {/* <Separator />

          <div className="text-center text-sm font-semibold">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              Sign up
            </Link>
          </div> */}
        </CardContent>
      </MotionCard>
    </div>
  )
}

export default AdminAuth
