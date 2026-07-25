import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoggedUser, logoutUser } from "@/src/features/auth/authSlice";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LayoutDashboard, LogOut, FileText, UserRound } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(fetchLoggedUser());
        }
    }, [isAuthenticated, user, dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const username = user?.username || "Account";

    return (
        <header className="sticky top-0 z-50 border-b bg-background">
            <nav className="flex h-16 items-center justify-between px-5 sm:px-6 lg:px-8">
                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight transition-opacity hover:opacity-80"
                >
                    Bloggly
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link to="/blogs">
                        <Button size="lg" className="px-3 font-medium">
                            Blogs
                        </Button>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard">
                                <Button size="lg" className="px-4 font-medium">
                                    Dashboard
                                </Button>
                            </Link>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="group gap-2.5 border-border/80 bg-background pl-1.5 pr-3 font-medium shadow-sm hover:bg-muted/60"
                                    >
                                        <Avatar className="h-8 w-8 rounded-full border border-border/80 bg-muted shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]">
                                            <AvatarFallback className="bg-muted text-foreground/70">
                                                <UserRound
                                                    className="h-[18px] w-[18px] stroke-[1.75]"
                                                    absoluteStrokeWidth
                                                />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden max-w-28 truncate text-sm sm:inline">
                                            {username}
                                        </span>
                                        <ChevronDown className="size-3.5 opacity-50 transition-transform duration-200 group-data-[popup-open]:rotate-180" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem
                                        onClick={() => navigate("/dashboard")}
                                    >
                                        <LayoutDashboard className="mr-2 size-4" />
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => navigate("/dashboard/blogs")}
                                    >
                                        <FileText className="mr-2 size-4" />
                                        My Blogs
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2 size-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link to="/auth/login">
                                <Button size="lg" className="px-3 font-medium">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/auth/register">
                                <Button size="lg" className="px-4 font-medium">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
