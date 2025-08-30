import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Inbox } from "lucide-react";
import { useAuthContext } from "../hooks/use-auth";
import { RequireAuthDialog } from "../components/AuthDialog";

const mockMessages = [
  {
    id: 1,
    from: "Dr. Stella Okafor",
    subject: "Upcoming Physics Test",
    content:
      "Dear student, please be reminded that your Physics test holds on Monday at 9am.",
    date: "2025-07-12",
    read: false,
  },
  {
    id: 2,
    from: "Admin",
    subject: "Orientation Reminder",
    content:
      "Orientation for new students holds tomorrow in the main auditorium.",
    date: "2025-07-10",
    read: true,
  },
  {
    id: 3,
    from: "Mr. John David",
    subject: "Lab Assignment Submission",
    content:
      "Ensure you submit your CSC lab assignment via the portal before Friday.",
    date: "2025-07-09",
    read: false,
  },
];

function InboxPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<
    (typeof mockMessages)[0] | null
  >(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthContext();

  const markAsRead = (id: number) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  const handleSelect = (msg: (typeof mockMessages)[0]) => {
    setSelectedMessage(msg);
    setIsOpen(true);
    markAsRead(msg.id);
  };

  if (!user) {
    RequireAuthDialog()
  }

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <h1 className="text-3xl font-bold mb-4 text-primary flex items-center gap-x-2">
        <Inbox /> Inbox
      </h1>

      {/* Message list */}
      <Card className="overflow-auto max-h-[75vh]">
        <CardHeader>
          <CardTitle className="text-lg">Messages</CardTitle>
        </CardHeader>
        <CardContent className="divide-y space-y-2">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground">No messages</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-md cursor-pointer ${
                  selectedMessage?.id === msg.id
                    ? "bg-accent"
                    : "hover:bg-muted transition"
                }`}
                onClick={() => handleSelect(msg)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{msg.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      From: {msg.from}
                    </p>
                  </div>
                  {!msg.read && <Badge variant="secondary">New</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{msg.date}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Dialog Viewer */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  From: {selectedMessage.from} <br />
                  Date: {selectedMessage.date}
                </DialogDescription>
              </DialogHeader>
              <Separator className="my-2" />
              <p className="text-sm leading-relaxed">
                {selectedMessage.content}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default InboxPage;
