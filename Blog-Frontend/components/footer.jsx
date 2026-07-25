import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const footerLinks = [
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms of Service" },
    { to: "/faq", label: "FAQ" },
];

const Footer = () => {
    return (
        <footer className="bg-background">
            <Separator />

            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-bold tracking-tight">
                            Bloggly
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Read, write, and share amazing stories.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground md:flex-row">
                    <p>
                        © {new Date().getFullYear()} Bloggly. All rights reserved.
                    </p>

                    <p>Made with ❤️ for readers and writers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
