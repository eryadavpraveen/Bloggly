import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Share2, Calendar, User, Edit, Upload, Download, Trash2, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CommentContainer from "@/components/comment/CommentContainer";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteArticle,
    fetchCurrentArticle,
    publishArticle,
    unpublishArticle,
    likeArticle,
    unlikeArticle,
} from "@/src/features/blog/blogSlice";
import BlogSkeleton from "@/components/skeleton/BlogSkeleton";
import DeleteBlogDialog from "@/components/dialogs/DeleteBlogDialog";
import { openLoginDialog } from "@/src/features/dialog/dialogSlice";
import {
    ShowDirectErrorMessage,
    ShowDirectSuccessMessage,
    getErrorMessage,
} from "@/src/utils/ShowToastNotification";


const ViewBlog = ({ isPublicPage = false }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { currentArticle, isLoading, error, isLoadingWhileDeleting } = useSelector(
        (state) => state.article
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug } = useParams();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const userId = user?._id || user?.id;
    const isLiked = currentArticle?.likes?.some(
        (id) => String(id) === String(userId)
    );

    const isBlogOwner = () => {
        if (!isAuthenticated || !user || !currentArticle) return false;
        const blogUserId = currentArticle.user?._id || currentArticle.user;
        const currentUserId = user._id || user.id;
        return String(blogUserId) === String(currentUserId);
    }

    const handleEditBlogNavigation = (blogId) => {
        // Navigate to the edit blog page for the given blogId
        navigate(`/dashboard/blog/update/${blogId}`);
    }

    const handleLike = async () => {
        if (!isAuthenticated) {
            dispatch(openLoginDialog());
            return;
        }

        if (!currentArticle?._id || isLiking) return;

        setIsLiking(true);
        try {
            if (isLiked) {
                await dispatch(unlikeArticle(currentArticle._id)).unwrap();
            } else {
                await dispatch(likeArticle(currentArticle._id)).unwrap();
            }
        } catch (error) {
            ShowDirectErrorMessage(getErrorMessage(error));
        } finally {
            setIsLiking(false);
        }
    };

    const HandleShareBlog = async () => {
        if (!BLOG_DATA?.slug) return;

        const shareData = {
            title: BLOG_DATA.title,
            text: BLOG_DATA.shortDescription,
            url: `${window.location.origin}/blog/${BLOG_DATA.slug}`,
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
        const result = await dispatch(publishArticle(blogId));

        if (publishArticle.fulfilled.match(result)) {
            dispatch(fetchCurrentArticle(slug));
        }
    };

    const handleUnpublishBlog = async (blogId) => {
        const result = await dispatch(unpublishArticle(blogId));

        if (unpublishArticle.fulfilled.match(result)) {
            dispatch(fetchCurrentArticle(slug));
        }
    };

    const handleDeleteClick = () => {
        if (!isAuthenticated) {
            dispatch(openLoginDialog());
            return;
        }
        if (!isBlogOwner()) return;
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteArticle(currentArticle._id)).unwrap();
            setDeleteOpen(false);
            navigate(isPublicPage ? "/blogs" : "/dashboard/blogs");
        } catch (error) {
            ShowDirectErrorMessage(getErrorMessage(error));
        }
    };


    useEffect(() => {
        if (!isAuthenticated && !isPublicPage) {
            navigate("/login");
        }
    }, [isAuthenticated, isPublicPage, navigate]);

    useEffect(() => {
        if (slug) {
            dispatch(fetchCurrentArticle(slug));
        }
    }, [dispatch, slug]);

    useEffect(() => {
        if (isLoading || error) return;
        if (window.location.hash !== "#comments") return;

        const timer = setTimeout(() => {
            const el = document.getElementById("comments");
            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [isLoading, error, slug, currentArticle]);

    if (isLoading) {
        return <BlogSkeleton />;
    }


    if (error) {
        const errorMessage =
            typeof error === "string"
                ? error
                : error?.message || "Something went wrong.";

        let title = "Unable to Load Blog";
        let description =
            "We couldn't load this blog. Please try again in a few moments.";

        if (
            errorMessage.toLowerCase().includes("network")
        ) {
            title = "No Internet Connection";
            description =
                "Please check your internet connection and try again.";
        } else if (
            errorMessage.toLowerCase().includes("not found") ||
            errorMessage.toLowerCase().includes("404")
        ) {
            title = "Blog Not Found";
            description =
                "The blog you're looking for doesn't exist or may have been removed.";
        } else if (
            errorMessage.toLowerCase().includes("500") ||
            errorMessage.toLowerCase().includes("server")
        ) {
            title = "Server Error";
            description =
                "Something went wrong on our end. Please try again later.";
        }
        return (
            <div className="absolute inset-0 flex items-center justify-center">
                <Card className="w-full max-w-md shadow-lg">
                    <CardContent className="flex flex-col items-center py-10 text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-destructive"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v4m0 4h.01M10.29 3.86l-8 14A1 1 0 003.17 19h17.66a1 1 0 00.88-1.5l-8-14a1 1 0 00-1.76 0z"
                                />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold">
                            {title}
                        </h2>

                        <p className="mt-3 text-sm text-muted-foreground">
                            {description}
                        </p>

                        <div className="mt-8 flex gap-3">
                            <Button
                                onClick={() => dispatch(fetchCurrentArticle(slug))}
                            >
                                Retry
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() =>
                                    navigate(
                                        isPublicPage
                                            ? "/blogs"
                                            : "/dashboard/blogs"
                                    )
                                }
                            >
                                Back to Blogs
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }


    const BLOG_DATA = currentArticle || {};

    return (
        <>
            <div className="mx-auto p-5">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-3"
                        onClick={() => { isPublicPage ? navigate("/blogs") : navigate("/dashboard/blogs") }}
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Blogs
                    </Button>

                    <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium uppercase tracking-[0.15em]">
                        {BLOG_DATA.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{BLOG_DATA.title}</h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {BLOG_DATA.shortDescription}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{BLOG_DATA.user?.username?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-foreground">{BLOG_DATA.user?.username}</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-foreground">
                                        {BLOG_DATA.createdAt &&
                                            new Date(BLOG_DATA.createdAt).toLocaleDateString("en", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {BLOG_DATA.image && (
                            <div className="w-full overflow-hidden rounded-lg bg-muted/50 shadow-sm">
                                <img
                                    src={BLOG_DATA.image}
                                    alt={BLOG_DATA.title}
                                    className="w-full max-h-80 object-contain"
                                />
                            </div>
                        )}


                        <Card>
                            <CardContent className="pt-6">
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: (BLOG_DATA.content || "").replace(/&nbsp;/g, " "),
                                    }}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {(typeof BLOG_DATA.tags === "string"
                                        ? JSON.parse(BLOG_DATA.tags)
                                        : BLOG_DATA.tags || []
                                    ).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card id="comments">
                            <CardHeader>
                                <CardTitle className="text-lg">Comments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">

                                    {/* Comments Section */}
                                    <CommentContainer />
                                </p>
                            </CardContent>
                        </Card>
                    </div>


                    <div className="space-y-6 lg:sticky lg:top-5 lg:self-start">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">About the Author</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback>{BLOG_DATA.user?.username?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-medium">{BLOG_DATA.user?.username}</h3>
                                            <p className="text-sm text-muted-foreground">Blog Author</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Passionate writer and technology enthusiast sharing insights and experiences.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start"
                                        disabled={!BLOG_DATA.user?.username}
                                        onClick={() =>
                                            navigate(
                                                `/user/${BLOG_DATA.user.username}`
                                            )
                                        }
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        View Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Blog Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className="capitalize">{BLOG_DATA.status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created</span>
                                        <span className="text-foreground">
                                            {BLOG_DATA.createdAt &&
                                                new Date(BLOG_DATA.createdAt).toLocaleDateString("en", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Updated</span>
                                        <span>
                                            {BLOG_DATA.updatedAt &&
                                                new Date(BLOG_DATA.updatedAt).toLocaleDateString("en", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Likes</span>
                                        <button
                                            type="button"
                                            onClick={handleLike}
                                            disabled={isLiking}
                                            className="flex items-center gap-1.5 hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
                                            <Heart
                                                className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                                            />
                                            <span>{BLOG_DATA.likes?.length || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-2">
                                    {isBlogOwner() && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => handleEditBlogNavigation(BLOG_DATA._id)}
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Update Blog
                                        </Button>
                                    )}

                                    {isBlogOwner() && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() =>
                                                BLOG_DATA.status === "draft"
                                                    ? handlePublishBlog(BLOG_DATA._id)
                                                    : handleUnpublishBlog(BLOG_DATA._id)
                                            }
                                        >
                                            {BLOG_DATA.status === "draft" ? (
                                                <>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Publish Blog
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Unpublish Blog
                                                </>
                                            )}
                                        </Button>
                                    )}

                                    {isBlogOwner() && (
                                        <Button
                                            variant="destructive"
                                            className="w-full justify-start"
                                            onClick={handleDeleteClick}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Blog
                                        </Button>
                                    )}

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => HandleShareBlog(BLOG_DATA._id)}
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share Blog
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <DeleteBlogDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                blog={BLOG_DATA}
                onDelete={handleConfirmDelete}
                isDeleting={isLoadingWhileDeleting}
            />
        </>
    );
};

export default ViewBlog;
