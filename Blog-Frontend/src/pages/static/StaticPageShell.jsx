import React from "react";

const StaticPageShell = ({ title, description, children }) => {
    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <div className="mb-10 space-y-3">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {title}
                </h1>
                {description ? (
                    <p className="text-base text-muted-foreground md:text-lg">
                        {description}
                    </p>
                ) : null}
            </div>

            <div className="space-y-6 text-sm leading-7 text-muted-foreground md:text-base">
                {children}
            </div>
        </div>
    );
};

export default StaticPageShell;
