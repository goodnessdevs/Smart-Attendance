import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Link } from "react-router-dom";

const MotionCard = motion.create(Card);
const MotionTabsList = motion.create(TabsList);
const MotionTabsContent = motion.create(TabsContent);

function AdminAccount() {
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
            <AvatarImage src="/avatar.png" alt="Lecturer Avatar" />
            <AvatarFallback>LC</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg md:text-xl font-semibold">
            Lecturer Name
          </CardTitle>
          <p className="text-muted-foreground text-sm">Staff ID: LEC2025001</p>
        </CardHeader>
      </MotionCard>

      <Tabs defaultValue="classes" className="w-full max-w-full md:w-3xl mx-auto">
        <MotionTabsList
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          className="w-full max-w-full md:w-3xl grid grid-cols-3"
        >
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="logout">Logout</TabsTrigger>
        </MotionTabsList>

        {/* Classes Tab */}
        <MotionTabsContent
          initial={{ opacity: 1, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          value="classes"
        >
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Class Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Total Courses Assigned:</span>
                <span>4</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Pending Classes:</span>
                <span>5</span>
              </div>
              <div className="flex justify-between">
                <span>Average Attendance %:</span>
                <span>82%</span>
              </div> */}
              <Button className="mt-4 w-full">View Full Class Records</Button>
            </CardContent>
          </Card>
        </MotionTabsContent>

        {/* Details Tab */}
        <MotionTabsContent
          initial={{ opacity: 1, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: false }}
          value="details"
        >
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block mb-1 text-sm">Full Name</label>
                <p className="w-full border rounded px-3 py-2 text-sm">
                  Lecturer Name
                </p>
              </div>
              <div>
                <label className="block mb-1 text-sm">Email</label>
                <p className="w-full border rounded px-3 py-2 text-sm">
                  lecturer@email.com
                </p>
              </div>
              <div>
                <label className="block mb-1 text-sm">Department</label>
                <p className="w-full border rounded px-3 py-2 text-sm">
                  Computer Science
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

export default AdminAccount;
