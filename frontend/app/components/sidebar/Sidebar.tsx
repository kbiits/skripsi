"use client";
import useRoutes from "@/app/hooks/useRoutes";
import Link from "next/link";
import clsx from "clsx";
import { useAuthStore } from "@/app/context/AuthContext";

function Sidebar({ children }: { children: React.ReactNode }) {
  const routes = useRoutes();

  return (
    <div className=" h-full">
      <div
        className={clsx(
          "hidden justify-between lg:fixed lg:flex lg:flex-col",
          "lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 lg:border-r-[1px] ",
          "xl:px-6 "
        )}
      >
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {routes.map((route) => (
              <li onClick={route.onClick} title={route.label} key={route.label}>
                <Link
                  href={route.href}
                  className={clsx(
                    "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100",
                    route.active && "bg-gray-100 text-black"
                  )}
                >
                  <route.icon className="h-6 w-6 shrink-0" />
                  <span className="sr-only">{route.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <main className="h-full lg:pl-20 flex flex-col">{children}</main>

      <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
        {routes.map((route) => (
          <Link
            key={route.label}
            href={route.href}
            onClick={route.onClick}
            className={clsx(
              "group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100",
              route.active && "bg-gray-100 text-black"
            )}
          >
            <route.icon className="h-6 w-6" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
