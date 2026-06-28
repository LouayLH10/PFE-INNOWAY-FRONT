"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { fetchInvoice } from "../service/invoiceService";
import { downloadInvoice } from "../service/invoiceService";

type Invoice = {
  id: number;
  adresse: string;
  phone: string;
  email: string;
  webSite: string;
  name: string;
  total: number;
  tva: number;
  subTotal: number;
  createdAt: string;
  validatedAt?: string;
  reference: string;
  status: string;
  contact:{
    user:{
      email:String
    };
  };
  
};

function Page() {
  const [invoice, setInvoice] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [query, setQuery] = useState("");

  const router = useRouter();

  // ✅ format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // ✅ filter
  const filteredInvoice = invoice.filter((d) =>
    d.reference?.toLowerCase().includes(query.toLowerCase()) ||
    d.email?.toLowerCase().includes(query.toLowerCase()) ||
    d.name?.toLowerCase().includes(query.toLowerCase()) ||
    d.total?.toString().includes(query)
  );

  // ✅ AUTH + FETCH
  useEffect(() => {
    const user = getUserFromToken();

    if (!user) {
      router.push("/features/auth/pages/login");
      return;
    }

    setIsAuthChecked(true);

    const fetchDev = async () => {
      try {
        setLoading(true);

        // ❗ CORRECTION ICI
        const data = await fetchInvoice(user.sub);

        setInvoice(data); // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchDev();
  }, [router]);

  // ✅ DOWNLOAD


  // ✅ STATUS
  const Status = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          state: "DRAFT",
          style: "bg-yellow-500 text-white px-2 py-1 rounded",
        };
      case "SENT":
        return {
          state: "SENT",
          style: "bg-blue-500 text-white px-2 py-1 rounded",
        };
      case "PAID":
        return {
          state: "PAID",
          style: "bg-green-500 text-white px-2 py-1 rounded",
        };
      default:
        return {
          state: status,
          style: "bg-gray-400 text-white px-2 py-1 rounded",
        };
    }
  };

  if (!isAuthChecked) return null;

  return (
<div className="p-6 mt-5 ">     

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search invoice..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

{!loading && !error && (
  <>
    {/* ================= DESKTOP ================= */}
    <div className="hidden lg:block overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-200">
      <table className="min-w-full text-sm text-gray-700">

        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="px-6 py-5 text-left">Reference</th>
            <th className="px-6 py-5 text-left">Email</th>
            <th className="px-6 py-5 text-left">Website</th>
            <th className="px-6 py-5 text-left">Description</th>
            <th className="px-6 py-5 text-left">Amount</th>
            <th className="px-6 py-5 text-left">TVA</th>
            <th className="px-6 py-5 text-left">Total</th>
            <th className="px-6 py-5 text-left">Status</th>
            <th className="px-6 py-5 text-left">Created At</th>
            <th className="px-6 py-5 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {filteredInvoice.length === 0 ? (
            <tr>
              <td
                colSpan={10}
                className="text-center py-10 text-gray-400"
              >
                No results found
              </td>
            </tr>
          ) : (
            filteredInvoice.map((d, index) => {
              const statusObj = Status(d.status);

              return (
                <tr
                  key={d.id}
                  className={`transition hover:bg-gray-50 ${
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-6 py-5 font-semibold">
                    {d.reference}
                  </td>

                  <td className="px-6 py-5">
                    {d.contact?.user?.email}
                  </td>

                  <td className="px-6 py-5">
                    <a
                      href={d.webSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit
                    </a>
                  </td>

                  <td className="px-6 py-5">
                    {d.name}
                  </td>

                  <td className="px-6 py-5">
                    {d.subTotal} TND
                  </td>

                  <td className="px-6 py-5">
                    {d.tva * 100}%
                  </td>

                  <td className="px-6 py-5 font-bold">
                    {d.total} TND
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`${statusObj.style} px-3 py-1 rounded-full text-xs`}
                    >
                      {statusObj.state}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    {formatDate(d.createdAt)}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      disabled={
                        d.status !== "SENT" &&
                        d.status !== "PAID"
                      }
                      onClick={() =>
                        downloadInvoice(d.id)
                      }
                      className={`px-5 py-2 rounded-xl text-white ${
                        d.status === "SENT" ||
                        d.status === "PAID"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>

      </table>
    </div>

    {/* ================= MOBILE ================= */}
    <div className="lg:hidden space-y-4">

      {filteredInvoice.length === 0 ? (
        <div className="bg-white rounded-3xl p-6 text-center text-gray-400 shadow-sm">
          No results found
        </div>
      ) : (
        filteredInvoice.map((d) => {
          const statusObj = Status(d.status);

          return (
            <div
              key={d.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex justify-between items-center">

                <h3 className="font-bold text-lg">
                  {d.reference}
                </h3>

                <span
                  className={`${statusObj.style} px-3 py-1 rounded-full text-xs`}
                >
                  {statusObj.state}
                </span>

              </div>

              <div className="mt-4 space-y-2 text-sm">

                <p>
                  <span className="font-semibold">
                    Email:
                  </span>{" "}
                  {d.contact?.user?.email}
                </p>

                <p>
                  <span className="font-semibold">
                    Website:
                  </span>{" "}
                  <a
                    href={d.webSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Visit
                  </a>
                </p>

                <p>
                  <span className="font-semibold">
                    Description:
                  </span>{" "}
                  {d.name}
                </p>

                <p>
                  <span className="font-semibold">
                    Amount:
                  </span>{" "}
                  {d.subTotal} TND
                </p>

                <p>
                  <span className="font-semibold">
                    TVA:
                  </span>{" "}
                  {d.tva * 100}%
                </p>

                <p className="text-lg font-bold text-[#6C4DFF]">
                  {d.total} TND
                </p>

                <p className="text-xs text-gray-500">
                  {formatDate(d.createdAt)}
                </p>

              </div>

              <button
                disabled={
                  d.status !== "SENT" &&
                  d.status !== "PAID"
                }
                onClick={() =>
                  downloadInvoice(d.id)
                }
                className={`w-full mt-5 py-3 rounded-2xl text-white font-semibold ${
                  d.status === "SENT" ||
                  d.status === "PAID"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Download
              </button>
            </div>
          );
        })
      )}

    </div>
  </>
)}
    </div>
  );
}

export default Page;