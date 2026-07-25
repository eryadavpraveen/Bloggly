import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { ShowDirectErrorMessage } from "../../utils/ShowToastNotification";
import "../../styles/quill.css";

import {
    ArrowLeft,
    FileText,
    Upload,
    Save,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    fetchArticleById,
    updateArticle,
    publishArticle,
    unpublishArticle,
} from "@/src/features/blog/blogSlice";

const UpdateBlogPage = () => {
    const { Id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const [blogTitle, setBlogTitle] = useState("");
    const [blogDescription, setBlogDescription] = useState("");
    const [blogTags, setBlogTags] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const [blogImage, setBlogImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [blogStatus, setBlogStatus] = useState("draft");
    const [isFetching, setIsFetching] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadBlog = async () => {
            if (!Id) return;

            setIsFetching(true);
            try {
                const result = await dispatch(fetchArticleById(Id));

                if (fetchArticleById.fulfilled.match(result)) {
                    const blog = result.payload;
                    setBlogTitle(blog.title || "");
                    setBlogDescription(blog.shortDescription || "");
                    setBlogTags(Array.isArray(blog.tags) ? blog.tags.join(", ") : "");
                    setBlogContent(blog.content || "");
                    setExistingImage(blog.image || null);
                    setBlogStatus(blog.status || "draft");
                } else {
                    ShowDirectErrorMessage("Failed to load blog for editing.");
                    navigate("/dashboard/blogs");
                }
            } finally {
                setIsFetching(false);
            }
        };

        loadBlog();
    }, [Id, dispatch, navigate]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            ShowDirectErrorMessage("Only JPG, PNG and WEBP images are allowed.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            ShowDirectErrorMessage("Image size should be less than 5 MB.");
            e.target.value = "";
            return;
        }

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setBlogImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setBlogImage(null);
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const previewSrc = imagePreview || existingImage;

    const isFormValid =
        blogTitle.trim() &&
        blogDescription.trim() &&
        blogContent.replace(/<(.|\n)*?>/g, "").trim();

    const buildArticlePayload = () => ({
        title: blogTitle,
        shortDescription: blogDescription,
        tags: blogTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        content: blogContent,
        image: blogImage || undefined,
    });

    const handleSaveDraft = async () => {
        if (!isFormValid) {
            ShowDirectErrorMessage(
                "Title, description, and content are required."
            );
            return;
        }

        setIsLoading(true);
        try {
            const result = await dispatch(
                updateArticle({ id: Id, articleData: buildArticlePayload() })
            );

            if (!updateArticle.fulfilled.match(result)) return;

            if (blogStatus === "published") {
                const unpublishResult = await dispatch(unpublishArticle(Id));
                if (unpublishArticle.fulfilled.match(unpublishResult)) {
                    setBlogStatus("draft");
                }
            }

            navigate("/dashboard/blogs");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublishUpdated = async () => {
        if (!isFormValid) {
            ShowDirectErrorMessage(
                "Title, description, and content are required."
            );
            return;
        }

        setIsLoading(true);
        try {
            const result = await dispatch(
                updateArticle({ id: Id, articleData: buildArticlePayload() })
            );

            if (!updateArticle.fulfilled.match(result)) return;

            const updated = result.payload;

            if (blogStatus !== "published") {
                await dispatch(publishArticle(Id));
            }

            const slug = updated?.slug;
            if (slug) {
                navigate(`/dashboard/blog/${slug}`);
            } else {
                navigate("/dashboard/blogs");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl p-6">
            <div className="mb-8">
                <Link to="/dashboard/blogs">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-5 px-0 hover:bg-transparent"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </Link>

                <div className="flex items-start gap-3">
                    <FileText className="mt-1 h-7 w-7 text-muted-foreground" />

                    <div>
                        <h1 className="text-3xl font-bold">Update Blog</h1>
                        <p className="mt-1 text-muted-foreground">
                            Edit your post and save the changes
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Blog Title <span className="text-red-500">*</span>
                                </label>

                                <Input
                                    id="title"
                                    type="text"
                                    className="text-base"
                                    placeholder="Enter an engaging title for your blog post..."
                                    value={blogTitle}
                                    onChange={(e) => setBlogTitle(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Short Description{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <Textarea
                                    id="description"
                                    rows={3}
                                    maxLength={300}
                                    placeholder="Write a compelling short description..."
                                    value={blogDescription}
                                    onChange={(e) =>
                                        setBlogDescription(e.target.value)
                                    }
                                    disabled={isLoading}
                                />
                                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                    <span>Keep it concise and engaging.</span>
                                    <span>{blogDescription.length}/300</span>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Tags
                                </label>

                                <Input
                                    id="tags"
                                    placeholder="technology, programming, web-development (comma separated)"
                                    value={blogTags}
                                    onChange={(e) => setBlogTags(e.target.value)}
                                    disabled={isLoading}
                                />

                                <p className="mt-2 text-xs text-muted-foreground">
                                    Add relevant tags to help readers discover
                                    your content
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <label className="mb-3 block text-sm font-medium">
                                Blog Content <span className="text-red-500">*</span>
                            </label>

                            <div className="overflow-hidden rounded-md border">
                                <ReactQuill
                                    theme="snow"
                                    value={blogContent}
                                    onChange={setBlogContent}
                                    placeholder="Start writing your blog content here..."
                                    className="quill-editor"
                                    readOnly={isLoading}
                                />
                            </div>

                            <p className="mt-3 text-xs text-muted-foreground">
                                Use the toolbar above to format your content
                                with headings, links, images, and more.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                    <Card>
                        <CardHeader>
                            <CardTitle>Featured Image</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {previewSrc ? (
                                <div className="space-y-3">
                                    <img
                                        src={previewSrc}
                                        alt="Preview"
                                        className="h-48 w-full rounded-lg object-cover"
                                    />

                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            disabled={isLoading}
                                        >
                                            Change Image
                                        </Button>

                                        {imagePreview && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={handleRemoveImage}
                                                disabled={isLoading}
                                            >
                                                Undo
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <label
                                    htmlFor="featured-image"
                                    className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-center transition hover:bg-muted/40"
                                >
                                    <Upload className="mb-4 h-8 w-8 text-muted-foreground" />

                                    <p className="font-medium">
                                        Upload Featured Image
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        PNG, JPG, WEBP up to 5MB
                                    </p>
                                </label>
                            )}

                            <input
                                disabled={isLoading}
                                ref={fileInputRef}
                                id="featured-image"
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Publishing Options</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <Button
                                onClick={handleSaveDraft}
                                variant="outline"
                                className="w-full justify-center"
                                disabled={isLoading || !isFormValid}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save as Draft
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={handlePublishUpdated}
                                disabled={!isFormValid || isLoading}
                                className="mt-2 w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Publish Updated Blog
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground">
                                Current status:{" "}
                                <span className="font-medium capitalize">
                                    {blogStatus}
                                </span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Writing Tips</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                <li>Use clear, descriptive headings</li>
                                <li>Add images to break up text</li>
                                <li>Keep paragraphs short and readable</li>
                                <li>Use bullet points for lists</li>
                                <li>Proofread before publishing</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UpdateBlogPage;
