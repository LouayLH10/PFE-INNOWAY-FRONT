"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { fetchQuote } from "../service/quoteService";
import { downloadQuote } from "../service/quoteService";

type Quote = {
  id: number;
  adresse: string;
  phone: string;
  email: string;
  webSite?: string;
  subject: string;
  amount: number;
  tva: number;
  totalAmount: number;
  createdAt: string;
  reference: string;
  status: string;

  contact: {
    user?: {
      email?: string;
    };
  };
};

function Page() {
  const [quote, setQuote] = useState<Quote[]>([]);
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
const filteredQuote = quote.filter((d) =>
  d.reference.toLowerCase().includes(query.toLowerCase()) ||
  d.email.toLowerCase().includes(query.toLowerCase()) ||
  d.subject.toLowerCase().includes(query.toLowerCase()) ||
  d.totalAmount.toString().includes(query)
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
        const data = await fetchQuote(user.sub);

        setQuote(data); // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des quote");
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
  <div className="p-3 sm:p-6 mt-2 sm:mt-5">

    <SearchBar
      value={query}
      onChange={setQuery}
      placeholder="Search quote..."
    />

    {loading && (
      <p className="mt-5">Loading...</p>
    )}

    {error && (
      <p className="mt-5 text-red-500">{error}</p>
    )}

    {!loading && !error && (
      <>

        {/* ========================= */}
        {/* DESKTOP TABLE */}
        {/* ========================= */}

        <div className="hidden lg:block overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100 mt-5">

          <table className="min-w-full text-sm text-gray-700">

            <thead className="bg-gray-50 border-b border-gray-200">

              <tr className="text-gray-500 text-xs uppercase">

                <th className="px-6 py-5 text-left">
                  Reference
                </th>

                <th className="px-6 py-5 text-left">
                  Email
                </th>

                <th className="px-6 py-5 text-left">
                  Website
                </th>

                <th className="px-6 py-5 text-left">
                  Description
                </th>

                <th className="px-6 py-5 text-left">
                  Amount
                </th>

                <th className="px-6 py-5 text-left">
                  TVA
                </th>

                <th className="px-6 py-5 text-left">
                  Total
                </th>

                <th className="px-6 py-5 text-left">
                  Status
                </th>

                <th className="px-6 py-5 text-left">
                  Created
                </th>

                <th className="px-6 py-5 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredQuote.length === 0 ? (

                <tr>

                  <td
                    colSpan={10}
                    className="text-center py-10"
                  >
                    No results found
                  </td>

                </tr>

              ) : (

                filteredQuote.map((d, index) => {

                  const statusObj = Status(d.status);

                  return (

                    <tr
                      key={d.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50/40"
                      }`}
                    >

                      <td className="px-6 py-5 font-semibold">
                        {d.reference}
                      </td>

                      <td className="px-6 py-5">
                        {d.contact?.user?.email || d.email}
                      </td>

                      <td className="px-6 py-5">

                        {d.webSite ? (

                          <a
                            href={d.webSite}
                            target="_blank"
                            className="text-blue-600 hover:underline"
                          >
                            Visit
                          </a>

                        ) : (
                          "-"
                        )}

                      </td>

                      <td className="px-6 py-5">
                        {d.subject}
                      </td>

                      <td className="px-6 py-5">
                        {d.amount} TND
                      </td>

                      <td className="px-6 py-5">
                        {d.tva}%
                      </td>

                      <td className="px-6 py-5 font-bold">
                        {d.totalAmount} TND
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
                          disabled={d.status !== "READY"}
                          onClick={() =>
                            downloadQuote(d.id)
                          }
                          className={`px-4 py-2 rounded-xl text-white ${
                            d.status === "READY"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-300"
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

        {/* ========================= */}
        {/* MOBILE CARDS */}
        {/* ========================= */}

        <div className="lg:hidden mt-5 space-y-4">

          {filteredQuote.length === 0 ? (

            <div className="bg-white rounded-3xl p-6 text-center">

              No results found

            </div>

          ) : (

            filteredQuote.map((d) => {

              const statusObj = Status(d.status);

              return (

                <div
                  key={d.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h2 className="font-bold text-lg">
                        {d.reference}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {formatDate(d.createdAt)}
                      </p>

                    </div>

                    <span
                      className={`${statusObj.style} px-3 py-1 rounded-full text-xs`}
                    >
                      {statusObj.state}
                    </span>

                  </div>

                  <div className="mt-4 space-y-2 text-sm">

                    <p>

                      <span className="font-semibold">
                        Email :
                      </span>{" "}

                      {d.contact?.user?.email || d.email}

                    </p>

                    <p>

                      <span className="font-semibold">
                        Description :
                      </span>{" "}

                      {d.subject}

                    </p>

                    <p>

                      <span className="font-semibold">
                        Amount :
                      </span>{" "}

                      {d.amount} TND

                    </p>

                    <p>

                      <span className="font-semibold">
                        TVA :
                      </span>{" "}

                      {d.tva}%

                    </p>

                    <p>

                      <span className="font-semibold">
                        Total :
                      </span>{" "}

                      {d.totalAmount} TND

                    </p>

                    {d.webSite && (

                      <a
                        href={d.webSite}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Visit Website
                      </a>

                    )}

                  </div>

                  <button
                    disabled={d.status !== "READY"}
                    onClick={() =>
                      downloadQuote(d.id)
                    }
                    className={`mt-5 w-full py-3 rounded-xl text-white font-semibold ${
                      d.status === "READY"
                        ? "bg-green-600"
                        : "bg-gray-300"
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