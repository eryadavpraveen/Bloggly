import React, { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"


import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { loginUser } from "@/src/features/auth/authSlice"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();

        if (!email && !password) {
            toast.error("Email and password are required");
            return;
        }
        if (!email) {
            toast.error("Email is required");
            return;
        }
        if (!password) {
            toast.error("Password is required");
            return;
        }
        else {
            dispatch(loginUser({ Credentials: { email, password }, navigate }))
        }
    }

    return (
        <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl items-center justify-center">
                <Card className="w-full max-w-md border-border/80 bg-card shadow-sm">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
                        <CardDescription>
                            Sign in to your account to continue reading and writing posts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                // required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="/auth/forgot-password"
                                        className="text-sm text-primary underline-offset-4 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                // required
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Sign in
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/auth/register"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                Create one
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Login
