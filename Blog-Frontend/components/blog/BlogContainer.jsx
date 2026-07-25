import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect, useMemo, useRef } from "react";
import BlogCard from "./BlogCard";
import { ChevronRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppPagination } from "../ui/app-pagination";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { openLoginDialog } from "@/src/features/dialog/dialogSlice";
import AppEmpty from "../ui/app-empty";
import { fetchAllPublicArticles, fetchUserArticles, setFilters } from "@/src/features/blog/blogSlice";
import { TriangleAlert, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ContainerSkeleton from "../skeleton/ContainerSkeleton";
import debounce from "lodash.debounce";

const BlogContainer = ({ showViewAllButton = false, showPagination = false, isHomePage = false }) => {

    const navigate = useNavigate();

    // search and filter states
    const [searchInput, setSearchInput] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const {
        articles,
        isLoadingWhileFetchingArticles,
        error,
        pagination,
        filters,
    } = useSelector((state) => state.article);

    const dispatch = useDispatch();
    const filtersRef = useRef(filters);
    const paginationRef = useRef(pagination);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const fetchBlogs = ({
        page = 1,
        limit = 9,
        searchQuery = filters.searchQuery,
        status = filters.status,
        sortBy = filters.sortBy,
    } = {}) => {
        if (isHomePage) {
            dispatch(fetchAllPublicArticles({ page, limit, searchQuery, sortBy }));
        } else {
            dispatch(fetchUserArticles({ page, limit, searchQuery, status, sortBy }));
        }
    };

    useEffect(() => {
        fetchBlogs({ page: 1, limit: 9 });
    }, [dispatch, isHomePage]);

    useEffect(() => {
        filtersRef.current = filters;
        paginationRef.current = pagination;
    }, [filters, pagination]);



    const showPaginationAction =
        showPagination &&
        (articles?.length ?? 0) > 0 &&
        (pagination?.totalPages ?? 0) > 1;

    const hasActiveFilters = Boolean(
        (filters.searchQuery || "").trim() ||
        (filters.status && filters.status !== "all")
    );


    const debouncedHandleFilterChange = useMemo(
        () =>
            debounce((newFilters) => {
                const updatedFilters = {
                    ...filtersRef.current,
                    ...newFilters,
                };

                dispatch(setFilters(updatedFilters));

                fetchBlogs({
                    ...updatedFilters,
                    page: 1,
                    limit: paginationRef.current.limit || 9,
                });
            }, 1250),
        []
    );

    useEffect(() => {
        return () => {
            debouncedHandleFilterChange.cancel();
        };
    }, [debouncedHandleFilterChange]);


    const handleClearFilters = () => {
        setSearchInput("");
        setSortOption("");
        setStatusFilter("");
        debouncedHandleFilterChange({
            searchQuery: "",
            status: "all",
            sortBy: "newest",
        });
    };

    const handleCreateBlog = () => {
        if (!isAuthenticated) {
            dispatch(openLoginDialog());
            return;
        }
        navigate("/dashboard/blog/create");
    };

    const publicBlogsNavigation = () => {
        navigate("/blogs");
    };

    const handlePageChange = (page) => {
        fetchBlogs({ page, limit: pagination.limit || 9 });
        window.scrollTo(0, 0);
    };

    const handlesortOptionChange = (value) => {
        setSortOption(value);
        debouncedHandleFilterChange({ sortBy: value });
    };

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
        debouncedHandleFilterChange({ status: value });
    };

    const handleSearchInputChange = (value) => {
        setSearchInput(value);
        debouncedHandleFilterChange({ searchQuery: value });
    };

    {/* API Call on Enter Key Press */ }
    // const handleSearchInputChange = (value) => {
    //     setSearchInput(value);
    // };
    // const handleSearchSubmit = () => {
    //     handleFilterChange({ searchQuery: searchInput });
    // };

    const renderContent = () => {
        if (isLoadingWhileFetchingArticles) {
            return <ContainerSkeleton />;
        }

        if (error) {
            return (
                <div className="grid min-h-[40vh] place-items-center px-4">
                    <Card className="w-full max-w-md shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                                <TriangleAlert className="h-8 w-8 text-destructive" />
                            </div>

                            <h2 className="text-xl font-semibold">
                                Failed to Load Blogs
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {typeof error === "string"
                                    ? error
                                    : error?.message ||
                                    "Something went wrong while fetching blogs. Please try again."}
                            </p>

                            <Button
                                className="mt-6"
                                onClick={() => fetchBlogs({ page: 1, limit: pagination.limit || 9 })}
                            >
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        if (!articles?.length) {
            if (hasActiveFilters) {
                return (
                    <div className="flex min-h-[40vh] items-center justify-center px-4">
                        <AppEmpty
                            title="No Matching Blogs"
                            description="No blogs match your search or filters. Try different keywords or clear filters."
                            buttonText="Clear Filters"
                            onAddClick={handleClearFilters}
                        />
                    </div>
                );
            }

            return (
                <div className="flex min-h-[40vh] items-center justify-center px-4">
                    <AppEmpty
                        title="No Blogs Found"
                        description="There are no blogs available yet. Start sharing your ideas by creating your first blog."
                        buttonText="Create Your First Blog"
                        onAddClick={handleCreateBlog}
                    />
                </div>
            );
        }

        return (
            <>
                <div className="grid grid-cols-1 gap-4 px-5 py-3 md:grid-cols-2 xl:grid-cols-3">
                    {articles.map((blog) => (
                        <BlogCard
                            key={blog._id || blog.id}
                            blog={blog}
                            isHomePage={isHomePage}
                        />
                    ))}
                </div>

                <div className="flex flex-col items-center justify-center gap-4 pt-2 pb-8 md:flex-row md:justify-between">
                    {showViewAllButton && (
                        <div className="w-full flex justify-center px-6 py-4">
                            <Button variant="default" onClick={publicBlogsNavigation}>
                                View All Blogs
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {showPaginationAction && (
                        <AppPagination
                            totalPages={pagination.totalPages}
                            currentPage={pagination.currentPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="space-y-3">
            <div
                className={cn(
                    "sticky z-20 border border-border/70 rounded-xl px-5 py-3 shadow-sm bg-background",
                    isHomePage ? "top-16 rounded-t-none" : "top-0"
                )}
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold tracking-tight">Latest Blogs</h2>
                    </div>

                    <div className="flex w-full flex-row flex-wrap items-center gap-2 lg:w-auto lg:flex-nowrap">
                        <div className="relative min-w-0 flex-1 lg:w-72 lg:flex-none">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search blogs"
                                className="h-9 pl-8"
                                value={searchInput}
                                onChange={(e) => handleSearchInputChange(e.target.value)}
                            />


                            {/* API Call on Enter Key Press */}
                            {/* <Input
                                placeholder="Search blogs"
                                className="h-9 pl-8"
                                value={searchInput}
                                onChange={(e) => handleSearchInputChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearchSubmit();
                                    }
                                }}
                            /> */}
                        </div>

                        <Select value={sortOption} onValueChange={handlesortOptionChange}>
                            <SelectTrigger className="h-9 w-36 shrink-0 sm:w-40">
                                <SelectValue placeholder="Sort Blogs" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                            </SelectContent>
                        </Select>

                        {!isHomePage && (
                            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                                <SelectTrigger className="h-9 w-36 shrink-0 sm:w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        )}

                        {!isHomePage && (
                            <Button className="h-9 shrink-0" onClick={handleCreateBlog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Blog
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

export default BlogContainer;
