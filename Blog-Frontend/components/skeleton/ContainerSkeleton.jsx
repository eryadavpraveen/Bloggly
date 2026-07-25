import { Skeleton } from "@/components/ui/skeleton";

const ContainerSkeleton = () => {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="rounded-xl border bg-background p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-72" />
                    </div>

                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-10 w-40" />
                        <Skeleton className="h-10 w-44" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>

            {/* Blog Cards */}
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="space-y-3 rounded-xl border p-4"
                    >
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="flex justify-between pt-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContainerSkeleton;