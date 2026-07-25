import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { ShowDirectErrorMessage, ShowDirectSuccessMessage } from "../../utils/ShowToastNotification"
import "../../styles/quill.css";

import {
    ArrowLeft,
    FileText,
    Upload,
    Save,
    Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
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
import e from "cors";
import { createArticle } from "@/src/features/blog/blogSlice";

const CreateBlogPage = () => {
    const [blogTitle, setBlogTitle] = useState("");
    const [blogDescription, setBlogDescription] = useState("");
    const [blogTags, setBlogTags] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const [blogImage, setBlogImage] = useState(null);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);


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

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            ShowDirectErrorMessage(
                "Only JPG, PNG and WEBP images are allowed."
            );

            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            ShowDirectErrorMessage(
                "Image size should be less than 5 MB."
            );

            e.target.value = "";
            return;
        }

        setBlogImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setBlogImage(null);
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const isFormValid =
        blogTitle.trim() &&
        blogDescription.trim() &&
        blogContent
            .replace(/<(.|\n)*?>/g, "")
            .trim();

    const resetForm = () => {
        setBlogTitle("");
        setBlogDescription("");
        setBlogTags("");
        setBlogContent("");

        setBlogImage(null);
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDraftArticle = async () => {
        if (!isFormValid) {
            ShowDirectErrorMessage("Title, description, and content are required for Draft.");
            return;
        }
        setIsLoading(true);

        try {
            const result = await dispatch(
                createArticle({
                    title: blogTitle,
                    shortDescription: blogDescription,
                    tags: blogTags.split(",").map((tag) => tag.trim()),
                    content: blogContent,
                    image: blogImage,
                    status: "draft",
                })
            );

            if (createArticle.fulfilled.match(result)) {
                resetForm();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublishArticle = async () => {
        if (!isFormValid) {
            ShowDirectErrorMessage("Title, description, and content are required for Publish.");
            return;
        }
        setIsLoading(true);

        try {
            const result = await dispatch(
                createArticle({
                    title: blogTitle,
                    shortDescription: blogDescription,
                    tags: blogTags.split(",").map((tag) => tag.trim()),
                    content: blogContent,
                    image: blogImage,
                    status: "published",
                })
            );

            if (createArticle.fulfilled.match(result)) {
                resetForm();
            }
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="mx-auto max-w-6xl p-6">
            {/* Header */}
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
                        <h1 className="text-3xl font-bold">
                            Create New Blog
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Share your thoughts and ideas with the world
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Section */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Basic Information */}
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

                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Short Description <span className="text-red-500">*</span>
                                </label>

                                <Textarea
                                    id="description"
                                    rows={3}
                                    maxLength={300}
                                    placeholder="Write a compelling short description..."
                                    value={blogDescription}
                                    onChange={(e) => setBlogDescription(e.target.value)}
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
                                />

                                <p className="mt-2 text-xs text-muted-foreground">
                                    Add relevant tags to help readers discover
                                    your content
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content */}
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
                                />
                            </div>

                            <p className="mt-3 text-xs text-muted-foreground">
                                Use the toolbar above to format your content
                                with headings, links, images, and more.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Section */}
                <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                    {/* Featured Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Featured Image</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {imagePreview ? (
                                <div className="space-y-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-48 w-full rounded-lg object-cover"
                                    />

                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Change Image
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={handleRemoveImage}
                                        >
                                            Remove
                                        </Button>
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

                    {/* Publishing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Publishing Options</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <Button
                                onClick={handleDraftArticle}
                                variant="outline"
                                className="w-full justify-center"
                                disabled={isLoading}
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
                                onClick={handlePublishArticle}
                                disabled={!isFormValid || isLoading}
                                className="mt-2 w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Publish Blog
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground">
                                Once published, your blog will be visible to all
                                readers.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Writing Tips */}
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

export default CreateBlogPage;