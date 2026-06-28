"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./features/components/sideBar";
import NavBar from "./features/components/navBar";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/forgotpassword") ||
    pathname.includes("/verify");

  if (isAuthPage) {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen">
        {children}
      </div>
    );
  }

  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">

      {/* ================= MOBILE SIDEBAR ================= */}

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setMobileOpen(false)
            }
          />

          {/* Drawer */}
          <div className="relative w-[300px] h-screen p-5">

            <Sidebar
              open={true}
              setOpen={() => {}}
            />

            <button
              onClick={() =>
                setMobileOpen(false)
              }
              className="absolute top-6 right-6 bg-white rounded-full p-2 shadow"
            >
              <X size={20} />
            </button>

          </div>
        </div>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside
        className={`hidden lg:block fixed top-0 left-0 h-screen z-40 p-5 transition-all duration-300 ${
          open
            ? "w-[320px]"
            : "w-[120px]"
        }`}
      >
        <Sidebar
          open={open}
          setOpen={setOpen}
        />
      </aside>

      {/* ================= CONTENT ================= */}

      <div
        className={`flex flex-col w-full transition-all duration-300
        ${
          open
            ? "lg:ml-[320px]"
            : "lg:ml-[120px]"
        }`}
      >

        {/* ================= NAVBAR ================= */}

        <div className="p-3 md:p-5 pb-0">

          <div className="flex items-center gap-3">

            {/* Mobile menu */}
            <button
              className="lg:hidden bg-white rounded-xl shadow p-2"
              onClick={() =>
                setMobileOpen(true)
              }
            >
              <Menu size={22} />
            </button>

            <div className="flex-1">
              <NavBar />
            </div>

          </div>

        </div>

        {/* ================= PAGE ================= */}

        <main className="flex-1 p-3 md:p-5 pt-3 md:pt-5 overflow-hidden">

          <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-170px)] bg-white rounded-2xl md:rounded-[35px] shadow-xl border border-gray-100 overflow-y-auto p-4 md:p-6">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
} 