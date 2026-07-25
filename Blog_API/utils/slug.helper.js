/**
 * Convert a title into a URL-safe slug that mirrors the title.
 * e.g. "Getting Started with React: A Beginner's Guide 1.0.0"
 *   -> "getting-started-with-react-a-beginners-guide-1-0-0"
 */
const slugify = (title = "") => {
    return String(title)
        .toLowerCase()
        .trim()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
};

module.exports = { slugify };
