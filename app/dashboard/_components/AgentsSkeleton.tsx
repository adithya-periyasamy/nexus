"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AgentsSkeleton() {
    return (
        <div className="w-full mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="p-5 border rounded-2xl shadow animate-pulse"
                    >
                        <div className="flex items-start justify-between">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <Skeleton className="mt-3 h-6 w-3/4" />
                        <Skeleton className="mt-2 h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
