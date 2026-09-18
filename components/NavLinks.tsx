// creating a reusable navlinks components that will imported into the reusable header component. This will make the code more modular and easier to maintain.

"use client"; // this is a client component, so it can use state and effects

import Link from "next/link";

import { usePathname } from "next/navigation";

const links = [

    { href: "/", label: "Home" },

    { href: "/about", label: "About" },

    { href: "/projects", label: "Projects" },

    { href: "/contact", label: "Contact" },

];

export default function NavLinks() {

    const pathname = usePathname();

    return (
        
        <ul className="flex gap-6">

            {links.map(({ href, label }) => {

                const isActive = pathname === href;

                return (

                    <li key={href}>

                        <Link
                            
                            href={href}

                            aria-current={isActive ? "page" : undefined}

                            className={isActive ? "font-semibold text-yellow-300 underline" : "text-white hover:text-gray-300"}
                        >
                            {label}

                        </Link>

                    </li>

                );

            })}

        </ul>

    );

}