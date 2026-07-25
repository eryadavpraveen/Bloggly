import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Mail,
    UserRound,
    CalendarDays,
    FileText,
    KeyRound,
    Sparkles,
    ArrowRight,
    Loader2,
    Globe,
} from "lucide-react";

const AccountPage = () => {
    const navigate = useNavigate();
    const { user, isLoading } = useSelector((state) => state.auth);

    const username = user?.username || "—";
    const email = user?.email || "—";
    const displayName =
        username !== "—"
            ? username.charAt(0).toUpperCase() + username.slice(1)
            : "Account";
    const initial = username !== "—" ? username.charAt(0).toUpperCase() : "U";
    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en", {
              month: "long",
              day: "numeric",
              year: "numeric",
          })
        : "—";

    if (isLoading && !user) {
        return (
            <div className="flex flex-1 items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="relative flex flex-1 flex-col bg-gradient-to-b from-muted/50 via-background to-background">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[size:22px_22px] opacity-40"
            />

            <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center space-y-8 px-6 py-8 md:py-10">
                {/* Hero */}
                <section className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur">
                    <div className="border-b border-border/60 bg-gradient-to-r from-muted/80 via-muted/30 to-transparent px-6 py-5 md:px-8">
                        <div className="inline-flex items-center gap-1.5 rounded-full border bg-background/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            <Sparkles className="h-3 w-3" />
                            Your account
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                        <div className="flex items-start gap-5">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-foreground text-3xl font-semibold text-background shadow-md">
                                {initial}
                            </div>
                            <div className="min-w-0 pt-1">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {displayName}
                                </h1>
                                <p className="mt-2 break-all text-sm text-muted-foreground md:text-base">
                                    {email}
                                </p>
                                <p className="mt-3 text-sm text-muted-foreground">
                                    Manage your Bloggly profile and security
                                    settings.
                                </p>
                            </div>
                        </div>

                        {username !== "—" && (
                            <Button
                                variant="outline"
                                className="h-11 shrink-0 rounded-full border-2 px-5"
                                onClick={() => navigate(`/user/${username}`)}
                            >
                                <Globe className="mr-2 h-4 w-4" />
                                View public profile
                            </Button>
                        )}
                    </div>
                </section>

                {/* Details */}
                <section className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Profile details
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Information tied to your Bloggly account
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <DetailCard
                            icon={UserRound}
                            label="Username"
                            value={username}
                        />
                        <DetailCard
                            icon={Mail}
                            label="Email"
                            value={email}
                        />
                        <DetailCard
                            icon={CalendarDays}
                            label="Member since"
                            value={memberSince}
                            className="sm:col-span-2"
                        />
                    </div>
                </section>

                {/* Actions */}
                <section className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Quick actions
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Jump to your content or update security
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <ActionCard
                            icon={FileText}
                            title="My Blogs"
                            description="Manage drafts and published posts"
                            onClick={() => navigate("/dashboard/blogs")}
                        />
                        <ActionCard
                            icon={KeyRound}
                            title="Change password"
                            description="Update your account password"
                            onClick={() =>
                                navigate("/dashboard/account/change-password")
                            }
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

const DetailCard = ({ icon: Icon, label, value, className = "" }) => (
    <div
        className={`rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur transition-shadow hover:shadow-md ${className}`}
    >
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
                <Icon className="h-4 w-4" />
            </span>
            {label}
        </div>
        <p className="break-all text-base font-semibold tracking-tight text-foreground">
            {value}
        </p>
    </div>
);

const ActionCard = ({ icon: Icon, title, description, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-start gap-3 rounded-2xl border-2 border-foreground/15 bg-card/80 px-4 py-4 text-left shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md"
    >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-muted/50 text-foreground">
            <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold tracking-tight">{title}</p>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
    </button>
);

export default AccountPage;
