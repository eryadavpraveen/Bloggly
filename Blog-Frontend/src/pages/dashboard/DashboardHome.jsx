import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchUserBlogs } from "@/src/services/blogService";
import { Button } from "@/components/ui/button";
import {
    FileText,
    PenLine,
    Heart,
    MessageCircle,
    Eye,
    FileEdit,
    ArrowRight,
    Loader2,
    Globe,
    Sparkles,
} from "lucide-react";
import { formatBlogDate } from "@/src/utils/DateHelper";

const DashboardHome = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBlogs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchUserBlogs({ page: 1, limit: 50 });
                if (data?.status?.toLowerCase() === "success") {
                    setBlogs(Array.isArray(data.data) ? data.data : []);
                } else {
                    setBlogs([]);
                }
            } catch {
                setError("Failed to load dashboard data.");
                setBlogs([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadBlogs();
    }, []);

    const stats = useMemo(() => {
        const published = blogs.filter((b) => b.status === "published");
        const drafts = blogs.filter((b) => b.status === "draft");
        const totalLikes = blogs.reduce(
            (sum, b) => sum + (b.likes?.length || 0),
            0
        );
        const totalComments = blogs.reduce(
            (sum, b) => sum + (b.commentCount ?? b.comments?.length ?? 0),
            0
        );

        return {
            total: blogs.length,
            published: published.length,
            drafts: drafts.length,
            likes: totalLikes,
            comments: totalComments,
        };
    }, [blogs]);

    const recentBlogs = useMemo(() => {
        return [...blogs]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )
            .slice(0, 4);
    }, [blogs]);

    const draftBlogs = useMemo(() => {
        return blogs
            .filter((b) => b.status === "draft")
            .sort(
                (a, b) =>
                    new Date(b.updatedAt || b.createdAt).getTime() -
                    new Date(a.updatedAt || a.createdAt).getTime()
            )
            .slice(0, 4);
    }, [blogs]);

    const mostLiked = useMemo(() => {
        return [...blogs]
            .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
            .slice(0, 3);
    }, [blogs]);

    const mostCommented = useMemo(() => {
        return [...blogs]
            .sort(
                (a, b) =>
                    (b.commentCount ?? b.comments?.length ?? 0) -
                    (a.commentCount ?? a.comments?.length ?? 0)
            )
            .slice(0, 3);
    }, [blogs]);

    // Prefer a display name if you add one later; otherwise format stored username
    const rawUsername = user?.username?.trim();
    const UserName =
        user?.fullName?.trim() ||
        user?.name?.trim() ||
        (rawUsername
            ? rawUsername
            : "there");
    const initial = UserName.charAt(0).toUpperCase();
    const todayLabel = new Date().toLocaleDateString("en", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    const openBlog = (blog) => {
        if (!blog?.slug) return;
        navigate(`/dashboard/blog/${blog.slug}`);
    };

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="relative flex-1 bg-gradient-to-b from-muted/50 via-background to-background">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[size:22px_22px] opacity-40"
            />

            <div className="relative mx-auto w-full max-w-6xl space-y-8 p-6 md:p-8">
                {/* Welcome panel */}
                <section className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur">
                    <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-foreground text-lg font-semibold text-background shadow-sm">
                                {initial}
                            </div>
                            <div>
                                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border bg-muted/60 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    <Sparkles className="h-3 w-3" />
                                    Creator dashboard
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                    Welcome back, {UserName}
                                </h1>
                                <p className="mt-1.5 max-w-xl text-sm text-muted-foreground md:text-base">
                                    {todayLabel}. Here’s a clear view of your
                                    writing, drafts, and engagement.
                                </p>
                            </div>
                        </div>

                        <Button
                            className="h-11 shrink-0 rounded-full bg-foreground px-6 text-background shadow-md transition-all hover:bg-foreground/90 hover:shadow-lg"
                            onClick={() => navigate("/dashboard/blog/create")}
                        >
                            <PenLine className="mr-2 h-4 w-4" />
                            Write a blog
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </section>

                {error ? (
                    <p className="text-sm text-destructive">{error}</p>
                ) : null}

                {/* Stats */}
                <section className="space-y-3">
                    <SectionHeading
                        title="Overview"
                        subtitle="Your publishing snapshot"
                    />
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <StatCard
                            label="Total blogs"
                            value={stats.total}
                            icon={FileText}
                        />
                        <StatCard
                            label="Published"
                            value={stats.published}
                            icon={Eye}
                        />
                        <StatCard
                            label="Drafts"
                            value={stats.drafts}
                            icon={FileEdit}
                        />
                        <StatCard
                            label="Total likes"
                            value={stats.likes}
                            icon={Heart}
                        />
                        <StatCard
                            label="Comments"
                            value={stats.comments}
                            icon={MessageCircle}
                        />
                    </div>
                </section>

                {/* Quick actions */}
                <section className="space-y-3">
                    <SectionHeading
                        title="Quick actions"
                        subtitle="Jump into your next task"
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                        <PremiumActionButton
                            icon={Globe}
                            title="Browse public blogs"
                            description="Explore the community"
                            onClick={() => navigate("/blogs")}
                        />
                        <PremiumActionButton
                            icon={PenLine}
                            title="Create blog"
                            description="Start a new draft"
                            onClick={() => navigate("/dashboard/blog/create")}
                        />
                        <PremiumActionButton
                            icon={FileText}
                            title="My Blogs"
                            description="Manage your posts"
                            onClick={() => navigate("/dashboard/blogs")}
                        />

                    </div>
                </section>

                {blogs.length === 0 ? (
                    <section className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <PenLine className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight">
                            Your writing space is ready
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                            Publish your first blog to unlock stats, drafts, and
                            engagement highlights here.
                        </p>
                        <Button
                            className="mt-6 h-11 rounded-full bg-foreground px-6 text-background shadow-md transition-all hover:bg-foreground/90 hover:shadow-lg"
                            onClick={() => navigate("/dashboard/blog/create")}
                        >
                            Create your first blog
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </section>
                ) : (
                    <>
                        <section className="space-y-3">
                            <SectionHeading
                                title="Your library"
                                subtitle="Recent work and unfinished drafts"
                            />
                            <div className="grid gap-4 lg:grid-cols-2">
                                <BlogListCard
                                    title="Recent blogs"
                                    emptyText="No recent blogs."
                                    blogs={recentBlogs}
                                    onOpen={openBlog}
                                    showMeta="date"
                                />
                                <BlogListCard
                                    title="Drafts"
                                    emptyText="No drafts right now."
                                    blogs={draftBlogs}
                                    onOpen={openBlog}
                                    showMeta="date"
                                />
                            </div>
                        </section>

                        <section className="space-y-3 pb-4">
                            <SectionHeading
                                title="Highlights"
                                subtitle="What’s performing best"
                            />
                            <div className="grid gap-4 lg:grid-cols-2">
                                <BlogListCard
                                    title="Most liked"
                                    emptyText="No likes yet."
                                    blogs={mostLiked}
                                    onOpen={openBlog}
                                    showMeta="likes"
                                />
                                <BlogListCard
                                    title="Most commented"
                                    emptyText="No comments yet."
                                    blogs={mostCommented}
                                    onOpen={openBlog}
                                    showMeta="comments"
                                />
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

const SectionHeading = ({ title, subtitle }) => (
    <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
);

const PremiumActionButton = ({ icon: Icon, title, description, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border-2 border-foreground/15 bg-card/80 px-4 py-4 text-left shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md"
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

const StatCard = ({ label, value, icon: Icon }) => (
    <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                    {value}
                </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground">
                <Icon className="h-4 w-4" />
            </div>
        </div>
    </div>
);

const BlogListCard = ({ title, blogs, emptyText, onOpen, showMeta }) => (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur">
        <div className="border-b border-border/70 px-5 py-4">
            <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        </div>
        <div className="space-y-2 p-3">
            {blogs.length === 0 ? (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                    {emptyText}
                </p>
            ) : (
                blogs.map((blog) => (
                    <button
                        key={blog._id}
                        type="button"
                        onClick={() => onOpen(blog)}
                        className="group flex w-full items-center justify-between gap-3 rounded-xl border border-transparent bg-muted/30 px-3 py-3 text-left transition-all hover:border-border hover:bg-background hover:shadow-sm"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                                {blog.title || "Untitled"}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {showMeta === "likes" &&
                                    `${blog.likes?.length || 0} likes`}
                                {showMeta === "comments" &&
                                    `${blog.commentCount ?? blog.comments?.length ?? 0} comments`}
                                {showMeta === "date" &&
                                    `${blog.status || "draft"} · ${formatBlogDate(blog.createdAt)}`}
                            </p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </button>
                ))
            )}
        </div>
    </div>
);

export default DashboardHome;
