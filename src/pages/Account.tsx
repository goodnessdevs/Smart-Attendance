import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Link } from "react-router-dom";

const MotionCard = motion.create(Card);
const MotionTabsList = motion.create(TabsList);
const MotionTabsContent = motion.create(TabsContent);

function Account() {
  return (
    <div className="w-full max-w-full p-4 md:max-w-6xl mx-auto mb-10">
      <MotionCard
        initial={{ opacity: 1, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: false }}
        className="w-full max-w-full md:w-3xl mb-6 mx-auto"
      >
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 mb-2">
            <AvatarImage src="/avatar.png" alt="Student Avatar" />
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg md:text-xl font-semibold">
            Student Name
          </CardTitle>
          <p className="text-muted-foreground text-sm">Matric no: 20251234</p>
        </CardHeader>
      </MotionCard>

      <Tabs defaultValue="attendance" className="w-full max-w-full md:w-3xl mx-auto">
        <MotionTabsList
          initial={{ opacity: 0, x: -100 }}
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
          initial={{ opacity: 1, y: 100 }}
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
                <span>60</span>
              </div>
              <div className="flex justify-between">
                <span>Attended:</span>
                <span>52</span>
              </div>
              <div className="flex justify-between">
                <span>Absent:</span>
                <span>8</span>
              </div>
              <div className="flex justify-between">
                <span>Attendance %:</span>
                <span>86.7%</span>
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
                  Student Name
                </p>
              </div>
              <div>
                <label className="block mb-1 text-sm">Email</label>
                <p className="w-full border rounded px-3 py-2 text-sm">
                  student@email.com
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
              <Link to={"/login"}>
                <Button variant="destructive" className="w-full cursor-pointer">
                  Logout
                </Button>
              </Link>
            </CardContent>
          </Card>
        </MotionTabsContent>
      </Tabs>
    </div>
  );
}

export default Account;
