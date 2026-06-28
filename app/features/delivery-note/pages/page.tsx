"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { downloadDN,fetchDN } from "../service/deliveryNoteService";

type DeliveryNote = {
  id: number;
  reference: string;

  deliveryDate: string;
  location: string;

  status: string;

  createdAt: string;

  contact: {
    user?: {
      email?: string;
      name?: string;
    };
    phone?: string;
  };

  items: {
    id: number;
    description: string;
    quantity: number;
    unity: string;
  }[];
};

function Page() {
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>([]);
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
const filteredDN = deliveryNotes.filter((dn) =>
  dn.reference.toLowerCase().includes(query.toLowerCase()) ||
  dn.location.toLowerCase().includes(query.toLowerCase()) ||
  dn.contact?.user?.email?.toLowerCase().includes(query.toLowerCase())
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
        const data = await fetchDN(user.sub);

        setDeliveryNotes(data); // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des Delivery Note");
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
    case "PENDING":
      return {
        state: "PENDING",
        style: "bg-yellow-500 text-white px-2 py-1 rounded",
      };
    case "DELIVERED":
      return {
        state: "DELIVERED",
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
  <div className="p-4 sm:p-6 mt-5">

    <SearchBar
      value={query}
      onChange={setQuery}
      placeholder="Search Delivery Note..."
    />

    {loading && (
      <p className="mt-6 text-center">
        Loading...
      </p>
    )}

    {error && (
      <p className="mt-6 text-center text-red-500">
        {error}
      </p>
    )}

    {!loading && !error && (
      <>
        {/* ========================= */}
        {/* Desktop */}
        {/* ========================= */}

        <div className="hidden lg:block overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-200">

          <table className="min-w-full text-sm text-gray-700">

            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>

                <th className="px-6 py-5 text-left">
                  Reference
                </th>

                <th className="px-6 py-5 text-left">
                  Client
                </th>

                <th className="px-6 py-5 text-left">
                  Email
                </th>

                <th className="px-6 py-5 text-left">
                  Location
                </th>

                <th className="px-6 py-5 text-left">
                  Delivery Date
                </th>

                <th className="px-6 py-5 text-left">
                  Items
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

            <tbody className="divide-y divide-gray-100">

              {filteredDN.length === 0 ? (

                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-10 text-gray-400"
                  >
                    No results found
                  </td>
                </tr>

              ) : (

                filteredDN.map((dn, index) => {

                  const statusObj = Status(dn.status);

                  return (

                    <tr
                      key={dn.id}
                      className={`hover:bg-gray-50 ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50/40"
                      }`}
                    >

                      <td className="px-6 py-5 font-semibold">
                        {dn.reference}
                      </td>

                      <td className="px-6 py-5">
                        {dn.contact?.user?.name || "-"}
                      </td>

                      <td className="px-6 py-5">
                        {dn.contact?.user?.email || "-"}
                      </td>

                      <td className="px-6 py-5">
                        {dn.location}
                      </td>

                      <td className="px-6 py-5">
                        {formatDate(
                          dn.deliveryDate
                        )}
                      </td>

                      <td className="px-6 py-5">
                        {dn.items?.length || 0}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusObj.style}`}
                        >
                          {statusObj.state}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {formatDate(
                          dn.createdAt
                        )}
                      </td>

                      <td className="px-6 py-5">

                        <button
                          onClick={() =>
                            downloadDN(dn.id)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm transition"
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
        {/* Mobile */}
        {/* ========================= */}

        <div className="lg:hidden space-y-4">

          {filteredDN.length === 0 ? (

            <div className="bg-white rounded-3xl p-8 text-center text-gray-400">
              No results found
            </div>

          ) : (

            filteredDN.map((dn) => {

              const statusObj = Status(dn.status);

              return (

                <div
                  key={dn.id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="font-bold text-lg">
                        {dn.reference}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        {dn.contact?.user?.name}
                      </p>

                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusObj.style}`}
                    >
                      {statusObj.state}
                    </span>

                  </div>

                  <div className="mt-5 space-y-2 text-sm">

                    <p>
                      <span className="font-semibold">
                        Email:
                      </span>{" "}
                      {dn.contact?.user?.email}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Location:
                      </span>{" "}
                      {dn.location}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Delivery:
                      </span>{" "}
                      {formatDate(
                        dn.deliveryDate
                      )}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Items:
                      </span>{" "}
                      {dn.items?.length || 0}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Created:
                      </span>{" "}
                      {formatDate(
                        dn.createdAt
                      )}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      downloadDN(dn.id)
                    }
                    className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
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