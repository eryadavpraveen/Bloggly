
import {
    CalendarDays, CircleUserRound, Heart, MessageCircle, Share2, MoreVertical, Upload, ArchiveRestore, Edit3, Trash2, ArrowUpRight
} from "lucide-react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { formatBlogDate } from "@/src/utils/DateHelper";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openLoginDialog } from "@/src/features/dialog/dialogSlice";
import DeleteBlogDialog from "@/components/dialogs/DeleteBlogDialog";
import { deleteArticle, publishArticle, unpublishArticle, likeArticle, unlikeArticle } from "@/src/features/blog/blogSlice";
import {
    ShowDirectErrorMessage,
    ShowDirectSuccessMessage,
    getErrorMessage,
} from "@/src/utils/ShowToastNotification";

const DEFAULT_COVER = "/images/blog-cover-placeholder.svg";

const BlogCard = ({ blog, isHomePage }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const { isLoadingWhileDeleting } = useSelector((state) => state.article);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const userId = user?._id || user?.id;
    const isLiked = blog?.likes?.some((id) => String(id) === String(userId));

    const handleEditBlogNavigation = (blogId) => {
        if (!isAuthenticated) {
            dispatch(openLoginDialog());
            return;
        }
        navigate(`/dashboard/blog/update/${blogId}`);
    };

    const handleViewBlogNavigation = (slug) => {
        if (isHomePage) {
            navigate(`/blog/${slug}`);
        } else {
            navigate(`/dashboard/blog/${slug}`);
        }
    };

    const handleDeleteClick = () => {
        if (!isAuthenticated) {
            dispatch(openLoginDialog());
            return;
        }

        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteArticle(blog._id)).unwrap();
            setDeleteOpen(false);
        } catch (error) {
            ShowDirectErrorMessage(getErrorMessage(error));
        }
    };

    const handleLike = async (e) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            dispatch(openLoginDialog());
            return;
        }

        if (isLiking) return;

        setIsLiking(true);
        try {
            if (isLiked) {
                await dispatch(unlikeArticle(blog._id)).unwrap();
            } else {
                await dispatch(likeArticle(blog._id)).unwrap();
            }
        } catch (error) {
            ShowDirectErrorMessage(getErrorMessage(error));
        } finally {
            setIsLiking(false);
        }
    };

    const handleComment = () => {
        if (!isAuthenticated) {
            dispatch(openLoginDialog());
            return;
        }

        if (isHomePage) {
            navigate(`/blog/${blog?.slug}#comments`);
        } else {
            navigate(`/dashboard/blog/${blog?.slug}#comments`);
        }
    };

    const handleShareBlog = async (e) => {
        e.stopPropagation();

        if (!blog?.slug) return;

        const shareData = {
            title: blog.title,
            text: blog.shortDescription,
            url: `${window.location.origin}/blog/${blog.slug}`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(shareData.url);
            ShowDirectSuccessMessage("Link copied to clipboard");
        } catch (error) {
            if (error?.name === "AbortError") return;
            ShowDirectErrorMessage("Unable to share blog");
        }
    };

    const handlePublishBlog = async (blogId) => {
        await dispatch(publishArticle(blogId)).unwrap();
    };

    const handleUnpublishBlog = async (blogId) => {
        await dispatch(unpublishArticle(blogId)).unwrap();
    };

    const status = blog?.status || "draft";
    const isPublished = status === "published";
    const tags = Array.isArray(blog?.tags) ? blog.tags : [];
    const authorName = blog?.user?.username || "Unknown author";
    const [coverSrc, setCoverSrc] = useState(blog?.image || DEFAULT_COVER);

    useEffect(() => {
        setCoverSrc(blog?.image || DEFAULT_COVER);
    }, [blog?.image]);

    return (
        <>
            <Card className="group flex h-full w-full flex-col overflow-hidden border-border/60 bg-card shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md">
                <button
                    type="button"
                    onClick={() => handleViewBlogNavigation(blog?.slug)}
                    className="relative block w-full overflow-hidden bg-muted text-left"
                    aria-label={`Open ${blog?.title || "blog"}`}
                >
                    <img
                        src={coverSrc}
                        alt={blog?.title || "Blog cover"}
                        onError={() => {
                            if (coverSrc !== DEFAULT_COVER) {
                                setCoverSrc(DEFAULT_COVER);
                            }
                        }}
                        className="aspect-[16/9] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>

                <CardHeader className="gap-3 px-4 pb-2 pt-4">
                    <div className="flex items-center justify-between gap-3">
                        <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${isPublished
                                ? "bg-foreground text-background"
                                : "border border-border bg-muted text-muted-foreground"
                                }`}
                        >
                            {status}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>{formatBlogDate(blog?.createdAt)}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleViewBlogNavigation(blog?.slug)}
                        className="text-left"
                    >
                        <CardTitle className="text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-foreground">
                            {blog?.title || "Untitled Blog"}
                        </CardTitle>
                    </button>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-0">
                    <CardDescription className="text-[13.5px] leading-relaxed text-muted-foreground">
                        {blog?.shortDescription || "No short description provided yet."}
                    </CardDescription>

                    <div className="mt-auto space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted/60">
                                <CircleUserRound className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">{authorName}</span>
                        </div>

                        {tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {tags.slice(0, 5).map((tag, index) => (
                                    <span
                                        key={`${tag}-${index}`}
                                        className="rounded-md bg-muted/70 px-2 py-1 text-[11px] font-medium text-muted-foreground"
                                    >
                                        {tag}
                                    </span>
                                ))}

                                {tags.length > 5 && (
                                    <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                                        +{tags.length - 5}
                                    </span>
                                )}
                            </div>
                        ) : null}
                    </div>
                </CardContent>

                <CardFooter className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 bg-muted/30 px-3 py-2.5">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <button
                            type="button"
                            onClick={handleLike}
                            disabled={isLiking}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-background hover:text-red-500 disabled:opacity-50"
                        >
                            <Heart
                                className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                            />
                            {blog?.likes?.length || 0}
                        </button>

                        <button
                            type="button"
                            onClick={handleComment}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-background hover:text-foreground"
                        >
                            <MessageCircle className="h-4 w-4" />
                            {blog?.commentCount ?? blog?.comments?.length ?? 0}
                        </button>

                        <button
                            type="button"
                            onClick={handleShareBlog}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-background hover:text-foreground"
                        >
                            <Share2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <CardAction>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-8 gap-1 border-border/80 bg-background px-2.5 text-xs"
                                onClick={() => handleViewBlogNavigation(blog?.slug)}
                            >
                                Read
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </Button>
                        </CardAction>

                        {isHomePage ? null : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="bottom" align="end">
                                    <DropdownMenuItem onClick={() => handleEditBlogNavigation(blog?._id)}>
                                        <Edit3 className="mr-2 h-4 w-4" />
                                        Update
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    {blog?.status === "draft" ? (
                                        <DropdownMenuItem onClick={() => handlePublishBlog(blog?._id)}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Publish
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onClick={() => handleUnpublishBlog(blog?._id)}>
                                            <ArchiveRestore className="mr-2 h-4 w-4" />
                                            Unpublish
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        data-variant="destructive"
                                        onClick={handleDeleteClick}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </CardFooter>
            </Card>
            <DeleteBlogDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                blog={blog}
                onDelete={handleConfirmDelete}
                isDeleting={isLoadingWhileDeleting}
            />
        </>
    );
};

export default BlogCard;
