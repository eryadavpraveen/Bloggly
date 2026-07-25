import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { toast } from "sonner";

import { resetPassword } from "../../services/authServices";

const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!password || !confirmPassword) {
            toast.error("Please fill in both password fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!PASSWORD_REGEX.test(password)) {
            toast.error(
                "Password must be at least 8 characters and include uppercase, lowercase, number and special character."
            );
            return;
        }

        if (!token) {
            toast.error("Invalid or expired reset link");
            return;
        }

        try {
            setIsLoading(true);

            const response = await resetPassword({
                token,
                newPassword: password,
            });

            if (response.status === "success") {
                toast.success(response.message || "Password reset successful");
                navigate("/auth/login");
            }else {
                toast.error(response.message || "Failed to reset password");
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to reset password"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl items-center justify-center">
                <Card className="w-full max-w-md border-border/80 bg-card shadow-sm">
                    <CardHeader className="space-y-3">
                        <div className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            Secure Reset
                        </div>

                        <CardTitle className="text-2xl font-semibold">
                            Set a New Password
                        </CardTitle>

                        <CardDescription>
                            Create a strong password for your account and
                            confirm it below.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    New Password
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter a new password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>

                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? "Updating..."
                                    : "Update Password"}
                            </Button>
                        </form>

                        <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                            Use at least 8 characters with a mix of uppercase,
                            lowercase, numbers, and special characters.
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            <Link
                                to="/auth/login"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                Return to Sign In
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;