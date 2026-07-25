import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
    closeLoginDialog,
} from "@/src/features/dialog/dialogSlice";

const LoginDialog = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const open = useSelector(
        (state) => state.dialog.loginOpen
    );

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    dispatch(closeLoginDialog());
                }
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Log in to continue
                    </DialogTitle>

                    <DialogDescription>
                        Sign in to like blogs, comment, bookmark,
                        and interact with the community.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 pt-4">
                    <Button
                        className="w-full"
                        onClick={() => {
                            dispatch(closeLoginDialog());
                            navigate("/auth/login");
                        }}
                    >
                        Log In
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            dispatch(closeLoginDialog());
                            navigate("/auth/register");
                        }}
                    >
                        Create Account
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LoginDialog;