import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
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
import { forgotPassword } from "@/src/services/authServices"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!email.trim()) {
            toast.error("Please enter your email address")
            return
        }
        try {
            const data = await forgotPassword({ email });

            if (data.status === "success") {
                setEmail("");
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    "Unable to send reset link. Please try again."
            );
        }
    }



    return (
        <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl items-center justify-center">
                <Card className="w-full max-w-md border-border/80 bg-card shadow-sm">
                    <CardHeader className="space-y-3">
                        <div className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            Password recovery
                        </div>
                        <CardTitle className="text-2xl font-semibold">Forgot your password?</CardTitle>
                        <CardDescription>
                            Enter your email and we’ll send you instructions to reset it.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Send reset link
                            </Button>
                        </form>

                        <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                            We’ll only send a message if an account exists for that email.
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            <Link
                                to="/auth/login"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                Back to sign in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ForgotPassword