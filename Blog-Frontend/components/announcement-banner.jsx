import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
    Bell,
    Star,
    ArrowRight,
    Sparkles,
    TrendingUp,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AnnouncementBanner = () => {
    const navigate = useNavigate();

    return (
        <div className="mx-auto max-w-7xl px-6 py-6">
            <Card className="relative overflow-hidden border bg-gradient-to-br from-muted/70 via-background to-background shadow-sm">
                {/* Background Pattern */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[size:22px_22px] opacity-50"
                />

                {/* Soft accent edge */}
                <div
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1 bg-foreground/80"
                />

                <CardContent className="relative p-6 md:p-8">
                    <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                        {/* Left Content */}
                        <div className="flex-1 space-y-4 text-center lg:text-left">
                            {/* Badge */}
                            <div className="flex justify-center lg:justify-start">
                                <Badge
                                    variant="secondary"
                                    className="gap-1 border border-border/80 px-3 py-1"
                                >
                                    <Sparkles className="h-3 w-3" />
                                    New Feature
                                </Badge>
                            </div>

                            {/* Main Content */}
                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                                    Join Our Growing Community
                                </h2>
                                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                                    Connect with like-minded writers, share your
                                    stories, and discover amazing content. Start
                                    your blogging journey today with our powerful
                                    platform.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center gap-6 pt-2 lg:justify-start">
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">10K+</span>
                                    <span className="text-muted-foreground">
                                        Writers
                                    </span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-2 text-sm">
                                    <Star className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">50K+</span>
                                    <span className="text-muted-foreground">
                                        Stories
                                    </span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-2 text-sm">
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Growing</span>
                                    <span className="text-muted-foreground">
                                        Daily
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - CTA */}
                        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
                            <Button
                                size="lg"
                                className="group px-6 py-3"
                                onClick={() => navigate("/auth/register")}
                            >
                                <Bell className="mr-2 h-4 w-4" />
                                Get Started Free
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-6 py-3"
                                onClick={() => navigate("/about")}
                            >
                                Learn More
                            </Button>
                        </div>
                    </div>

                    {/* Bottom CTA Strip */}
                    <div className="mt-8 rounded-md border border-dashed border-border/80 bg-background/60 px-4 py-3.5">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Sparkles className="h-4 w-4 text-foreground/70" />
                                <span>
                                    Limited time: Free premium features for new
                                    users
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-sm"
                                    onClick={() => navigate("/contact")}
                                >
                                    Contact
                                </Button>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-sm"
                                    onClick={() => navigate("/faq")}
                                >
                                    View Details →
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 opacity-10">
                    <div className="h-32 w-32 rounded-full bg-primary/20" />
                </div>
                <div className="absolute bottom-4 left-4 opacity-10">
                    <div className="h-20 w-20 rounded-full bg-primary/30" />
                </div>
            </Card>
        </div>
    );
};

export default AnnouncementBanner;
