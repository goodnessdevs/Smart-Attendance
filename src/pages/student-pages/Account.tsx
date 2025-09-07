import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/use-auth";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

const MotionCard = motion.create(Card);
const MotionTabsList = motion.create(TabsList);
const MotionTabsContent = motion.create(TabsContent);

function Account() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // logout handler
  const handleLogout = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
      logout();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const getAvatarFallback = () => {
    if (!user?.fullName) return "U";
    const names = user.fullName.split(" ");
    return names
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join(" ");
  };

  const getAttendancePercentage = () => {
    if (!user) return 0;
    const total = user?.attended + user?.absent;
    const result = (user?.attended / total) * 100;
    return result;
  };

  return (
    <div className="w-full max-w-full p-4 md:max-w-6xl mx-auto mb-10 mt-8">
      <MotionCard
        initial={{ opacity: 1, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: false }}
        className="w-full max-w-full md:w-3xl mb-6 mx-auto"
      >
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 mb-2">
            <AvatarImage src={user?.profilePic} alt="Student Avatar" />
            <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg md:text-xl font-semibold">
            {user?.fullName}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Matric no: {user?.matricNumber}
          </p>
        </CardHeader>
      </MotionCard>

      <Tabs
        defaultValue="attendance"
        className="w-full max-w-full md:w-3xl mx-auto"
      >
        <MotionTabsList
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          className="w-full max-w-full md:w-3xl grid grid-cols-3"
        >
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="settings">Details</TabsTrigger>
          <TabsTrigger value="logout">Logout</TabsTrigger>
        </MotionTabsList>

        {/* Attendance Tab */}
        <MotionTabsContent
          initial={{ opacity: 1, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          value="attendance"
        >
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Total Classes:</span>
                <span>{user?.totalClasses}</span>
              </div>
              <div className="flex justify-between">
                <span>Attended:</span>
                <span>{user?.attended}</span>
              </div>
              <div className="flex justify-between">
                <span>Absent:</span>
                <span>{user?.absent}</span>
              </div>
              <div className="flex justify-between">
                <span>Attendance %:</span>
                <span>{getAttendancePercentage()}</span>
              </div>
              {/* <Button className="mt-4 w-full">View Full Attendance</Button> */}
            </CardContent>
          </Card>
        </MotionTabsContent>

        {/* Settings Tab */}
        <MotionTabsContent
          initial={{ opacity: 1, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: false }}
          value="settings"
        >
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block mb-1 text-sm">Full Name</label>
                <p className="w-full border rounded px-3 py-2 text-sm">
                  {user?.fullName}
                </p>
              </div>
              <div>
                <label className="block mb-1 text-sm">Email</label>
                <p className="w-full border rounded px-3 py-2 text-sm">
                  {user?.email}
                </p>
              </div>
              <div>
                <label className="block mb-1 text-sm">Level</label>
                <p className="w-full border rounded px-3 py-2 text-sm">
                  {user?.level}
                </p>
              </div>
              <div>
                <label className="block mb-1 text-sm">College</label>
                <p className="w-full border rounded px-3 py-2 text-sm">
                  {user?.college}
                </p>
              </div>
              <div>
                <label className="block mb-1 text-sm">Department</label>
                <p className="w-full border rounded px-3 py-2 text-sm">
                  {user?.department}
                </p>
              </div>
              {/* <Button className="w-full mt-4">Update Info</Button> */}
            </CardContent>
          </Card>
        </MotionTabsContent>

        {/* Logout Tab */}
        <MotionTabsContent
          initial={{ opacity: 1, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          value="logout"
        >
          <Card className="mt-4 text-center">
            <CardHeader>
              <CardTitle>Are you sure?</CardTitle>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={handleLogout} className="w-full cursor-pointer">
                  {loading ? (
                    <div className="flex items-center gap-x-2">
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span>Logging out...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </div>
                  )}
                </Button>
            </CardContent>
          </Card>
        </MotionTabsContent>
      </Tabs>
    </div>
  );
}

export default Account;
