export const getStatusBadgeVariant = (status) => {
    switch (status) {
        case "published":
            return "default";
        case "draft":
            return "secondary";
        default:
            return "outline";
    }
};
