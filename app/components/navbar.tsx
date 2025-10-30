"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "#hero", title: "Home" },
  { href: "#about", title: "Schedule" },
  { href: "#gallery", title: "Events" },
  { href: "#speakers", title: "Coordinators" },
  { href: "#guidelines", title: "FAQ" },
];

export function Navbar({
  onToggleTheme,
  isDark,
}: {
  onToggleTheme?: () => void;
  isDark?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.nav
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-x-0 mx-auto h-20 flex w-screen items-center justify-around  border px-3 py-2 sm:px-4 z-50 shadow-lg
        bg-white/80 border-gray-200 text-neutral-800 backdrop-blur-md
        dark:bg-black/80 dark:border-gray-700/30 dark:text-neutral-100"
    >

      <Link href={"/"}>
        <Image
          className="h-11 w-15 md:w-15 "
          src="/bvicam.png"
          height={40}
          width={40}
          alt="avatar"
        />
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center space-x-2">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            className="relative px-3 py-1 text-sm font-medium transition-colors duration-200
              text-neutral-700 hover:text-blue-500
              dark:text-neutral-300 dark:hover:text-blue-300"
            href={item.href}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === idx && (
              <motion.span
                layoutId="hovered-span"
                className="absolute inset-0 rounded-2xl bg-neutral-100 dark:bg-neutral-800"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.title}</span>
          </Link>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 items-center">


        <Link
          href="/register"
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md
            dark:bg-gradient-to-red dark:from-blue-600 dark:to-blue-800 dark:hover:bg-blue-700"
        >
          Sign in
        </Link>

        <motion.button
          aria-label="Toggle theme"
          onClick={onToggleTheme}
          className="ml-4 p-2 rounded-full border border-transparent bg-neutral-100 hover:bg-neutral-200 transition-colors shadow
            dark:bg-neutral-900 dark:hover:bg-neutral-800"
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-blue-900" />
          )}
        </motion.button>
      </div>
    </motion.nav>
  );
}
