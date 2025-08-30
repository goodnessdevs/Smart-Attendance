import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/use-auth";
import type { ReactNode } from "react";

type RequireAuthDialogProps = {
  children: ReactNode;
};

export function RequireAuthDialog({ children }: RequireAuthDialogProps) {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  if (!user) {
    return (
      <Dialog
        defaultOpen
        onOpenChange={(open) => {
          if (!open) {
            navigate("/");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You must be signed in to continue. Please log in to access this
              page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="default" onClick={() => navigate("/login")}>
              Sign in
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <>{children}</>;
}
