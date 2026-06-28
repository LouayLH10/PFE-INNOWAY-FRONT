"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  MessageCircle,
  Search,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { getUserFromToken } from "../auth/pages/login/user";

function NavBar() {
  const pathname = usePathname();

  const [pageName, setPageName] =
    useState("");

  const user = getUserFromToken();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/features/dashboard/pages",
    },
    {
      name: "Quotes",
      path: "/features/quotes/pages",
    },
    {
      name: "Delivery Notes",
      path: "/features/delivery-note/pages",
    },
    {
      name: "Purchase Order",
      path: "/features/purchase-order/pages",
    },
    {
      name: "Invoices",
      path: "/features/invoice/pages",
    },
    {
      name: "Payments",
      path: "/features/payment/pages",
    },
    {
      name: "Projects",
      path: "/features/projects/pages",
    },
    {
      name: "Messages",
      path: "/features/messages/pages",
    },
  ];

  useEffect(() => {
    const currentItem =
      menuItems.find(
        (item) =>
          pathname === item.path
      );

    if (currentItem) {
      setPageName(currentItem.name);
    }
  }, [pathname]);

  const getColorFromName = (
    name: string
  ) => {
    if (!name)
      return "bg-gray-500";

    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];

    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash =
        name.charCodeAt(i) +
        ((hash << 5) - hash);
    }

    return colors[
      Math.abs(hash) % colors.length
    ];
  };

  return (
    <nav className="w-full bg-white rounded-2xl md:rounded-[30px] shadow-xl border border-gray-100 px-4 md:px-8 py-4 md:py-5">

      <div className="flex items-center justify-between gap-4">

        {/* LEFT */}
        <div className="min-w-0">

          <p className="text-xs md:text-sm text-gray-400 font-medium">
            Welcome Back
          </p>

          <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">
            {pageName}
          </h1>

        </div>

        {/* SEARCH */}
        <div className="hidden lg:flex items-center bg-[#f5f5f7] rounded-2xl px-4 py-3 w-[350px]">

          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-3 w-full text-sm text-gray-700 placeholder:text-gray-400"
          />

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* MESSAGE */}

          <a
            href="/features/messages/pages"
            className="relative w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#f5f5f7] hover:bg-[#edeaff] flex items-center justify-center text-gray-600 hover:text-[#6C4DFF] transition"
          >

            <MessageCircle
              size={18}
              className="md:w-[22px] md:h-[22px]"
            />

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#6C4DFF]" />

          </a>

          {/* NOTIFICATION */}

          <button className="relative w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#f5f5f7] hover:bg-[#edeaff] flex items-center justify-center text-gray-600 hover:text-[#6C4DFF] transition">

            <Bell
              size={18}
              className="md:w-[22px] md:h-[22px]"
            />

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500" />

          </button>

          {/* USER */}

          <div className="flex items-center gap-2 md:gap-3">

            <div className="hidden md:block text-right">

              <p className="font-semibold text-gray-800">
                {user?.name}
              </p>

            </div>

            <div
              className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${getColorFromName(
                user?.name ?? ""
              )} flex items-center justify-center text-white font-bold text-base md:text-lg shadow-md`}
            >
              {user?.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </div>

      </div>

    </nav>
  );
}

export default NavBar;