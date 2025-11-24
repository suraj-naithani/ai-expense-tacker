import { FileText, LogOut, MoveUpRight, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
    label: string;
    value?: string;
    href: string;
    icon?: React.ReactNode;
    external?: boolean;
}

interface ProfileProps {
    name?: string;
    role?: string;
    avatar?: string;
}

const defaultProfile: Required<ProfileProps> = {
    name: "Eugene An",
    role: "Prompt Engineer",
    avatar: "/avatar.png",
};

export default function Profile({
    name = defaultProfile.name,
    role = defaultProfile.role,
    avatar = defaultProfile.avatar,
}: ProfileProps = defaultProfile) {
    const menuItems: MenuItem[] = [
        {
            label: "Profile",
            href: "#",
            icon: <User className="w-4 h-4" />,
            external: false,
        },
        {
            label: "Settings",
            href: "#",
            icon: <Settings className="w-4 h-4" />,
        },
        {
            label: "Terms & Policies",
            href: "#",
            icon: <FileText className="w-4 h-4" />,
            external: true,
        },
    ];

    return (
        <div className="w-full max-w-[220px] mx-auto">
            <div className="relative overflow-hidden rounded-2xl">
                <div className="relative px-3 pt-6 pb-3">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="relative shrink-0">
                            <Image
                                src={avatar}
                                alt={name}
                                width={42}
                                height={42}
                                className="rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                                {name}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug break-words">
                                {role}
                            </p>
                        </div>
                    </div>
                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-3" />
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-2">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                                <div className="flex items-center">
                                    {item.value && (
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-2">
                                            {item.value}
                                        </span>
                                    )}
                                    {item.external && <MoveUpRight className="w-4 h-4" />}
                                </div>
                            </Link>
                        ))}

                        <button
                            type="button"
                            className="w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-2">
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
