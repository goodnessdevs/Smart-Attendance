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

export function RequireAuthDialog() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  if (!user)
    return (
      <Dialog open>
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

  return null;
}
