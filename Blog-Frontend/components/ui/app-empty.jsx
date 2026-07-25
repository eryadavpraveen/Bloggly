import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

import React from "react";
import { Button } from "./button";
import { Plus } from "lucide-react";

const AppEmpty = ({
    title = "No data",
    description = "No data found",
    buttonText = "Add data",
    icon: Icon = Plus,
    onAddClick,
    showButton = true
}) => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Icon className="h-12 w-12" />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            {showButton && onAddClick && (
                <EmptyContent>
                    <Button onClick={onAddClick}>
                        <Plus className="h-4 w-4 mr-2" />
                        {buttonText}
                    </Button>
                </EmptyContent>
            )}
        </Empty>
    );
};

export default AppEmpty;
