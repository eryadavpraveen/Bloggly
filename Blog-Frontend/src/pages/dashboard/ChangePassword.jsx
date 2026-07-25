import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ShowDirectErrorMessage,
    getErrorMessage,
} from "@/src/utils/ShowToastNotification";
import { changePassword } from "@/src/services/authServices";
import { ArrowLeft } from "lucide-react";

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            ShowDirectErrorMessage("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            ShowDirectErrorMessage("New password and confirm password do not match.");
            return;
        }

        if (newPassword.length < 6) {
            ShowDirectErrorMessage("New password must be at least 6 characters.");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await changePassword({ oldPassword, newPassword });

            if (data?.status === "success") {
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                navigate("/dashboard/account");
            }
        } catch (error) {
            ShowDirectErrorMessage(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center p-6">
            <div className="w-full max-w-md space-y-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="px-0 hover:bg-transparent"
                    onClick={() => navigate("/dashboard/account")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Account
                </Button>

                <Card className="border-border/80 shadow-sm">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-2xl font-semibold">
                            Change password
                        </CardTitle>
                        <CardDescription>
                            Enter your current password and choose a new one.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="oldPassword">Current password</Label>
                                <Input
                                    id="oldPassword"
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    disabled={isSubmitting}
                                    autoComplete="current-password"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={isSubmitting}
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm new password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isSubmitting}
                                    autoComplete="new-password"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Update password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
