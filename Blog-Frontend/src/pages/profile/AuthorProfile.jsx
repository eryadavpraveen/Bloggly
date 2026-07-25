import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchPublicProfile } from "@/src/services/userService";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    CalendarDays,
    FileText,
    Heart,
    Loader2,
    MessageCircle,
    Sparkles,
    ArrowRight,
} from "lucide-react";
import { formatBlogDate } from "@/src/utils/DateHelper";

const AuthorProfilePage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            if (!username) return;

            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchPublicProfile(username, {
                    page: 1,
                    limit: 9,
                });
                if (data?.status?.toLowerCase() === "success") {
                    setProfile(data.data);
                } else {
                    setError("Profile not found.");
                }
            } catch {
                setError("Unable to load this profile.");
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [username]);

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !profile?.user) {
        return (
            <div className="relative flex min-h-[60vh] flex-1 items-center justify-center bg-gradient-to-b from-muted/50 via-background to-background px-6">
                <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card/90 p-8 text-center shadow-sm backdrop-blur">
                    <p className="text-muted-foreground">
                        {error || "Profile not found."}
                    </p>
                    <Button
                        className="mt-6"
                        variant="outline"
                        onClick={() => navigate("/blogs")}
                    >
                        Back to blogs
                    </Button>
                </div>
            </div>
        );
    }

    const { user, stats, blogs = [] } = profile;
    const displayName =
        user.username?.charAt(0).toUpperCase() + user.username?.slice(1) ||
        user.username;
    const initial = user.username?.charAt(0)?.toUpperCase() || "U";
    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en", {
              month: "long",
              year: "numeric",
          })
        : "—";

    return (
        <div className="relative flex-1 bg-gradient-to-b from-muted/50 via-background to-background">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[size:22px_22px] opacity-40"
            />

            <div className="relative mx-auto w-full max-w-6xl space-y-8 px-6 py-8 md:py-10">
                <Button
                    variant="ghost"
                    size="sm"
                    className="px-0 hover:bg-transparent"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {/* Hero profile panel */}
                <section className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur">
                    <div className="border-b border-border/60 bg-gradient-to-r from-muted/80 via-muted/30 to-transparent px-6 py-5 md:px-8">
                        <div className="inline-flex items-center gap-1.5 rounded-full border bg-background/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            <Sparkles className="h-3 w-3" />
                            Author profile
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 p-6 md:flex-row md:items-end md:justify-between md:p-8">
                        <div className="flex items-start gap-5">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-foreground text-3xl font-semibold text-background shadow-md md:h-24 md:w-24 md:text-4xl">
                                {initial}
                            </div>
                            <div className="min-w-0 pt-1">
                                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                    {displayName}
                                </h1>
                                <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                                    Stories, ideas, and published writing on
                                    Bloggly.
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                    <span className="inline-flex items-center gap-1.5">
                                        <CalendarDays className="h-4 w-4" />
                                        Member since {memberSince}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <FileText className="h-4 w-4" />
                                        @{user.username}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="h-11 shrink-0 rounded-full bg-foreground px-6 text-background shadow-md transition-all hover:bg-foreground/90 hover:shadow-lg"
                            onClick={() => navigate("/blogs")}
                        >
                            Explore blogs
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </section>

                {/* Stats */}
                <section className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Overview
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Public publishing snapshot
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <StatCard
                            label="Published blogs"
                            value={stats?.publishedBlogs ?? 0}
                            icon={FileText}
                        />
                        <StatCard
                            label="Total likes"
                            value={stats?.totalLikes ?? 0}
                            icon={Heart}
                        />
                        <StatCard
                            label="On Bloggly"
                            value={memberSince}
                            icon={CalendarDays}
                            isText
                        />
                    </div>
                </section>

                {/* Published blogs */}
                <section className="space-y-4 pb-4">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">
                                Published work
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Latest posts from {displayName}
                            </p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {stats?.publishedBlogs ?? 0} total
                        </span>
                    </div>

                    {blogs.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight">
                                No published blogs yet
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                                This author hasn’t shared any public posts.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog._id}
                                    to={`/blog/${blog.slug}`}
                                    className="group overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-md"
                                >
                                    {blog.image ? (
                                        <div className="h-40 overflow-hidden bg-muted">
                                            <img
                                                src={blog.image}
                                                alt={blog.title || "Blog cover"}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-muted to-background">
                                            <FileText className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                    )}

                                    <div className="space-y-3 p-5">
                                        <div className="space-y-2">
                                            <h3 className="line-clamp-2 text-base font-semibold tracking-tight transition-colors group-hover:underline">
                                                {blog.title || "Untitled"}
                                            </h3>
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {blog.shortDescription ||
                                                    "No description."}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1.5">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                {formatBlogDate(blog.createdAt)}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <span className="inline-flex items-center gap-1">
                                                    <Heart className="h-3.5 w-3.5" />
                                                    {blog.likes?.length || 0}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <MessageCircle className="h-3.5 w-3.5" />
                                                    {blog.commentCount ?? 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, isText = false }) => (
    <div className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>
                <p
                    className={`mt-2 font-semibold tracking-tight ${
                        isText ? "truncate text-lg" : "text-3xl"
                    }`}
                >
                    {value}
                </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <Icon className="h-4 w-4" />
            </div>
        </div>
    </div>
);

export default AuthorProfilePage;
