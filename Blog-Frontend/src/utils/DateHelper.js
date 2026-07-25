const formatBlogDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};
export { formatBlogDate };