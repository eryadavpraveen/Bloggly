import React from "react";
import { Link } from "react-router-dom";
import StaticPageShell from "./StaticPageShell";

const faqs = [
    {
        question: "Is Bloggly free to use?",
        answer:
            "Yes. You can create an account, publish blogs, like posts, and leave comments without a paid plan.",
    },
    {
        question: "How do I publish a blog?",
        answer:
            "Sign in, open your dashboard, go to Create Blog, write your post, then choose Save as Draft or Publish.",
    },
    {
        question: "Can I edit or delete a published blog?",
        answer:
            "Yes. Open your blog from the dashboard and use Update Blog or Delete Blog. Only the author can manage that post.",
    },
    {
        question: "Why do I need to log in to like or comment?",
        answer:
            "Likes and comments are tied to your account so interactions stay authentic and you can manage your own activity.",
    },
    {
        question: "How does sharing a blog work?",
        answer:
            "Use Share on a blog card or blog page. On supported devices a share sheet opens; otherwise the public blog link is copied.",
    },
    {
        question: "Who can see my drafts?",
        answer:
            "Drafts are only available to you in your dashboard. Published blogs are visible on the public blogs feed.",
    },
];

const FAQPage = () => {
    return (
        <StaticPageShell
            title="FAQ"
            description="Quick answers to common questions about Bloggly."
        >
            <div className="space-y-4">
                {faqs.map((item) => (
                    <details
                        key={item.question}
                        className="group rounded-lg border bg-card px-4 py-3 open:pb-4"
                    >
                        <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                            <div className="flex items-center justify-between gap-3">
                                <span>{item.question}</span>
                                <span className="text-muted-foreground transition group-open:rotate-45">
                                    +
                                </span>
                            </div>
                        </summary>
                        <p className="mt-3 text-muted-foreground">{item.answer}</p>
                    </details>
                ))}
            </div>

            <p className="pt-2">
                Still stuck?{" "}
                <Link
                    to="/contact"
                    className="font-medium text-foreground underline underline-offset-4"
                >
                    Contact us
                </Link>
                .
            </p>
        </StaticPageShell>
    );
};

export default FAQPage;
