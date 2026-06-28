"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "./features/components/sideBar";
import NavBar from "./features/components/navBar";

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

  // Desktop sidebar
  const [open, setOpen] = useState(true);

  // Mobile sidebar
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [isDesktop, setIsDesktop] =
    useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(
        window.innerWidth >= 1024
      );

      if (
        window.innerWidth >= 1024
      ) {
        setMobileOpen(false);
      }
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f5f7fb] flex overflow-hidden">

      {/* ================= MOBILE ================= */}

      {!isDesktop && (
        <>
          {/* Overlay */}

          {mobileOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() =>
                setMobileOpen(false)
              }
            />
          )}

          {/* Sidebar */}

          <aside
            className={`fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ${
              mobileOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
          >
            <div className="relative h-full p-5">

              <button
                onClick={() =>
                  setMobileOpen(false)
                }
                className="absolute top-7 right-7 bg-white rounded-full p-2 shadow-lg z-50"
              >
                <X size={18} />
              </button>

              <Sidebar
                open={true}
                setOpen={setOpen}
              />
            </div>
          </aside>
        </>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}

      {isDesktop && (
        <aside
          className={`fixed top-0 left-0 h-screen z-50 p-5 transition-all duration-300 ${
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
      )}

      {/* ================= CONTENT ================= */}

      <div
        className={`flex flex-col transition-all duration-300 min-h-screen min-w-0
        ${
          isDesktop
            ? open
              ? "ml-[320px] w-[calc(100%-320px)]"
              : "ml-[120px] w-[calc(100%-120px)]"
            : "w-full"
        }`}
      >

        {/* Mobile menu button */}

        {!isDesktop && (
          <div className="px-4 pt-4">

            <button
              onClick={() =>
                setMobileOpen(true)
              }
              className="w-11 h-11 rounded-xl bg-white shadow flex items-center justify-center"
            >
              <Menu size={22} />
            </button>

          </div>
        )}

        {/* Navbar */}

        <div
          className={`${
            isDesktop
              ? "p-5 pb-0"
              : "p-4 pb-0"
          }`}
        >
          <NavBar />
        </div>

        {/* Main */}

        <main className="flex-1 p-4 lg:p-5 pt-4 overflow-hidden min-w-0">

          <div
            className={`
            w-full
            min-w-0
            bg-white
            rounded-[35px]
            shadow-xl
            border
            border-gray-100
            overflow-y-auto
            overflow-x-hidden
            ${
              isDesktop
                ? "h-[calc(100vh-170px)] p-6"
                : "min-h-[calc(100vh-150px)] p-4"
            }
          `}
          >
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}