"use client";

import Link from "next/link";
import { busMenu } from "../config/busMenu";

export function BusSidebar() {
  return (
    <aside className="hidden md:block w-64 shrink-0 mt-4">
      <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto pr-2">
        <nav className="space-y-6">
          {busMenu
            .filter((cat) => cat.title !== "Главное")
            .map((cat) => (
              <div key={cat.title}>
                <div className="px-1 text-xs uppercase tracking-wide text-gray-900 font-semibold mb-2 border-b border-gray-200 pb-1">
                  {cat.title}
                </div>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className="block rounded-md px-2 py-1.5 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </nav>
      </div>
    </aside>
  );
}
